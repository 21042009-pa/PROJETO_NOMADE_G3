const loteRepository = require("../repositories/LoteRepository");

class LoteService {
  async criarLote(id_produto, codigo_lote, quantidade_atual, validade) {
  const dadosDoLote = {
    id_produto: id_produto,
    codigo_lote: codigo_lote,
    quantidade_atual: quantidade_atual,
    validade: validade,
  };

  const lote = await loteRepository.cadastrarLote(dadosDoLote);

  return lote;
}

async listarLotes() {
  const lotes = await loteRepository.listarLotes();

  return lotes;
}

async buscarLote(id) {
  const lote = await loteRepository.buscarLoteId(id);

  return lote;
}

async atualizarLote(
  id,
  id_produto,
  codigo_lote,
  quantidade_atual,
  validade,
) {
  const dadosDoLote = {
    id_produto: id_produto,
    codigo_lote: codigo_lote,
    quantidade_atual: quantidade_atual,
    validade: validade,
  };

  const lote = await loteRepository.atualizarLote(id, dadosDoLote);

  return lote;
}

async deletarLote(id) {
  const lote = await loteRepository.apagarLote(id);

  return lote;
}}

module.exports = new LoteService()
