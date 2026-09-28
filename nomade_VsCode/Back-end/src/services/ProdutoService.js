const produtoRepository = require("../repositories/ProdutoRepository");

class ProdutoService {
  async criarProduto(
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

async listarProdutos() {
  const produtos = await produtoRepository.listarProdutos();

  return produtos;
}

async buscarProduto(id) {
  const produto = await produtoRepository.buscarProdutoId(id);

  return produto;
}

async atualizarProduto(id, dados) {
  const dadosDoProduto = {
    id_fornecedor: dados.id_fornecedor,
    id_categoria: dados.id_categoria,
    nome: dados.nome,
    descricao: dados.descricao,
    modelo: dados.modelo,
    data_validade: dados.data_validade,
    codigo_produto: dados.codigo_produto,
    cor: dados.cor,
    imagem: dados.imagem,
  };

  const produto = await produtoRepository.atualizarProduto(id, dadosDoProduto);

  return produto;
}

async deletarProduto(id) {
  const produto = await produtoRepository.apagarProduto(id);

  return produto;
}
}
module.exports = new ProdutoService()
