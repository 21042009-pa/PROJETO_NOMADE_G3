const express = require("express");
const router = express.Router();

const produtoRoutes = require("./ProdutoRoutes");
const categoriaRoutes = require("./CategoriaRoutes");
const fornecedorRoutes = require("./FornecedorRoutes");
const loteRoutes = require("./LoteRoutes");
const movimentacaoEstoqueRoutes = require("./MovimentacaoEstoqueRoutes");
const usuarioRoutes = require("./UsuarioRoutes");

router.get("/", (req, res) => {
  res.json({
    mensagem: "API Nomade",
    versao: "1.0.0",
  });
});

router.use("/produtos", produtoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/fornecedores", fornecedorRoutes);
router.use("/lotes", loteRoutes);
router.use("/movimentacoes-estoque", movimentacaoEstoqueRoutes);
router.use("/usuarios", usuarioRoutes);

module.exports = router;
