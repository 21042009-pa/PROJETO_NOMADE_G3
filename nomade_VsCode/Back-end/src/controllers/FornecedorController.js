const FornecedorService = require("../services/FornecedorService");

class FornecedorController {
  async listarFornecedor(req, res) {
    try {
      const resultado = await FornecedorService.listarFornecedores();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async buscarFornecedorPorId(req, res) {
    try {
      const resultado = await FornecedorService.buscarFornecedor(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrarFornecedor(req, res) {
    try {
      const resultado = await FornecedorService.criarFornecedor(
        req.body.nome,
        req.body.contato,
        req.body.endereco,
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

  async atualizarFornecedor(req, res) {
    try {
      const resultado = await FornecedorService.atualizarFornecedor(
        req.params.id,
        req.body.nome,
        req.body.contato,
        req.body.endereco,
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

  async deletarFornecedor(req, res) {
    try {
      const resultado = await FornecedorService.excluirFornecedor(
        req.params.id,
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
}

module.exports = new FornecedorController();
