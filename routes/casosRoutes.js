const express = require("express");
const router = express.Router();
const casosController = require("../controllers/casosController");

// define a rota para /casos usando o método GET
//router.get('/casos', casosController.seuMetodo)

//GET /casos → Lista todos os casos registrados.
// GET /casos?agente_id=uuid → Lista todos os casos atribuídos à um agente específico.
//  GET /casos/:caso_id/agente → Retorna os dados completos do agente responsável por um caso específico.
//  GET /casos?status=aberto → Lista todos os casos em aberto.
//  GET /casos/search?q=homicídio → Deve retornar todos os casos em que a palavra da query string aparece no titulo e/ou descricao, ou seja, uma pesquisa full-text
router.get("/casos", casosController.getCasos);
router.get("/casos/:caso_id/agente", casosController.getAgenteCaso);

//GET /casos/:id → Retorna os detalhes de um caso específico.
router.get("/casos/:id", casosController.listID);

//POST /casos → Cria um novo caso com os seguintes campos:
router.post('/casos', casosController.addCaso);

//PUT /casos/:id → Atualiza os dados de um caso por completo.
router.put("/casos/:id", casosController.updateCasoFull);

//PATCH /casos/:id → Atualiza os dados de um caso parcialmente.
router.patch("/casos/:id", casosController.updateCaso);

//DELETE /casos/:id → Remove um caso do sistema.
router.delete("/casos/:id", casosController.deleteCaso);

router.get('/casos/search', casosController.searchCasos);
module.exports = router;
