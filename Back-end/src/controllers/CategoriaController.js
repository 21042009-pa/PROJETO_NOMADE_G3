const CategoriaService = require("../services/CategoriaService");

class CategoriaController {
  async listarCategoria(req, res) {
    try {
      const resultado = await CategoriaService.listarCategorias();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async buscarCategoriaPorId(req, res) {
    try {
      const resultado = await CategoriaService.buscarCategoria(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrarCategoria(req, res) {
    try {
      const resultado = await CategoriaService.criarCategoria(
        req.body.nome_categoria,
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

  async atualizarCategoria(req, res) {
    try {
      const resultado = await CategoriaService.atualizarCategoria(
        req.params.id,
        req.body.nome_categoria,
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

  async deletarCategoria(req, res) {
    try {
      const resultado = await CategoriaService.excluirCategoria(req.params.id);

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

module.exports = new CategoriaController();
