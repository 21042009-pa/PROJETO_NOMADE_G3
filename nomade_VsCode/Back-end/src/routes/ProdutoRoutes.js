const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");
const upload = require("../config/multer");
const { autenticar, autenticarSeHouverToken, somenteGerente, somenteProprioUsuario } = require("../middlewares/autenticacao");

router.use(autenticar);

router.get("/",somenteGerente, ProdutoController.listarProduto);
router.post("/",somenteGerente, upload.single("imagem"), ProdutoController.cadastrarProduto);
router.put("/:id/imagem",somenteGerente, upload.single("imagem"), ProdutoController.trocarImagem);
router.delete("/:id/imagem",somenteGerente, ProdutoController.removerImagem);
router.get("/:id",somenteGerente, ProdutoController.buscarProdutoPorId);
router.put("/:id",somenteGerente, upload.single("imagem"), ProdutoController.atualizarProduto);
router.delete("/:id",somenteGerente, ProdutoController.deletarProduto);

module.exports = router;