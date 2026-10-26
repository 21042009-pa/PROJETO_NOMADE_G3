const MovimentacaoEstoqueService = require("../services/MovimentacaoEstoqueService");

class MovimentacaoEstoqueController {
  async listarMovimentacoesEstoque(req, res) {
    try {
      const resultado =
        await MovimentacaoEstoqueService.listarMovimentacoesEstoque();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.status ? erro.message : "Erro interno do servidor",
      });
    }
  }

  async buscarMovimentacaoEstoquePorId(req, res) {
    try {
      const resultado =
        await MovimentacaoEstoqueService.buscarMovimentacaoEstoque(
          req.params.id,
        );

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.status ? erro.message : "Erro interno do servidor",
      });
    }
  }

  async cadastrarMovimentacaoEstoque(req, res) {
    try {
      const resultado =
        await MovimentacaoEstoqueService.criarMovimentacaoEstoque(
          req.body.id_produto,
          req.body.tipo,
          req.body.data_movimentacao,
          req.body.quantidade,
          req.body.observacao,
        );

      res.status(201).json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.status ? erro.message : "Erro interno do servidor",
      });
    }
  }

  async atualizarMovimentacaoEstoque(req, res) {
    try {
      const resultado =
        await MovimentacaoEstoqueService.atualizarMovimentacaoEstoque(
          req.params.id,
          req.body.id_produto,
          req.body.tipo,
          req.body.data_movimentacao,
          req.body.quantidade,
          req.body.observacao,
        );

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.status ? erro.message : "Erro interno do servidor",
      });
    }
  }

  async deletarMovimentacaoEstoque(req, res) {
    try {
      const resultado =
        await MovimentacaoEstoqueService.excluirMovimentacaoEstoque(
          req.params.id,
        );

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.status ? erro.message : "Erro interno do servidor",
      });
    }
  }
}

module.exports = new MovimentacaoEstoqueController()