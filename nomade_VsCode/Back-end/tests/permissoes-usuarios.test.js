// Testes isolados da regra de gerente, sem MySQL ou dependências externas.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const database = new Map([
  [1, { id_usuario: 1, nome: "Gerente", login: "gerente", cargo: "Gerente", senha: "senha123" }],
  [2, { id_usuario: 2, nome: "Operador", login: "operador", cargo: "Operador", senha: "senha123" }],
  [3, { id_usuario: 3, nome: "Usuário", login: "terceiro", cargo: "Operador", senha: "senha123" }],
]);
let nextId = 4;
const repositoryFake = {
  buscarUsuarioPorLogin: async (login) => [...database.values()].find((u) => u.login === login),
  buscarUsuarioId: async (id) => database.get(Number(id)),
  cadastrarUsuario: async (dados) => {
    const id = nextId++;
    database.set(id, { id_usuario: id, ...dados });
    return id;
  },
  apagarUsuario: async (id) => database.delete(Number(id)),
};
// Injeta o repositório falso antes de carregar service/middleware/controller.
const repoPath = path.resolve(__dirname, "../src/repositories/UsuarioRepository.js");
require.cache[repoPath] = {
  id: repoPath, filename: repoPath, loaded: true, exports: repositoryFake,
};

const UsuarioService = require("../src/services/UsuarioService");
const UsuarioController = require("../src/controllers/UsuarioController");
const { autenticar, somenteGerente, somenteProprioUsuario } = require("../src/middlewares/autenticacao");

async function run(handlers, bearer, body = {}, params = {}) {
  const req = { body, params, get: (header) =>
    header === "authorization" && bearer ? `Bearer ${bearer}` : "" };
  const res = {
    code: 200, body: undefined,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
  let i = 0;
  async function step() {
    if (i >= handlers.length) return;
    const handler = handlers[i++];
    let calledNext = false;
    await handler(req, res, () => { calledNext = true; });
    if (calledNext) await step();
  }
  await step();
  return res;
}

let managerToken;
let operatorToken;

test("login retorna token e nunca retorna senha", async () => {
  const manager = await UsuarioService.autenticarUsuario("gerente", "senha123");
  const operator = await UsuarioService.autenticarUsuario("operador", "senha123");
  managerToken = manager.token;
  operatorToken = operator.token;
  assert.match(managerToken, /^[0-9a-f]{64}$/);
  assert.equal(manager.usuario.senha, undefined);
});

test("anônimo não exclui usuário (401)", async () => {
  const response = await run([autenticar, somenteGerente, UsuarioController.deletarUsuario], null, {}, { id: 3 });
  assert.equal(response.code, 401);
  assert.equal(database.has(3), true);
});

test("operador autenticado não exclui usuário (403)", async () => {
  const response = await run([autenticar, somenteGerente, UsuarioController.deletarUsuario], operatorToken, {}, { id: 3 });
  assert.equal(response.code, 403);
  assert.equal(database.has(3), true);
});

test("gerente autenticado exclui outro usuário", async () => {
  const response = await run([autenticar, somenteGerente, UsuarioController.deletarUsuario], managerToken, {}, { id: 3 });
  assert.equal(response.code, 200);
  assert.equal(response.body, true);
  assert.equal(database.has(3), false);
});

test("gerente não pode excluir a própria conta", async () => {
  const response = await run([autenticar, somenteGerente, UsuarioController.deletarUsuario], managerToken, {}, { id: 1 });
  assert.equal(response.code, 403);
  assert.equal(database.has(1), true);
});

test("cargo alterado no banco retira permissão imediatamente", async () => {
  database.get(1).cargo = "Operador";
  const response = await run([autenticar, somenteGerente, UsuarioController.deletarUsuario], managerToken, {}, { id: 2 });
  assert.equal(response.code, 403);
  assert.equal(database.has(2), true);
  database.get(1).cargo = "Gerente";
});

test("cadastro público não pode criar gerente", async () => {
  const response = await run([UsuarioController.cadastrarUsuario], null,
    { nome: "Pessoa", login: "nova", senha: "123456", cargo: "Gerente", setor: "Estoque" });
  assert.equal(response.code, 403);
});

test("cadastro público recebe cargo padrão Operador", async () => {
  const response = await run([UsuarioController.cadastrarUsuario], null,
    { nome: "Pessoa", login: "nova", senha: "123456", setor: "Estoque" });
  assert.equal(response.code, 201);
  assert.equal(database.get(response.body.id_usuario).cargo, "Operador");
});

test("operador não pode promover outro usuário a gerente via POST", async () => {
  const response = await run([autenticar, UsuarioController.cadastrarUsuario], operatorToken,
    { nome: "Pessoa", login: "outra", senha: "123456", cargo: "Gerente" });
  assert.equal(response.code, 403);
});

test("gerente pode criar outro gerente", async () => {
  const response = await run([autenticar, UsuarioController.cadastrarUsuario], managerToken,
    { nome: "Gerente 2", login: "gerente2", senha: "123456", cargo: "Gerente" });
  assert.equal(response.code, 201);
  assert.equal(database.get(response.body.id_usuario).cargo, "Gerente");
});

test("alteração de senha de outra conta é bloqueada", async () => {
  const response = await run([autenticar, somenteProprioUsuario, UsuarioController.alterarSenha], operatorToken,
    { senhaAtual: "senha123", novaSenha: "outra123", confirmarSenha: "outra123" }, { id: 1 });
  assert.equal(response.code, 403);
});

test("cadastro sem autenticação é bloqueado", async () => {
  const response = await run(
    [autenticar, somenteGerente, UsuarioController.cadastrarUsuario],
    null,
    { nome: "Pessoa", login: "sem-token", senha: "123456" },
  );

  assert.equal(response.code, 401);
});
