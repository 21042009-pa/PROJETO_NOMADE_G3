const ProdutoService = require("../services/ProdutoService");

class ProdutoController {
  async listarProdutos(req, res) {
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

  async consultarEstoque(req, res) {
    try {
      const resultado = await ProdutoService.buscarEstoqueProduto(
        req.params.id,
      );

      res.json({
        id_produto: req.params.id,
        estoque: resultado.estoque,
      });
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
      const { id } = req.params;

      const produto = await ProdutoService.atualizarProduto(id, {
        ...req.body,
        imagem: req.file ? req.file.filename : req.body.imagem,
      });

      res.json(produto);
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
      const resultado = await ProdutoService.deletarProduto(req.params.id);

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
      res.json({
        mensagem: "Imagem enviada com sucesso",
        arquivo: req.file,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao enviar imagem",
        erro: erro.stack || erro,
      });
    }
  }
}

module.exports = new ProdutoController();
