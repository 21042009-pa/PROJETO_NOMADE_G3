const movimentacaoEstoqueRepository = require("../repositories/MovimentacaoEstoqueRepository");

const TIPOS_MOVIMENTACAO = [
  "ENTRADA",
  "SAIDA",
  "AJUSTE_ENTRADA",
  "AJUSTE_SAIDA",
];

async function validarQuantidade(quantidade) {
  if (
    typeof quantidade !== "number" ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "A quantidade deve ser um número inteiro maior que zero";
    throw erro;
  }
}

async function validarTipo(tipo) {
  if (!TIPOS_MOVIMENTACAO.includes(tipo)) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem =
      "Tipo de movimentação inválido. Use ENTRADA, SAIDA, AJUSTE_ENTRADA ou AJUSTE_SAIDA";
    throw erro;
  }
}

async function validarObservacao(tipo, observacao) {
  if ((tipo === "AJUSTE_ENTRADA" || tipo === "AJUSTE_SAIDA") && !observacao) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "A observação é obrigatória para ajustes de estoque";
    throw erro;
  }
}

async function validarEstoqueDisponivel(id_produto, tipo, quantidade) {
  if (tipo !== "SAIDA" && tipo !== "AJUSTE_SAIDA") {
    return;
  }

  const resultado =
    await movimentacaoEstoqueRepository.buscarEstoqueProduto(id_produto);

  const estoqueAtual = Number(resultado.estoque);

  if (quantidade > estoqueAtual) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = `Estoque insuficiente. Estoque disponível: ${estoqueAtual}`;
    throw erro;
  }
}

async function criarMovimentacaoEstoque(
  id_produto,
  tipo,
  data_movimentacao,
  quantidade,
  observacao,
) {
  await validarTipo(tipo);

  await validarQuantidade(quantidade);

  await validarObservacao(tipo, observacao);

  await validarEstoqueDisponivel(id_produto, tipo, quantidade);

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

module.exports = {
  criarMovimentacaoEstoque,
  listarMovimentacoesEstoque,
  buscarMovimentacaoEstoque,
};
