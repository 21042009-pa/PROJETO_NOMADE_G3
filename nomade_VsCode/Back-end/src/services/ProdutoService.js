const produtoRepository = require("../repositories/ProdutoRepository");

async function criarProduto(
  id_fornecedor,
  id_categoria,
  nome,
  descricao,
  modelo,
  data_validade,
  codigo_produto,
  cor,
  imagem,
) {
  const dadosDoProduto = {
    id_fornecedor,
    id_categoria,
    nome,
    descricao,
    modelo,
    data_validade,
    codigo_produto,
    cor,
    imagem,
  };

  const produto = await produtoRepository.cadastrarProduto(dadosDoProduto);

  return produto;
}

async function listarProdutos() {
  const produtos = await produtoRepository.listarProdutos();

  return produtos;
}

async function buscarProduto(id) {
  const produto = await produtoRepository.buscarProdutoId(id);

  return produto;
}

async function buscarEstoqueProduto(id) {
  const estoque = await produtoRepository.buscarEstoqueProduto(id);

  return estoque;
}

async function atualizarProduto(
  id,
  id_fornecedor,
  id_categoria,
  nome,
  descricao,
  modelo,
  data_validade,
  codigo_produto,
  cor,
  imagem,
) {
  const dadosDoProduto = {
    id_fornecedor,
    id_categoria,
    nome,
    descricao,
    modelo,
    data_validade,
    codigo_produto,
    cor,
    imagem,
  };

  const produto = await produtoRepository.atualizarProduto(id, dadosDoProduto);

  return produto;
}

async function excluirProduto(id) {
  const produto = await produtoRepository.apagarProduto(id);

  return produto;
}

module.exports = {
  criarProduto,
  listarProdutos,
  buscarProduto,
  buscarEstoqueProduto,
  atualizarProduto,
  excluirProduto,
};
