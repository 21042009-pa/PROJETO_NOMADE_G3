const ProdutoService = require("../services/ProdutoService");

class ProdutoController {
  async listarProduto(req, res) {
    try {
      const resultado = await ProdutoService.listarProdutos();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async buscarProdutoPorId(req, res) {
    try {
      const resultado = await ProdutoService.buscarProduto(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrarProduto(req, res) {
    try {
      const resultado = await ProdutoService.criarProduto(
        req.body.id_fornecedor,
        req.body.id_categoria,
        req.body.nome,
        req.body.descricao,
        req.body.modelo,
        req.body.data_validade,
        req.body.codigo_produto,
        req.body.cor,
        req.file ? req.file.filename : null,
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

  async atualizarProduto(req, res) {
    try {
      const resultado = await ProdutoService.atualizarProduto(
        req.params.id,
        req.body.id_fornecedor,
        req.body.id_categoria,
        req.body.nome,
        req.body.descricao,
        req.body.modelo,
        req.body.data_validade,
        req.body.codigo_produto,
        req.body.cor,
        req.file ? req.file.filename : null,
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

  async deletarProduto(req, res) {
    try {
      const resultado = await ProdutoService.excluirProduto(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async upload(req, res) {
    try {
      res.status(200).json({
        sucesso: true,
        arquivo: req.file ? req.file.filename : null,
      });
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }
}

module.exports = new ProdutoController();
