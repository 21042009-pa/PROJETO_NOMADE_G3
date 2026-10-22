const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");
const upload = require("../config/multer");
const {
  autenticar,
  somenteGerente,
  somenteGerenteOuAnalista,
} = require("../middlewares/autenticacao");

router.get("/", autenticar, ProdutoController.listarProduto);
router.get("/:id", autenticar, ProdutoController.buscarProdutoPorId);

router.post("/", autenticar, somenteGerenteOuAnalista, upload.single("imagem"), ProdutoController.cadastrarProduto);

router.put("/:id", autenticar, somenteGerenteOuAnalista, upload.single("imagem"), ProdutoController.atualizarProduto);

router.delete("/:id", autenticar, somenteGerente, ProdutoController.deletarProduto);

router.post("/upload", autenticar, somenteGerenteOuAnalista, upload.single("imagem"), ProdutoController.upload);

module.exports = router;
