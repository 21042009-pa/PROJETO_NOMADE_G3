const LoteService = require("../services/LoteService");

class LoteController {
  async listarLote(req, res) {
    try {
      const resultado = await LoteService.listarLotes();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
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
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrarLote(req, res) {
    try {
      const resultado = await LoteService.criarLote(
        req.body.id_produto,
        req.body.codigo_lote,
        req.body.quantidade_atual,
        req.body.validade,
      );

      res.status(201).json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async atualizarLote(req, res) {
    try {
      const resultado = await LoteService.atualizarLote(
        req.params.id,
        req.body.id_produto,
        req.body.codigo_lote,
        req.body.quantidade_atual,
        req.body.validade,
      );

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
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
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }
}

module.exports = new LoteController();
