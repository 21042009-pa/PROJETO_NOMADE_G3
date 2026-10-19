const loteRepository = require("../repositories/LoteRepository");

class LoteService {
  async criarLote(id_produto, codigo_lote, validade) {
    const dadosDoLote = {
      id_produto,
      codigo_lote,
      validade,
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

  async atualizarLote(id, id_produto, codigo_lote, validade) {
    const dadosDoLote = {
      id_produto,
      codigo_lote,
      validade,
    };

    const lote = await loteRepository.atualizarLote(id, dadosDoLote);

    return lote;
  }

  async deletarLote(id) {
    const lote = await loteRepository.deletarLote(id);
    return lote;
  }
}

module.exports = new LoteService();
