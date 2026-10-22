const express = require("express");
const router = express.Router();
const LoteController = require("../controllers/LoteController");
const {
  autenticar,
  somenteGerente,
  somenteGerenteOuAnalista,
} = require("../middlewares/autenticacao");

router.get("/", autenticar, LoteController.listarLote);

router.get("/:id", autenticar, LoteController.buscarLotePorId);

router.post("/", autenticar, somenteGerenteOuAnalista, LoteController.cadastrarLote);

router.put("/:id", autenticar, somenteGerenteOuAnalista, LoteController.atualizarLote);

router.delete("/:id", autenticar, somenteGerente, LoteController.deletarLote);

module.exports = router;
