const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

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
        let casos = await casosRepository.findAll();

        if (status) {
            casos = casos.filter((caso) => caso.status === status);
        }

        if (agente_id) {
            casos = casos.filter((caso) => caso.agente_id === parseInt(agente_id, 10));
        }

        if (search) {
            casos = casos.filter(
                (caso) =>
                    caso.titulo.toLowerCase().includes(search.toLowerCase()) ||
                    caso.descricao.toLowerCase().includes(search.toLowerCase())
            );
        }

        return res.status(200).json(casos);
    } catch (err) {
        next(err);
    }
}

async function getAgenteCaso(req, res, next) {
    try {
        const { caso_id } = req.params;
        const caso = await casosRepository.findCaso(parseInt(caso_id, 10));

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
        const { id } = req.params;
        const caso = await casosRepository.findCaso(parseInt(id, 10));

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
            !casoData.agente_id
        ) {
            return res.status(400).json({ message: 'Dados do caso incompletos ou inválidos' });
        }

        const agenteExiste = await agentesRepository.findAgente(casoData.agente_id);
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
        const { id } = req.params;
        const novosDados = req.body;

        if (!novosDados || !id) {
            return res.status(400).json({ message: 'Conteúdo inválido' });
        }

        if (novosDados.id) delete novosDados.id;

        const caso = await casosRepository.findCaso(parseInt(id, 10));
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

        const agenteExiste = await agentesRepository.findAgente(novosDados.agente_id);
        if (!agenteExiste) {
            return res.status(404).json({ message: 'Agente responsável não encontrado' });
        }

        const casoAtualizado = await casosRepository.updateCaso(parseInt(id, 10), novosDados);

        return res.status(200).json(casoAtualizado);
    } catch (err) {
        next(err);
    }
}

async function updateCaso(req, res, next) {
    try {
        const { id } = req.params;
        const novosDados = req.body;

        if (!novosDados || !id) {
            return res.status(400).json({ message: 'Conteúdo inválido' });
        }

        const casoExistente = await casosRepository.findCaso(parseInt(id, 10));
        if (!casoExistente) {
            return res.status(404).json({ message: 'Caso não encontrado' });
        }

        if (novosDados.id) delete novosDados.id;

        if (novosDados.agente_id) {
            const agenteExiste = await agentesRepository.findAgente(novosDados.agente_id);
            if (!agenteExiste) {
                return res.status(404).json({ message: 'Agente responsável não encontrado' });
            }
        }

        const casoAtualizado = await casosRepository.updateCaso(parseInt(id, 10), novosDados);

        return res.status(200).json(casoAtualizado);
    } catch (err) {
        next(err);
    }
}

async function deleteCaso(req, res, next) {
    try {
        const { id } = req.params;

        const casoRemovido = await casosRepository.removeCaso(parseInt(id, 10));
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
