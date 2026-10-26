const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const app = require("../src/app");
const ProdutoService = require("../src/services/ProdutoService");
const uploadPath = path.resolve(__dirname, "../uploads");

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ+/i9sAAAAASUVORK5CYII=", "base64");

async function receber(resposta) {
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : {};
}

test("upload de produtos: PNG válido, verificação e remoção de imagem", async () => {
  const metodos = {
    criarProduto: ProdutoService.criarProduto,
    buscarProduto: ProdutoService.buscarProduto,
    atualizarApenasImagem: ProdutoService.atualizarApenasImagem,
  };
  let nomeAtual = null;
  ProdutoService.criarProduto = async (dados) => {
    assert.equal(dados.nome, "Produto teste");
    assert.ok(dados.imagem?.endsWith(".png"));
    nomeAtual = dados.imagem;
    return 123;
  };
  ProdutoService.buscarProduto = async () => ({ id_produto: 123, imagem: nomeAtual });
  ProdutoService.atualizarApenasImagem = async (_id, imagem) => { nomeAtual = imagem; return 1; };

  const servidor = http.createServer(app);
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${servidor.address().port}`;
  try {
    const form = new FormData();
    form.append("nome", "Produto teste");
    form.append("imagem", new Blob([png], { type: "image/png" }), "foto.png");
    const cadastroResposta = await fetch(`${baseUrl}/produtos`, { method: "POST", body: form });
    assert.equal(cadastroResposta.status, 201);
    assert.deepEqual(await receber(cadastroResposta), { sucesso: true, id_produto: 123 });
    const primeira = nomeAtual;
    assert.deepEqual(await fs.readFile(path.join(uploadPath, primeira)), png);
    const urlResposta = await fetch(`${baseUrl}/uploads/${primeira}`);
    assert.equal(urlResposta.status, 200);

    const alterar = new FormData();
    alterar.append("imagem", new Blob([png], { type: "image/png" }), "outra.png");
    const trocaResposta = await fetch(`${baseUrl}/produtos/123/imagem`, { method: "PUT", body: alterar });
    assert.equal(trocaResposta.status, 200);
    assert.notEqual(nomeAtual, primeira);
    await assert.rejects(fs.stat(path.join(uploadPath, primeira)), { code: "ENOENT" });

    const arquivoRuim = new FormData();
    arquivoRuim.append("nome", "Produto teste");
    arquivoRuim.append("imagem", new Blob(["arquivo falso"], { type: "image/png" }), "falsa.png");
    const ruim = await fetch(`${baseUrl}/produtos`, { method: "POST", body: arquivoRuim });
    assert.equal(ruim.status, 400);
    assert.match((await receber(ruim)).mensagem, /não contém uma imagem válida/);

    const tipoRuim = new FormData();
    tipoRuim.append("imagem", new Blob(["hi"], { type: "text/plain" }), "texto.txt");
    const rejeitada = await fetch(`${baseUrl}/produtos`, { method: "POST", body: tipoRuim });
    assert.equal(rejeitada.status, 400);

    const deletar = await fetch(`${baseUrl}/produtos/123/imagem`, { method: "DELETE" });
    assert.equal(deletar.status, 200);
    assert.equal(nomeAtual, null);
  } finally {
    await new Promise((resolve) => servidor.close(resolve));
    if (nomeAtual) await fs.rm(path.join(uploadPath, nomeAtual), { force: true });
    Object.assign(ProdutoService, metodos);
  }
});