const usuarioRepository = require("../repositories/UsuarioRepository");

class UsuarioService {
  async criarUsuario(nome, login, senha, cargo, setor) {
  const dadosDoUsuario = {
    nome: nome,
    login: login,
    senha: senha,
    cargo: cargo,
    setor: setor,
  };

  const usuario = await usuarioRepository.cadastrarUsuario(dadosDoUsuario);

  return usuario;
}

async listarUsuarios() {
  const usuarios = await usuarioRepository.listarUsuarios();

  return usuarios;
}

async buscarUsuario(id) {
  const usuario = await usuarioRepository.buscarUsuarioId(id);

  return usuario;
}

async atualizarUsuario(id, nome, login, senha, cargo, setor) {
  const dadosDoUsuario = {
    nome: nome,
    login: login,
    senha: senha,
    cargo: cargo,
    setor: setor,
  };

  const usuario = await usuarioRepository.atualizarUsuario(id, dadosDoUsuario);

  return usuario;
}

async deletarUsuario(id) {
  const usuario = await usuarioRepository.apagarUsuario(id);

  return usuario;
}}

module.exports = new UsuarioService()
