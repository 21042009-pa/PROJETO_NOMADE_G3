const usuarioRepository = require("../repositories/UsuarioRepository");

async function criarUsuario(nome, login, senha, cargo, setor) {
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

async function listarUsuarios() {
  const usuarios = await usuarioRepository.listarUsuarios();

  return usuarios;
}

async function buscarUsuario(id) {
  const usuario = await usuarioRepository.buscarUsuarioId(id);

  return usuario;
}

async function atualizarUsuario(id, nome, login, senha, cargo, setor) {
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

async function excluirUsuario(id) {
  const usuario = await usuarioRepository.apagarUsuario(id);

  return usuario;
}

module.exports = {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
};
