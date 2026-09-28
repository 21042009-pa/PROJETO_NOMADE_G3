const fornecedorRepository = require("../repositories/FornecedorRepository");

async function criarFornecedor(nome, contato, endereco) {
  const dadosDoFornecedor = {
    nome: nome,
    contato: contato,
    endereco: endereco,
  };

  const fornecedor =
    await fornecedorRepository.cadastrarFornecedor(dadosDoFornecedor);

  return fornecedor;
}

async function listarFornecedores() {
  const fornecedores = await fornecedorRepository.listarFornecedores();

  return fornecedores;
}

async function buscarFornecedor(id) {
  const fornecedor = await fornecedorRepository.buscarFornecedorId(id);

  return fornecedor;
}

async function atualizarFornecedor(id, nome, contato, endereco) {
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

async function excluirFornecedor(id) {
  const fornecedor = await fornecedorRepository.apagarFornecedor(id);

  return fornecedor;
}

module.exports = {
  criarFornecedor,
  listarFornecedores,
  buscarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,
};
