const crypto = require("crypto");

// Tokens aleatórios existem somente no servidor e expiram automaticamente.
// Reiniciar a API encerra as sessões, exigindo novo login.
const sessoes = new Map();
const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000;

function criarSessao(idUsuario) {
  const agora = Date.now();
  for (const [token, sessao] of sessoes) {
    if (sessao.expiraEm <= agora) sessoes.delete(token);
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessoes.set(token, {
    idUsuario: String(idUsuario),
    expiraEm: agora + DURACAO_SESSAO_MS,
  });
  return token;
}

function buscarSessao(token) {
  if (!token || !sessoes.has(token)) return null;
  const sessao = sessoes.get(token);
  if (sessao.expiraEm <= Date.now()) {
    sessoes.delete(token);
    return null;
  }
  return sessao;
}

function encerrarSessao(token) {
  sessoes.delete(token);
}

module.exports = { criarSessao, buscarSessao, encerrarSessao };
