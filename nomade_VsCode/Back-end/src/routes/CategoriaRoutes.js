const express = require("express");
const router = express.Router();
const CategoriaController = require("../controllers/CategoriaController");
const {
  autenticar,
  somenteGerente,
  somenteGerenteOuAnalista,
} = require("../middlewares/autenticacao");

router.get("/", autenticar, CategoriaController.listarCategoria);

router.get("/:id", autenticar, CategoriaController.buscarCategoriaPorId);

router.post("/", autenticar, somenteGerenteOuAnalista, CategoriaController.cadastrarCategoria);

router.put("/:id", autenticar, somenteGerenteOuAnalista, CategoriaController.atualizarCategoria);

router.delete("/:id", autenticar, somenteGerente, CategoriaController.deletarCategoria);

module.exports = router;
