const LoteService = require("../services/LoteService");

class LoteController {
  async listarLote(req, res) {
    try {
      const resultado = await LoteService.listarLotes();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.message || erro.mensagem || "Erro interno do servidor",
      });
    }
  }

  async buscarLotePorId(req, res) {
    try {
      const resultado = await LoteService.buscarLote(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.message || erro.mensagem || "Erro interno do servidor",
      });
    }
  }

  async cadastrarLote(req, res) {
    try {
      const resultado = await LoteService.criarLote(
        req.body.codigo_lote,
        req.body.quantidade_atual,
        req.body.validade,
      );

      res.status(201).json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.message || erro.mensagem || "Erro interno do servidor",
      });
    }
  }

  async atualizarLote(req, res) {
    try {
      const resultado = await LoteService.atualizarLote(
        req.params.id,
        req.body.codigo_lote,
        req.body.quantidade_atual,
        req.body.validade,
      );

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.message || erro.mensagem || "Erro interno do servidor",
      });
    }
  }

  async deletarLote(req, res) {
    try {
      const resultado = await LoteService.excluirLote(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.message || erro.mensagem || "Erro interno do servidor",
      });
    }
  }
}

module.exports = new LoteController();