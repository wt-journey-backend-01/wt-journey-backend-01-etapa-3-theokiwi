const agentesRepository = require('../repositories/agentesRepository');

async function agenteGet(req, res) {
    const { cargo, sort } = req.query;
    const agentes = await agentesRepository.findAll({ cargo, sort });
    return res.status(200).json(agentes);
}

async function listID(req, res) {
    const { id } = req.params;
    const agenteIdInt = parseInt(id, 10);
    const agente = await agentesRepository.findAgente(agenteIdInt);

    if (!agente) {
        return res.status(404).json({ message: 'Agente com essa ID não encontrado' });
    }

    return res.status(200).json(agente);
}

function isDataValida(dataStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) return false;

    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return data <= hoje;
}

function isStatusValido(status) {
    return status === 'aberto' || status === 'solucionado';
}

async function addAgente(req, res) {
    const newAgente = req.body;

    if (!newAgente || !newAgente.nome || !newAgente.cargo || !newAgente.dataDeIncorporacao) {
        return res.status(400).json({ message: 'Dados do agente incompletos ou inválidos' });
    }

    if (!isDataValida(newAgente.dataDeIncorporacao)) {
        return res.status(400).json({ message: 'Data de incorporação inválida' });
    }

    const agenteAdded = await agentesRepository.addAgente(newAgente);
    return res.status(201).json(agenteAdded);
}

async function updateAgenteFull(req, res) {
    const { id } = req.params;
    const agenteIdInt = parseInt(id, 10);
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'ID do agente ou corpo da requisição ausente.' });
    }

    if (typeof novosDados.nome !== 'string' || !novosDados.nome.trim()) {
        return res.status(400).json({ message: 'Nome do agente deve ser uma string não vazia.' });
    }

    if (typeof novosDados.cargo !== 'string' || !novosDados.cargo.trim()) {
        return res.status(400).json({ message: 'Cargo do agente deve ser uma string não vazia.' });
    }

    if (!novosDados.dataDeIncorporacao || !isDataValida(novosDados.dataDeIncorporacao)) {
        return res.status(400).json({ message: 'Data de incorporação inválida ou ausente.' });
    }

    const agenteExistente = await agentesRepository.findAgente(agenteIdInt);
    if (!agenteExistente) {
        return res.status(404).json({ message: 'Agente não encontrado.' });
    }

    if (novosDados.id) delete novosDados.id;

    const agenteAtualizado = await agentesRepository.updateAgente(agenteIdInt, novosDados);
    return res.status(200).json(agenteAtualizado);
}

async function updateAgente(req, res) {
    const { id } = req.params;
    const agenteIdInt = parseInt(id, 10);
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'ID do agente ou corpo da requisição ausente.' });
    }

    const agenteExistente = await agentesRepository.findAgente(agenteIdInt);
    if (!agenteExistente) {
        return res.status(404).json({ message: 'Agente não encontrado.' });
    }

    if (novosDados.id) delete novosDados.id;

    if (novosDados.nome && (typeof novosDados.nome !== 'string' || !novosDados.nome.trim())) {
        return res.status(400).json({ message: 'Nome do agente deve ser uma string não vazia.' });
    }

    if (novosDados.cargo && (typeof novosDados.cargo !== 'string' || !novosDados.cargo.trim())) {
        return res.status(400).json({ message: 'Cargo do agente deve ser uma string não vazia.' });
    }

    if (novosDados.dataDeIncorporacao && !isDataValida(novosDados.dataDeIncorporacao)) {
        return res.status(400).json({ message: 'Data de incorporação inválida.' });
    }

    const agenteAtualizado = await agentesRepository.updateAgente(agenteIdInt, novosDados);

    return res.status(200).json(agenteAtualizado);
}

async function deleteAgente(req, res) {
    const { id } = req.params;
    const agenteIdInt = parseInt(id, 10);

    const agenteRemovido = await agentesRepository.removeAgente(agenteIdInt);

    if (!agenteRemovido) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    return res.status(204).send();
}

module.exports = {
    agenteGet,
    listID,
    addAgente,
    updateAgenteFull,
    updateAgente,
    deleteAgente,
};
