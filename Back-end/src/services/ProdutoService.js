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
    id_fornecedor: id_fornecedor,
    id_categoria: id_categoria,
    nome: nome,
    descricao: descricao,
    modelo: modelo,
    data_validade: data_validade,
    codigo_produto: codigo_produto,
    cor: cor,
    imagem: imagem,
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
    id_fornecedor: id_fornecedor,
    id_categoria: id_categoria,
    nome: nome,
    descricao: descricao,
    modelo: modelo,
    data_validade: data_validade,
    codigo_produto: codigo_produto,
    cor: cor,
    imagem: imagem,
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
  atualizarProduto,
  excluirProduto,
};
