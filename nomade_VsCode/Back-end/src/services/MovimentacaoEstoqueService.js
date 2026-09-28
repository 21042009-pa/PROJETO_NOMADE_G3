const MovimentacaoEstoqueRepository = require("../repositories/MovimentacaoEstoqueRepository");
const movimentacaoEstoqueRepository = require("../repositories/MovimentacaoEstoqueRepository");

class MovimentacaoEstoqueService {async criarMovimentacaoEstoque(
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

async listarMovimentacoesEstoques() {
  const movimentacoesEstoque =
    await movimentacaoEstoqueRepository.listarMovimentacoesEstoques();

  return movimentacoesEstoque;
}

async buscarMovimentacaoEstoque(id) {
  const movimentacaoEstoque =
    await movimentacaoEstoqueRepository.buscarMovimentacaoEstoqueId(id);

  return movimentacaoEstoque;
}

async atualizarMovimentacaoEstoque(
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

async deletarMovimentacaoEstoque(id) {
  const movimentacaoEstoque =
    await movimentacaoEstoqueRepository.apagarMovimentacaoEstoque(id);

  return movimentacaoEstoque;
}}

module.exports = new MovimentacaoEstoqueService()