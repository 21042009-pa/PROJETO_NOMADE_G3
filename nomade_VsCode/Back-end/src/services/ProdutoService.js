const produtoRepository = require("../repositories/ProdutoRepository");

async function criarProduto(dados) {
  return produtoRepository.cadastrarProdutoComRelacionamentos(dados);
}

async function listarProdutos() {
  return produtoRepository.listarProdutos();
}

async function buscarProduto(id) {
  return produtoRepository.buscarProdutoId(id);
}

async function atualizarProduto(
  id, id_fornecedor, id_categoria, nome, descricao, modelo,
  data_validade, codigo_produto, cor, imagem, id_lote,
) {
  const dadosDoProduto = {
    id_fornecedor, id_categoria, nome, descricao, modelo,
    data_validade, codigo_produto, cor,
    ...(imagem ? { imagem } : {}),
    ...(id_lote !== undefined && id_lote !== "" ? { id_lote: Number(id_lote) } : {}),
  };
  return produtoRepository.atualizarProduto(id, dadosDoProduto);
}

async function atualizarApenasImagem(id, imagem) {
  return produtoRepository.atualizarProduto(id, { imagem });
}

async function excluirProduto(id) {
  return produtoRepository.apagarProduto(id);
}

module.exports = { criarProduto, listarProdutos, buscarProduto, atualizarProduto, atualizarApenasImagem, excluirProduto };