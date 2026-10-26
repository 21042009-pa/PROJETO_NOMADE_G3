const test = require("node:test");
const assert = require("node:assert/strict");
const { ehGerente, somenteGerente, somenteProprioUsuario } = require("../src/middlewares/autenticacao");

test("somente quem tem cargo Gerente pode gerenciar exclusões", () => {
  assert.equal(ehGerente({ cargo: "Gerente" }), true);
  assert.equal(ehGerente({ cargo: "gerente " }), true);
  assert.equal(ehGerente({ cargo: "Administrador" }), false);
  assert.equal(ehGerente({ cargo: "Operador" }), false);
});

test("somenteGerente retorna 403 para outros cargos", () => {
  let statusAtual = 0;
  const resposta = {
    status(codigo) { statusAtual = codigo; return this; },
    json(dados) { return dados; },
  };
  const bloqueado = somenteGerente({ usuarioAutenticado: { cargo: "Operador" } }, resposta, () => {
    throw new Error("Não deveria autorizar!");
  });
  assert.equal(statusAtual, 403);
  assert.equal(bloqueado.sucesso, false);
  let autorizou = false;
  somenteGerente({ usuarioAutenticado: { cargo: "Gerente" } }, resposta, () => { autorizou = true; });
  assert.equal(autorizou, true);
});

test("usuário só pode alterar a própria senha", () => {
  let statusAtual = 0;
  const resposta = {
    status(codigo) { statusAtual = codigo; return this; },
    json(dados) { return dados; },
  };
  let autorizou = false;
  somenteProprioUsuario({ params: { id: "2" }, usuarioAutenticado: { id_usuario: 1 } }, resposta, () => {
    autorizou = true;
  });
  assert.equal(statusAtual, 403);
  assert.equal(autorizou, false);
  somenteProprioUsuario({ params: { id: "1" }, usuarioAutenticado: { id_usuario: 1 } }, resposta, () => {
    autorizou = true;
  });
  assert.equal(autorizou, true);
});