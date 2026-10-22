const express = require("express");
const router = express.Router();
const MovimentacaoEstoqueController = require("../controllers/MovimentacaoEstoqueController");
const {
  autenticar,
  somenteGerente,
  somenteGerenteOuAnalista,
  somenteEquipeEstoque,
} = require("../middlewares/autenticacao");

router.get("/", autenticar, somenteEquipeEstoque, MovimentacaoEstoqueController.listarMovimentacoesEstoque);

router.get(
  "/:id", autenticar, somenteEquipeEstoque,
  MovimentacaoEstoqueController.buscarMovimentacaoEstoquePorId,
);

router.post("/", autenticar, somenteEquipeEstoque, MovimentacaoEstoqueController.cadastrarMovimentacaoEstoque);

router.put("/:id", autenticar, somenteGerenteOuAnalista, MovimentacaoEstoqueController.atualizarMovimentacaoEstoque);

router.delete("/:id", autenticar, somenteGerente, MovimentacaoEstoqueController.deletarMovimentacaoEstoque);

module.exports = router;
