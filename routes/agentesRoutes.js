const express = require('express')
const router = express.Router();
const agentesController = require('../controllers/agentesController');

// GET /agentes → Lista todos os agentes.
// GET /agentes?cargo=inspetor → Lista todos os agentes baseado no cargo.
// GET /agentes?sort=dataDeIncorporacao ou sort=-dataDeIncorporacao → Lista os agentes em ordem.
router.get('/', agentesController.agenteGet);

// GET /agentes/:id → Retorna um agente específico.
router.get('/:id', agentesController.listID);

// POST /agentes → Cadastra um novo agente.
router.post('/', agentesController.addAgente);

// PUT /agentes/:id → Atualiza os dados do agente por completo.
router.put('/:id', agentesController.updateAgenteFull);

// PATCH /agentes/:id → Atualiza os dados do agente parcialmente.
router.patch('/:id', agentesController.updateAgente);

// DELETE /agentes/:id → Remove o agente.
router.delete('/:id', agentesController.deleteAgente);

module.exports = router;