const movimentacaoEstoqueRepository = require("../repositories/MovimentacaoEstoqueRepository");

const TIPOS_MOVIMENTACAO = [
  "ENTRADA",
  "SAIDA",
  "AJUSTE_ENTRADA",
  "AJUSTE_SAIDA",
];

async function criarMovimentacaoEstoque(
  id_produto,
  id_lote,
  id_usuario,
  tipo,
  data_movimentacao,
  quantidade,
  observacao,
) {
  if (!TIPOS_MOVIMENTACAO.includes(tipo)) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem =
      "Tipo de movimentação inválido. Use ENTRADA, SAIDA, AJUSTE_ENTRADA ou AJUSTE_SAIDA";
    throw erro;
  }

  if (!id_lote) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "O lote é obrigatório para registrar uma movimentação";
    throw erro;
  }

  if (!id_usuario) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "O usuário é obrigatório para registrar uma movimentação";
    throw erro;
  }

  if ((tipo === "AJUSTE_ENTRADA" || tipo === "AJUSTE_SAIDA") && !observacao) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "A observação é obrigatória para ajustes de estoque";
    throw erro;
  }

  const lote = await movimentacaoEstoqueRepository.buscarLoteDoProduto(
    id_lote,
    id_produto,
  );

  if (!lote) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "O lote informado não pertence ao produto informado";
    throw erro;
  }

  const dadosDaMovimentacaoEstoque = {
    id_produto,
    id_lote,
    id_usuario,
    tipo,
    data_movimentacao,
    quantidade,
    observacao,
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
  id_lote,
  id_usuario,
  tipo,
  data_movimentacao,
  quantidade,
  observacao,
) {
  if (!TIPOS_MOVIMENTACAO.includes(tipo)) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem =
      "Tipo de movimentação inválido. Use ENTRADA, SAIDA, AJUSTE_ENTRADA ou AJUSTE_SAIDA";
    throw erro;
  }

  if (!id_lote) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "O lote é obrigatório para registrar uma movimentação";
    throw erro;
  }

  if (!id_usuario) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "O usuário é obrigatório para registrar uma movimentação";
    throw erro;
  }

  if ((tipo === "AJUSTE_ENTRADA" || tipo === "AJUSTE_SAIDA") && !observacao) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "A observação é obrigatória para ajustes de estoque";
    throw erro;
  }

  const lote = await movimentacaoEstoqueRepository.buscarLoteDoProduto(
    id_lote,
    id_produto,
  );

  if (!lote) {
    const erro = new Error();
    erro.status = 400;
    erro.mensagem = "O lote informado não pertence ao produto informado";
    throw erro;
  }

  const dadosDaMovimentacaoEstoque = {
    id_produto,
    id_lote,
    id_usuario,
    tipo,
    data_movimentacao,
    quantidade,
    observacao,
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
