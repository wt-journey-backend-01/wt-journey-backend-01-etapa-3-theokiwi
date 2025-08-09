const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

function validarAgenteId(agente_id) {
    const id = parseInt(agente_id, 10);
    return !isNaN(id) && id > 0;
}

async function getAllCasos(req, res, next) {
    try {
        const casos = await casosRepository.findAll();
        res.json(casos);
    } catch (err) {
        next(err);
    }
}

async function getCasos(req, res, next) {
    try {
        const { status, agente_id, search } = req.query;
        const filtros = {};

        if (status) filtros.status = status;

        if (agente_id) {
            if (!validarAgenteId(agente_id)) {
                return res.status(400).json({ message: 'Agente ID inválido' });
            }
            filtros.agente_id = parseInt(agente_id, 10);
        }

        if (search) filtros.search = search;

        const casos = await casosRepository.findFiltered(filtros);
        return res.status(200).json(casos);
    } catch (err) {
        next(err);
    }
}

async function getAgenteCaso(req, res, next) {
    try {
        const caso_id = parseInt(req.params.caso_id, 10);
        if (isNaN(caso_id) || caso_id <= 0) {
            return res.status(400).json({ message: 'ID do caso inválido' });
        }

        const caso = await casosRepository.findCaso(caso_id);

        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }

        if (!caso.agente_id) {
            return res.status(404).json({ message: 'Caso não possui agente associado' });
        }

        const agente = await agentesRepository.findAgente(caso.agente_id);
        if (!agente) {
            return res.status(404).json({ message: 'Agente não encontrado' });
        }

        return res.status(200).json(agente);
    } catch (err) {
        next(err);
    }
}

async function listID(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'ID do caso inválido' });
        }

        const caso = await casosRepository.findCaso(id);

        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }

        return res.status(200).json(caso);
    } catch (err) {
        next(err);
    }
}

async function addCaso(req, res, next) {
    try {
        const casoData = req.body;

        if (
            !casoData ||
            !casoData.titulo ||
            !casoData.descricao ||
            !casoData.status ||
            casoData.agente_id === undefined
        ) {
            return res.status(400).json({ message: 'Dados do caso incompletos ou inválidos' });
        }

        if (!validarAgenteId(casoData.agente_id)) {
            return res.status(400).json({ message: 'Agente ID inválido' });
        }

        const agenteExiste = await agentesRepository.findAgente(parseInt(casoData.agente_id, 10));
        if (!agenteExiste) {
            return res.status(404).json({ message: 'Agente responsável não encontrado' });
        }

        const novoCaso = await casosRepository.addCaso(casoData);

        return res.status(201).json(novoCaso);
    } catch (err) {
        next(err);
    }
}

async function updateCasoFull(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const novosDados = req.body;

        if (!novosDados || isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'Conteúdo inválido' });
        }

        if (novosDados.id) delete novosDados.id;

        const caso = await casosRepository.findCaso(id);
        if (!caso) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }

        if (
            !novosDados.titulo ||
            !novosDados.descricao ||
            !novosDados.status ||
            novosDados.agente_id === undefined
        ) {
            return res.status(400).json({ message: 'Dados do caso incompletos ou inválidos' });
        }

        if (!validarAgenteId(novosDados.agente_id)) {
            return res.status(400).json({ message: 'Agente ID inválido' });
        }

        const agenteExiste = await agentesRepository.findAgente(parseInt(novosDados.agente_id, 10));
        if (!agenteExiste) {
            return res.status(404).json({ message: 'Agente responsável não encontrado' });
        }

        const casoAtualizado = await casosRepository.updateCaso(id, novosDados);

        return res.status(200).json(casoAtualizado);
    } catch (err) {
        next(err);
    }
}

async function updateCaso(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const novosDados = req.body;

        if (!novosDados || isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'Conteúdo inválido' });
        }

        const casoExistente = await casosRepository.findCaso(id);
        if (!casoExistente) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }

        if (novosDados.id) delete novosDados.id;

        if (novosDados.agente_id !== undefined) {
            if (!validarAgenteId(novosDados.agente_id)) {
                return res.status(400).json({ message: 'Agente ID inválido' });
            }

            const agenteExiste = await agentesRepository.findAgente(parseInt(novosDados.agente_id, 10));
            if (!agenteExiste) {
                return res.status(404).json({ message: 'Agente responsável não encontrado' });
            }
        }

        const casoAtualizado = await casosRepository.updateCaso(id, novosDados);

        return res.status(200).json(casoAtualizado);
    } catch (err) {
        next(err);
    }
}

async function deleteCaso(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'ID do caso inválido' });
        }

        const casoRemovido = await casosRepository.removeCaso(id);
        if (!casoRemovido) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
}

async function searchCasos(req, res, next) {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Query de busca não fornecida' });
        }

        const casos = (await casosRepository.findAll()).filter(caso =>
            caso.titulo.toLowerCase().includes(q.toLowerCase()) ||
            caso.descricao.toLowerCase().includes(q.toLowerCase())
        );

        return res.status(200).json(casos);
    } catch (err) {
        next(err);
    }
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
    searchCasos,
};
