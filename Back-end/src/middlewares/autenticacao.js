const usuarioRepository = require("../repositories/UsuarioRepository");
const SessaoService = require("../services/SessaoService");

function ehGerente(usuario) {
  return String(usuario?.cargo || "").trim().toLocaleLowerCase("pt-BR") === "gerente";
}

async function autenticar(req, res, next) {
  const cabecalho = req.get("authorization") || "";
  const resultado = /^Bearer ([a-f0-9]{64})$/i.exec(cabecalho);
  const token = resultado?.[1];
  const sessao = SessaoService.buscarSessao(token);

  if (!sessao) {
    return res.status(401).json({ sucesso: false, mensagem: "Faça login para continuar." });
  }

  try {
    // Busca o cargo no banco em CADA requisição. Alterar o localStorage ou o
    // cargo do usuário durante a sessão não concede permissão de gerente.
    const usuario = await usuarioRepository.buscarUsuarioId(sessao.idUsuario);
    if (!usuario) {
      SessaoService.encerrarSessao(token);
      return res.status(401).json({ sucesso: false, mensagem: "Sessão inválida. Entre novamente." });
    }
    req.usuarioAutenticado = usuario;
    req.tokenSessao = token;
    return next();
  } catch (erro) {
    return next(erro);
  }
}

function autenticarSeHouverToken(req, res, next) {
  if (!req.get("authorization")) return next();
  return autenticar(req, res, next);
}

function somenteGerente(req, res, next) {
  if (!ehGerente(req.usuarioAutenticado)) {
    return res.status(403).json({ sucesso: false, mensagem: "Somente o gerente pode executar esta ação." });
  }
  return next();
}

function somenteProprioUsuario(req, res, next) {
  if (String(req.params.id) !== String(req.usuarioAutenticado?.id_usuario)) {
    return res.status(403).json({ sucesso: false, mensagem: "Você só pode alterar sua própria senha." });
  }
  return next();
}

module.exports = { autenticar, autenticarSeHouverToken, somenteGerente, somenteProprioUsuario, ehGerente };
