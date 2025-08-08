const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

const STATUS_VALIDOS = ['solucionado', 'aberto'];

function isStatusValido(status) {
    return STATUS_VALIDOS.includes(status);
}

function getAllCasos(req, res) {
    const casos = casosRepository.findAll();
    res.json(casos);
}

function getCasos(req, res) {
    const { status, agente_id, search } = req.query;
    let casos = casosRepository.findAll();

    if (status) {
        casos = casos.filter((caso) => caso.status === status);
    }

    if (agente_id) {
        casos = casos.filter((caso) => caso.agente_id === agente_id);
    }

    if (search) {
        casos = casos.filter(
            (caso) =>
                caso.titulo.toLowerCase().includes(search.toLowerCase()) ||
                caso.descricao.toLowerCase().includes(search.toLowerCase())
        );
    }

    return res.status(200).json(casos);
}

function getAgenteCaso(req, res) {
    const { id } = req.params;
    const caso = casosRepository.findCaso(id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    if (!caso.agente_id) {
        return res.status(404).json({ message: 'Caso não possui agente associado' });
    }

    const agente = agentesRepository.findAgente(caso.agente_id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    return res.status(200).json(agente);
}

function listID(req, res) {
    const { id } = req.params;
    const caso = casosRepository.findCaso(id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    return res.status(200).json(caso);
}

function addCaso(req, res) {
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

    const agenteExiste = agentesRepository.findAgente(casoData.agente_id);
    if (!agenteExiste) {
        return res.status(404).json({ message: 'Agente responsável não encontrado' });
    }

    const novoCaso = casosRepository.addCaso(casoData);

    return res.status(201).json(novoCaso);
}

function updateCasoFull(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'Conteúdo inválido' });
    }

    if (novosDados.id) delete novosDados.id;

    const caso = casosRepository.findCaso(id);
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

    const agenteExiste = agentesRepository.findAgente(novosDados.agente_id);
    if (!agenteExiste) {
        return res.status(404).json({ message: 'Agente responsável não encontrado' });
    }

    const casoAtualizado = { id, ...novosDados };
    casosRepository.updateCaso(id, casoAtualizado);

    return res.status(200).json(casoAtualizado);
}

function updateCaso(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'Conteúdo inválido' });
    }

    const casoExistente = casosRepository.findCaso(id);
    if (!casoExistente) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    if (novosDados.id) delete novosDados.id;

    if (novosDados.status && !isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    if (novosDados.agente_id) {
        const agenteExiste = agentesRepository.findAgente(novosDados.agente_id);
        if (!agenteExiste) {
            return res.status(404).json({ message: 'Agente responsável não encontrado' });
        }
    }

    const casoAtualizado = {
        ...casoExistente,
        ...novosDados,
        id: casoExistente.id
    };

    casosRepository.updateCaso(id, casoAtualizado);

    return res.status(200).json(casoAtualizado);
}

function deleteCaso(req, res) {
    const { id } = req.params;

    const casoRemovido = casosRepository.removeCaso(id);
    if (!casoRemovido) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    return res.status(204).send();
}

function searchCasos(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Query de busca não fornecida' });
    }

    const casos = casosRepository.findAll().filter(caso =>
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
