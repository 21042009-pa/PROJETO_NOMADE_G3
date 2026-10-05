const express = require("express");
const router = express.Router();

const LoteController = require("../controllers/LoteController");

router.get("/", LoteController.listarLotes);

router.get("/:id", LoteController.buscarLotePorId);

router.post("/", LoteController.cadastrarLote);

router.put("/:id", LoteController.atualizarLote);

router.delete("/:id", LoteController.deletarLote);

module.exports = router;
