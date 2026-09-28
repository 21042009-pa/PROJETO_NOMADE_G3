const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
  async listarUsuarios(req, res) {
    try {
      const resultado = await UsuarioService.listarUsuarios();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async buscarUsuarioPorId(req, res) {
    try {
      const resultado = await UsuarioService.buscarUsuario(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrarUsuario(req, res) {
    try {
      const resultado = await UsuarioService.criarUsuario(
        req.body.nome,
        req.body.login,
        req.body.senha,
        req.body.cargo,
        req.body.setor,
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

  async atualizarUsuario(req, res) {
    try {
      const resultado = await UsuarioService.atualizarUsuario(
        req.params.id,
        req.body.nome,
        req.body.login,
        req.body.senha,
        req.body.cargo,
        req.body.setor,
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

  async deletarUsuario(req, res) {
    try {
      const resultado = await UsuarioService.excluirUsuario(req.params.id);

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

module.exports = new UsuarioController();
