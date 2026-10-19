const fornecedorRepository = require("../repositories/FornecedorRepository");

class FornecedorService{
  async criarFornecedor(nome, contato, endereco) {
  const dadosDoFornecedor = {
    nome: nome,
    contato: contato,
    endereco: endereco,
  };

  const fornecedor =
    await fornecedorRepository.cadastrarFornecedor(dadosDoFornecedor);

  return fornecedor;
}

async listarFornecedores() {
  const fornecedores = await fornecedorRepository.listarFornecedores();

  return fornecedores;
}

async buscarFornecedor(id) {
  const fornecedor = await fornecedorRepository.buscarFornecedorId(id);

  return fornecedor;
}

async atualizarFornecedor(id, nome, contato, endereco) {
  const dadosDoFornecedor = {
    nome: nome,
    contato: contato,
    endereco: endereco,
  };

  const fornecedor = await fornecedorRepository.atualizarFornecedor(
    id,
    dadosDoFornecedor,
  );

  return fornecedor;
}

async deletarFornecedor(id) {
  const fornecedor = await fornecedorRepository.apagarFornecedor(id);

  return fornecedor;
}}

module.exports = new FornecedorService()
