const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

async function getCasos(req, res, next) {
    try {
        const { status, agente_id, search } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (agente_id) filters.agente_id = parseInt(agente_id, 10);
        if (search) filters.search = search;

        const casos = await casosRepository.findFiltered(filters);
        return res.status(200).json(casos);
    } catch (err) {
        next(err);
    }
}

async function getAgenteCaso(req, res, next) {
    try {
        const { caso_id } = req.params;
        const casoIdInt = parseInt(caso_id, 10);
        const caso = await casosRepository.findCaso(casoIdInt);

        if (!caso) {
            const error = new Error('Caso não encontrado');
            error.status = 404;
            return next(error);
        }

        if (!caso.agente_id) {
            const error = new Error('Caso não possui agente associado');
            error.status = 404;
            return next(error);
        }

        const agente = await agentesRepository.findAgente(caso.agente_id);
        if (!agente) {
            const error = new Error('Agente não encontrado');
            error.status = 404;
            return next(error);
        }

        return res.status(200).json(agente);
    } catch (err) {
        next(err);
    }
}

async function listID(req, res) {
    const { id } = req.params;
    const casoIdInt = parseInt(id, 10);
    const caso = await casosRepository.findCaso(casoIdInt);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    return res.status(200).json(caso);
}

async function addCaso(req, res) {
    const casoData = req.body;

    if (
        !casoData ||
        !casoData.titulo ||
        !casoData.descricao ||
        !casoData.status ||
        !casoData.agente_id
    ) {
        return res.status(400).json({ message: 'Dados do caso incompletos ou inválidos' });
    }

    if (!isStatusValido(casoData.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    const agenteIdInt = parseInt(casoData.agente_id, 10);
    const agenteExiste = await agentesRepository.findAgente(agenteIdInt);
    if (!agenteExiste) {
        return res.status(404).json({ message: 'Agente responsável não encontrado' });
    }

    casoData.agente_id = agenteIdInt;
    const novoCaso = await casosRepository.addCaso(casoData);

    return res.status(201).json(novoCaso);
}

async function updateCasoFull(req, res) {
    const { id } = req.params;
    const casoIdInt = parseInt(id, 10);
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'Conteúdo inválido' });
    }

    if (novosDados.id) delete novosDados.id;

    const caso = await casosRepository.findCaso(casoIdInt);
    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    if (
        !novosDados.titulo ||
        !novosDados.descricao ||
        !novosDados.status ||
        !novosDados.agente_id
    ) {
        return res.status(400).json({ message: 'Dados do caso incompletos ou inválidos' });
    }

    if (!isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    const agenteIdInt = parseInt(novosDados.agente_id, 10);
    const agenteExiste = await agentesRepository.findAgente(agenteIdInt);
    if (!agenteExiste) {
        return res.status(404).json({ message: 'Agente responsável não encontrado' });
    }

    novosDados.agente_id = agenteIdInt;
    const casoAtualizado = await casosRepository.updateCaso(casoIdInt, novosDados);

    return res.status(200).json(casoAtualizado);
}

async function updateCaso(req, res) {
    const { id } = req.params;
    const casoIdInt = parseInt(id, 10);
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'Conteúdo inválido' });
    }

    const casoExistente = await casosRepository.findCaso(casoIdInt);
    if (!casoExistente) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    if (novosDados.id) delete novosDados.id;

    if (novosDados.status && !isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    if (novosDados.agente_id) {
        const agenteIdInt = parseInt(novosDados.agente_id, 10);
        const agenteExiste = await agentesRepository.findAgente(agenteIdInt);
        if (!agenteExiste) {
            return res.status(404).json({ message: 'Agente responsável não encontrado' });
        }
        novosDados.agente_id = agenteIdInt;
    }

    const casoAtualizado = await casosRepository.updateCaso(casoIdInt, novosDados);

    return res.status(200).json(casoAtualizado);
}

async function deleteCaso(req, res) {
    const { id } = req.params;
    const casoIdInt = parseInt(id, 10);

    const casoRemovido = await casosRepository.removeCaso(casoIdInt);
    if (!casoRemovido) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    return res.status(204).send();
}

async function searchCasos(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Query de busca não fornecida' });
    }

    const casos = (await casosRepository.findAll()).filter(caso =>
        caso.titulo.toLowerCase().includes(q.toLowerCase()) ||
        caso.descricao.toLowerCase().includes(q.toLowerCase())
    );

    return res.status(200).json(casos);
}

module.exports = {
    getAllCasos,
    getCasos,
    getAgenteCaso,
    listID,
    addCaso,
    updateCasoFull,
    updateCaso,
    deleteCaso,
    searchCasos
};
