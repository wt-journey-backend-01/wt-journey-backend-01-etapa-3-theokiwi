const agentesRepository = require('../repositories/agentesRepository');

function agenteGet(req, res) {
    const { agente, cargo, sort } = req.query;
    let agentes = agentesRepository.findAll();

    if (cargo) {
        agentes = agentes.filter((a) => a.cargo === cargo);
    }

    if (sort) {
        let campo = sort;
        let ordem = 'asc';
        if (sort.startsWith('-')) {
            ordem = 'desc';
            campo = sort.substring(1);
        }

        if (campo === 'dataDeIncorporacao') {
            agentes.sort((a, b) => {
                const dataA = new Date(a.dataDeIncorporacao).getTime();
                const dataB = new Date(b.dataDeIncorporacao).getTime();
                return ordem === 'asc' ? dataA - dataB : dataB - dataA;
            });
        }
    }

    return res.status(200).json(agentes);
}

function listID(req, res) {
    const { id } = req.params;
    const agente = agentesRepository.findAgente(id);

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

function addAgente(req, res) {
    const newAgente = req.body;

    if (!newAgente || !newAgente.nome || !newAgente.cargo || !newAgente.dataDeIncorporacao) {
        return res.status(400).json({ message: 'Dados do agente incompletos ou inválidos' });
    }

    if (!isDataValida(newAgente.dataDeIncorporacao)) {
        return res.status(400).json({ message: 'Data de incorporação inválida' });
    }

    const agenteAdded = agentesRepository.addAgente(newAgente);
    return res.status(201).json(agenteAdded);
}

function updateAgenteFull(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'Conteúdo inválido' });
    }

    if (!novosDados.nome || !novosDados.cargo || !novosDados.dataDeIncorporacao) {
        return res.status(400).json({ message: 'Dados do agente incompletos ou inválidos' });
    }

    if (!isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    if (!isDataValida(novosDados.dataDeIncorporacao)) {
        return res.status(400).json({ message: 'Data de incorporação inválida' });
    }

    const agenteExistente = agentesRepository.findAgente(id);
    if (!agenteExistente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    if (novosDados.id) delete novosDados.id;

    const agenteAtualizado = agentesRepository.updateAgente({ id, ...novosDados });
    return res.status(200).json(agenteAtualizado);
}

function updateAgente(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res.status(400).json({ message: 'Conteúdo inválido' });
    }

    const agenteExistente = agentesRepository.findAgente(id);
    if (!agenteExistente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    if (novosDados.id) delete novosDados.id;

    if (novosDados.dataDeIncorporacao && !isDataValida(novosDados.dataDeIncorporacao)) {
        return res.status(400).json({ message: 'Data de incorporação inválida' });
    }

    if (novosDados.status && !isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    const agenteAtualizado = agentesRepository.updateAgente({
        ...agenteExistente,
        ...novosDados,
    });

    return res.status(200).json(agenteAtualizado);
}

function deleteAgente(req, res) {
    const { id } = req.params;

    const agenteRemovido = agentesRepository.removeAgente(id);

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
