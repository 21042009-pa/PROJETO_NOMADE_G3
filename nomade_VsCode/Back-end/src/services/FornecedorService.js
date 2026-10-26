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
  try {
    const excluidos = await fornecedorRepository.apagarFornecedor(id);
    if (!excluidos) {
      const erro = new Error("Fornecedor não encontrado para exclusão.");
      erro.status = 404;
      throw erro;
    }
    return { sucesso: true, mensagem: "Fornecedor excluído com sucesso." };
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.errno === 1451) {
      const conflito = new Error("Não é possível excluir este fornecedor: ele está vinculado a um produto ou outro registro. Remova o vínculo antes.");
      conflito.status = 409;
      throw conflito;
    }
    throw erro;
  }
}

module.exports = {
  criarFornecedor,
  listarFornecedores,
  buscarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,
};