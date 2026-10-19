const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const FornecedorController = require("../controllers/FornecedorController");

router.get("/", FornecedorController.listarFornecedores, asyncHandler(FornecedorController.listarFornecedores));

router.get("/:id", FornecedorController.buscarFornecedorPorId);

router.post("/", FornecedorController.cadastrarFornecedor);

router.put("/:id", FornecedorController.atualizarFornecedor);

router.delete("/:id", FornecedorController.deletarFornecedor);

module.exports = router;
