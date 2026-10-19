const express = require("express");
const router = express.Router();

const CategoriaController = require("../controllers/CategoriaController");

router.get("/", CategoriaController.listarCategoria);

router.get("/:id", CategoriaController.buscarCategoriaPorId);

router.post("/", CategoriaController.cadastrarCategoria);

router.put("/:id", CategoriaController.atualizarCategoria);

router.delete("/:id", CategoriaController.deletarCategoria);

module.exports = router;
