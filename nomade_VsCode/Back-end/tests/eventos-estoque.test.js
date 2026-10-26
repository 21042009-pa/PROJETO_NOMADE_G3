const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");
const service = require("../src/services/MovimentacaoEstoqueService");

test("API transmite evento de atualização depois de registrar movimento", async () => {
  const metodoOriginal = service.criarMovimentacaoEstoque;
  service.criarMovimentacaoEstoque = async () => 19;
  const servidor = http.createServer(app);
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const abortar = new AbortController();
  const timeout = setTimeout(() => abortar.abort(), 3000);
  try {
    const canal = await fetch(`${base}/eventos`, { signal: abortar.signal });
    assert.equal(canal.status, 200);
    assert.match(canal.headers.get("content-type"), /text\/event-stream/);
    const leitor = canal.body.getReader();
    const insercao = await fetch(`${base}/movimentacoes-estoque`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_produto: 1, tipo: "Entrada", quantidade: 1, data_movimentacao: "2026-10-26" }),
    });
    assert.equal(insercao.status, 201);
    let texto = "";
    while (!texto.includes('"recurso":"estoque"')) {
      const { value, done } = await leitor.read();
      if (done) break;
      texto += new TextDecoder().decode(value);
    }
    assert.match(texto, /event: alteracao/);
    assert.match(texto, /"recurso":"estoque"/);
  } finally {
    clearTimeout(timeout);
    abortar.abort();
    service.criarMovimentacaoEstoque = metodoOriginal;
    await new Promise((resolve) => servidor.close(resolve));
  }
});