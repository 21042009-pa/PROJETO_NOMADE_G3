const express = require("express");
const router = express.Router();

const FornecedorController = require("../controllers/FornecedorController");

router.get("/", FornecedorController.listarFornecedor);

router.get("/:id", FornecedorController.buscarFornecedorPorId);

router.post("/", FornecedorController.cadastrarFornecedor);

router.put("/:id", FornecedorController.atualizarFornecedor);

router.delete("/:id", FornecedorController.deletarFornecedor);

module.exports = router;
