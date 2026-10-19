const crypto = require("crypto");
const usuarioRepository = require("../repositories/UsuarioRepository");
const SessaoService = require("./SessaoService");

function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  erro.mensagem = mensagem;
  return erro;
}

function gerarHashSenha(senha) {
  return "sha256:" + crypto.createHash("sha256").update(String(senha)).digest("hex");
}

function senhaValida(senhaInformada, senhaBanco) {
  if (!senhaBanco) return false;

  const senhaSalva = String(senhaBanco);

  // Novos usuários usam SHA-256; usuários antigos em texto simples continuam compatíveis.
  if (senhaSalva.startsWith("sha256:")) {
    const hashInformado = crypto
      .createHash("sha256")
      .update(String(senhaInformada))
      .digest("hex");

    const hashSalvo = senhaSalva.slice(7);

    if (hashInformado.length !== hashSalvo.length) return false;

    return crypto.timingSafeEqual(
      Buffer.from(hashInformado, "utf8"),
      Buffer.from(hashSalvo, "utf8"),
    );
  }

  return String(senhaInformada) === senhaSalva;
}

function removerSenha(usuario) {
  if (!usuario) return usuario;
  const { senha: _senha, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
}

async function autenticarUsuario(login, senha) {
  const usuario = await usuarioRepository.buscarUsuarioPorLogin(login);

  if (!usuario || !senhaValida(senha, usuario.senha)) {
    throw criarErro("Login ou senha inválidos.", 401);
  }

  return {
    sucesso: true,
    mensagem: "Login realizado com sucesso.",
    usuario: removerSenha(usuario),
    token: SessaoService.criarSessao(usuario.id_usuario),
  };
}

async function criarUsuario(nome, login, senha, cargo, setor) {
  if (!nome || !login || !senha) {
    throw criarErro("Nome, login e senha são obrigatórios.");
  }

  if (String(senha).length < 6) {
    throw criarErro("A senha deve ter pelo menos 6 caracteres.");
  }

  const dadosDoUsuario = {
    nome,
    login,
    senha: gerarHashSenha(senha),
    cargo,
    setor,
  };

  try {
    const id = await usuarioRepository.cadastrarUsuario(dadosDoUsuario);
    return {
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso.",
      id_usuario: id,
    };
  } catch (erroBanco) {
    if (erroBanco.code === "ER_DUP_ENTRY") {
      throw criarErro("Este login já está cadastrado. Escolha outro login.", 409);
    }
    throw erroBanco;
  }
}

async function listarUsuarios() {
  return usuarioRepository.listarUsuarios();
}

async function buscarUsuario(id) {
  const usuario = await usuarioRepository.buscarUsuarioId(id);
  if (!usuario) throw criarErro("Usuário não encontrado.", 404);
  return removerSenha(usuario);
}

async function alterarSenha(id, senhaAtual, novaSenha, confirmarSenha) {
  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    throw criarErro("Preencha a senha atual, a nova senha e a confirmação.");
  }

  if (String(novaSenha).length < 6) {
    throw criarErro("A nova senha deve ter pelo menos 6 caracteres.");
  }

  if (novaSenha !== confirmarSenha) {
    throw criarErro("A confirmação da nova senha não confere.");
  }

  const usuario = await usuarioRepository.buscarUsuarioId(id);

  if (!usuario) {
    throw criarErro("Usuário não encontrado.", 404);
  }

  if (!senhaValida(senhaAtual, usuario.senha)) {
    throw criarErro("A senha atual está incorreta.", 401);
  }

  if (senhaValida(novaSenha, usuario.senha)) {
    throw criarErro("A nova senha deve ser diferente da senha atual.");
  }

  await usuarioRepository.atualizarSenha(id, gerarHashSenha(novaSenha));

  return {
    sucesso: true,
    mensagem: "Senha alterada com sucesso.",
  };
}

async function atualizarUsuario(id, nome, login, senha, cargo, setor) {
  const dadosDoUsuario = {};

  if (nome !== undefined) dadosDoUsuario.nome = nome;
  if (login !== undefined) dadosDoUsuario.login = login;
  if (cargo !== undefined) dadosDoUsuario.cargo = cargo;
  if (setor !== undefined) dadosDoUsuario.setor = setor;

  if (senha !== undefined && senha !== "") {
    if (String(senha).length < 6) {
      throw criarErro("A senha deve ter pelo menos 6 caracteres.");
    }
    dadosDoUsuario.senha = gerarHashSenha(senha);
  }

  const atualizado = await usuarioRepository.atualizarUsuario(id, dadosDoUsuario);

  if (!atualizado) {
    throw criarErro("Usuário não encontrado ou nenhum dado foi alterado.", 404);
  }

  return { sucesso: true, mensagem: "Usuário atualizado com sucesso." };
}

async function excluirUsuario(id) {
  return usuarioRepository.apagarUsuario(id);
}

module.exports = {
  autenticarUsuario,
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  alterarSenha,
  atualizarUsuario,
  excluirUsuario,
};
