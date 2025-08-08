const express = require("express");
const router = express.Router();
const casosController = require("../controllers/casosController");

// GET /casos → Lista todos os casos registrados.
// GET /casos?agente_id=... → Lista todos os casos atribuídos a um agente específico.
// GET /:caso_id/agente → Retorna os dados completos do agente responsável por um caso específico.
// GET /?status=aberto → Lista todos os casos em aberto.
// GET /search?q=... → Pesquisa full-text por título ou descrição.
router.get("/", casosController.getCasos);
router.get("/:caso_id/agente", casosController.getAgenteCaso);

// GET /:id → Retorna os detalhes de um caso específico.
router.get("/:id", casosController.listID);

// POST / → Cria um novo caso.
router.post('/', casosController.addCaso);

// PUT /:id → Atualiza os dados de um caso por completo.
router.put("/:id", casosController.updateCasoFull);

// PATCH /:id → Atualiza os dados de um caso parcialmente.
router.patch("/:id", casosController.updateCaso);

// DELETE /:id → Remove um caso do sistema.
router.delete("/:id", casosController.deleteCaso);

// GET /search → Pesquisa full-text.
router.get('/search', casosController.searchCasos);

module.exports = router;
