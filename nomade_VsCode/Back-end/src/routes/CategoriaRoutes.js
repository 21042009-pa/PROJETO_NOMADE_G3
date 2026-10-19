const express = require("express");
const router = express.Router();

const CategoriaController = require("../controllers/CategoriaController");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", CategoriaController.listarCategorias, asyncHandler(CategoriaController.listarCategorias));

router.get("/:id", CategoriaController.buscarCategoriaPorId);

router.post("/", CategoriaController.cadastrarCategoria);

router.put("/:id", CategoriaController.atualizarCategoria);

router.delete("/:id", CategoriaController.deletarCategoria);

module.exports = router;
