const loteRepository = require("../repositories/LoteRepository");

async function criarLote(codigo_lote, quantidade_atual, validade) {
  const dadosDoLote = {
    codigo_lote: codigo_lote,
    quantidade_atual: quantidade_atual,
    validade: validade,
  };

  const lote = await loteRepository.cadastrarLote(dadosDoLote);

  return lote;
}

async function listarLotes() {
  const lotes = await loteRepository.listarLotes();

  return lotes;
}

async function buscarLote(id) {
  const lote = await loteRepository.buscarLoteId(id);

  return lote;
}

async function atualizarLote(
  id,
  codigo_lote,
  quantidade_atual,
  validade,
) {
  const dadosDoLote = {
    codigo_lote: codigo_lote,
    quantidade_atual: quantidade_atual,
    validade: validade,
  };

  const lote = await loteRepository.atualizarLote(id, dadosDoLote);

  return lote;
}

async function excluirLote(id) {
  try {
    const excluidos = await loteRepository.apagarLote(id);
    if (!excluidos) {
      const erro = new Error("Lote não encontrado para exclusão.");
      erro.status = 404;
      throw erro;
    }
    return { sucesso: true, mensagem: "Lote excluído com sucesso." };
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.errno === 1451) {
      const conflito = new Error("Não é possível excluir este lote: ele está vinculado a um produto ou outro registro. Remova o vínculo antes.");
      conflito.status = 409;
      throw conflito;
    }
    throw erro;
  }
}

module.exports = {
  criarLote,
  listarLotes,
  buscarLote,
  atualizarLote,
  excluirLote,
};