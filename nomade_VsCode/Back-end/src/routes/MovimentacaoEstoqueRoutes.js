const express = require("express");
const router = express.Router();

const MovimentacaoEstoqueController = require("../controllers/MovimentacaoEstoqueController");

router.get("/", MovimentacaoEstoqueController.listarMovimentacoesEstoque);

router.get(
  "/:id",
  MovimentacaoEstoqueController.buscarMovimentacaoEstoquePorId,
);

router.post("/", MovimentacaoEstoqueController.cadastrarMovimentacaoEstoque);

module.exports = router;
