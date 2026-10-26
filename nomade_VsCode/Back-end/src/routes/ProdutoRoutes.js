const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");
const upload = require("../config/multer");

router.get("/", ProdutoController.listarProduto);
router.post("/", upload.single("imagem"), ProdutoController.cadastrarProduto);
router.put("/:id/imagem", upload.single("imagem"), ProdutoController.trocarImagem);
router.delete("/:id/imagem", ProdutoController.removerImagem);
router.get("/:id", ProdutoController.buscarProdutoPorId);
router.put("/:id", upload.single("imagem"), ProdutoController.atualizarProduto);
router.delete("/:id", ProdutoController.deletarProduto);

module.exports = router;