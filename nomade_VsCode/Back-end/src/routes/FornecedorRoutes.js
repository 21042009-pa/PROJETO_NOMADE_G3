const express = require("express");
const router = express.Router();
const {
  autenticar,
  somenteGerente,
  somenteGerenteOuAnalista,
} = require("../middlewares/autenticacao");
const FornecedorController = require("../controllers/FornecedorController");

router.get("/", autenticar, FornecedorController.listarFornecedor);

router.get("/:id", autenticar, FornecedorController.buscarFornecedorPorId);

router.post("/", autenticar, somenteGerenteOuAnalista, FornecedorController.cadastrarFornecedor);

router.put("/:id", autenticar, somenteGerenteOuAnalista, FornecedorController.atualizarFornecedor);

router.delete("/:id", autenticar, somenteGerente, FornecedorController.deletarFornecedor);

module.exports = router;
