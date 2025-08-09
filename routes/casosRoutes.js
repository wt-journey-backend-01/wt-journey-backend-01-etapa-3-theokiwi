const express = require("express");
const router = express.Router();
const casosController = require("../controllers/casosController");

// GET /casos → Lista todos os casos registrados.
// GET /casos?agente_id=... → Lista todos os casos atribuídos a um agente específico.
// GET /casos?status=aberto → Lista todos os casos em aberto.
router.get("/", casosController.getCasos);

// GET /casos/search → Pesquisa full-text por título ou descrição.
router.get('/search', casosController.searchCasos);

// GET /casos/:caso_id/agente → Retorna os dados completos do agente responsável por um caso específico.
router.get("/:caso_id/agente", casosController.getAgenteCaso);

// GET /casos/:id → Retorna os detalhes de um caso específico.
router.get("/:id", casosController.listID);

// POST /casos → Cria um novo caso.
router.post('/', casosController.addCaso);

// PUT /casos/:id → Atualiza os dados de um caso por completo.
router.put("/:id", casosController.updateCasoFull);

// PATCH /casos/:id → Atualiza os dados de um caso parcialmente.
router.patch("/:id", casosController.updateCaso);

// DELETE /casos/:id → Remove um caso do sistema.
router.delete("/:id", casosController.deleteCaso);

module.exports = router;
