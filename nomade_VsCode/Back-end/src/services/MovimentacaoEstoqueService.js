const movimentacaoEstoqueRepository = require("../repositories/MovimentacaoEstoqueRepository");

async function criarMovimentacaoEstoque(
  id_produto,
  tipo,
  data_movimentacao,
  quantidade,
  observacao,
) {
  const dadosDaMovimentacaoEstoque = {
    id_produto: id_produto,
    tipo: tipo,
    data_movimentacao: data_movimentacao,
    quantidade: quantidade,
    observacao: observacao,
  };

  const movimentacaoEstoque =
    await movimentacaoEstoqueRepository.cadastrarMovimentacaoEstoque(
      dadosDaMovimentacaoEstoque,
    );

  return movimentacaoEstoque;
}

async function listarMovimentacoesEstoque() {
  const movimentacoesEstoque =
    await movimentacaoEstoqueRepository.listarMovimentacoesEstoque();

  return movimentacoesEstoque;
}

async function buscarMovimentacaoEstoque(id) {
  const movimentacaoEstoque =
    await movimentacaoEstoqueRepository.buscarMovimentacaoEstoqueId(id);

  return movimentacaoEstoque;
}

async function atualizarMovimentacaoEstoque(
  id,
  id_produto,
  tipo,
  data_movimentacao,
  quantidade,
  observacao,
) {
  const dadosDaMovimentacaoEstoque = {
    id_produto: id_produto,
    tipo: tipo,
    data_movimentacao: data_movimentacao,
    quantidade: quantidade,
    observacao: observacao,
  };

  const movimentacaoEstoque =
    await movimentacaoEstoqueRepository.atualizarMovimentacaoEstoque(
      id,
      dadosDaMovimentacaoEstoque,
    );

  return movimentacaoEstoque;
}

async function excluirMovimentacaoEstoque(id) {
  const movimentacaoEstoque =
    await movimentacaoEstoqueRepository.apagarMovimentacaoEstoque(id);

  return movimentacaoEstoque;
}

module.exports = {
  criarMovimentacaoEstoque,
  listarMovimentacoesEstoque,
  buscarMovimentacaoEstoque,
  atualizarMovimentacaoEstoque,
  excluirMovimentacaoEstoque,
};
