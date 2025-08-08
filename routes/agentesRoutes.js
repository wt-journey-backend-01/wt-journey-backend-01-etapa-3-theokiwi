const express = require('express')
const router = express.Router();
const agentesController = require('../controllers/agentesController');

// define a rota para /agentes usando o método GET
//router.get('/agentes', agentesController.seuMetodo)

//GET /agentes → Lista todos os agentes.
//GET /agentes?cargo=inspetor → Lista todos os agentes baseado no cargo ("inspetor" ou "delegado").
//GET /agentes?sort=dataDeIncorporacao ou sort=-dataDeIncorporacao → Lista os agentes em ordem crescente ou decrescente de data incorporação
router.get('/agentes', agentesController.agenteGet);

//GET /agentes/:id → Retorna um agente específico.
router.get('/agentes/:id', agentesController.listID);

//POST /agentes → Cadastra um novo agente com:
router.post('/agentes', agentesController.addAgente);

//PUT /agentes/:id → Atualiza os dados do agente por completo.
router.put('/agentes/:id', agentesController.updateAgenteFull);

//PATCH /agentes/:id → Atualiza os dados do agente parcialmente.
router.patch('/agentes/:id', agentesController.updateAgente);

//DELETE /agentes/:id → Remove o agente.
router.delete('/agentes/:id', agentesController.deleteAgente);

module.exports = router;