const express = require("express");
const router = express.Router();
const controller = require("../controllers/RelatorioController");
const {
  autenticar,
  somenteGerenteOuAnalista,
} = require("../middlewares/autenticacao");

router.get("/estoque", autenticar, somenteGerenteOuAnalista, controller.estoque);

module.exports = router;