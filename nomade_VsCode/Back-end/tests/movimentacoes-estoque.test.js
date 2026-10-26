const test = require("node:test");
const assert = require("node:assert/strict");
const pool = require("../src/config/database");
const repository = require("../src/repositories/MovimentacaoEstoqueRepository");

function simularBanco() {
  const estado = {
    produtos: { 1: { id_lote: 50 }, 2: { id_lote: null } },
    lotes: { 50: 10 },
    movimentacoes: {},
    proximoId: 1,
  };
  let backup;
  const conexao = {
    async beginTransaction() { backup = structuredClone(estado); },
    async commit() { backup = null; },
    async rollback() {
      Object.assign(estado, structuredClone(backup));
      backup = null;
    },
    release() {},
    async query(sql, parametros = []) {
      if (sql.startsWith("SELECT id_lote FROM tbl_produto")) {
        const produto = estado.produtos[parametros[0]];
        return [produto ? [produto] : []];
      }
      if (sql.startsWith("UPDATE tbl_lote")) {
        const [quantidade, idLote] = parametros;
        if (!(idLote in estado.lotes)) return [{ affectedRows: 0 }];
        if (sql.includes("quantidade_atual >=") && estado.lotes[idLote] < quantidade) {
          return [{ affectedRows: 0 }];
        }
        estado.lotes[idLote] += sql.includes("quantidade_atual +") ? quantidade : -quantidade;
        return [{ affectedRows: 1 }];
      }
      if (sql.startsWith("INSERT INTO tbl_movimentacao_estoque")) {
        const id = estado.proximoId++;
        estado.movimentacoes[id] = { id_movimentacao: id, ...parametros[0] };
        return [{ insertId: id }];
      }
      if (sql.includes("FROM tbl_movimentacao_estoque") && sql.includes("FOR UPDATE")) {
        const movimento = estado.movimentacoes[parametros[0]];
        return [movimento ? [{ ...movimento }] : []];
      }
      if (sql.startsWith("UPDATE tbl_movimentacao_estoque")) {
        const [dados, id] = parametros;
        if (!estado.movimentacoes[id]) return [{ affectedRows: 0 }];
        Object.assign(estado.movimentacoes[id], dados);
        return [{ affectedRows: 1 }];
      }
      if (sql.startsWith("DELETE FROM tbl_movimentacao_estoque")) {
        const existe = Boolean(estado.movimentacoes[parametros[0]]);
        delete estado.movimentacoes[parametros[0]];
        return [{ affectedRows: Number(existe) }];
      }
      throw new Error(`SQL inesperado no teste: ${sql}`);
    },
  };
  return { estado, conexao };
}

const movimento = (tipo, quantidade, id_produto = 1) => ({
  id_produto, tipo, quantidade, data_movimentacao: "2026-10-26", observacao: "Teste",
});

test("movimentações atualizam o lote e histórico juntos; saída excedente não altera nada", async () => {
  const { estado, conexao } = simularBanco();
  const original = pool.getConnection;
  pool.getConnection = async () => conexao;
  try {
    const entradaId = await repository.cadastrarMovimentacaoEstoque(movimento("Entrada", 5));
    assert.equal(estado.lotes[50], 15);
    assert.ok(estado.movimentacoes[entradaId]);

    const saidaId = await repository.cadastrarMovimentacaoEstoque(movimento("Saída", 9));
    assert.equal(estado.lotes[50], 6);
    await assert.rejects(repository.cadastrarMovimentacaoEstoque(movimento("Saída", 7)), {
      status: 409,
      message: /Estoque insuficiente/,
    });
    assert.equal(estado.lotes[50], 6);
    assert.equal(Object.keys(estado.movimentacoes).length, 2);

    assert.equal(await repository.apagarMovimentacaoEstoque(saidaId), true);
    assert.equal(estado.lotes[50], 15);
    assert.ok(!estado.movimentacoes[saidaId]);

    assert.equal(await repository.atualizarMovimentacaoEstoque(entradaId, movimento("Saída", 2)), 1);
    assert.equal(estado.lotes[50], 8);
    assert.equal(estado.movimentacoes[entradaId].tipo, "Saída");
  } finally {
    pool.getConnection = original;
  }
});

test("movimentação de produto sem lote ou quantidade inválida é recusada", async () => {
  const { estado, conexao } = simularBanco();
  const original = pool.getConnection;
  pool.getConnection = async () => conexao;
  try {
    await assert.rejects(repository.cadastrarMovimentacaoEstoque(movimento("Entrada", 1, 2)), {
      status: 409, message: /não possui lote/,
    });
    await assert.rejects(repository.cadastrarMovimentacaoEstoque(movimento("Saída", -1)), {
      status: 400,
    });
    assert.equal(estado.lotes[50], 10);
    assert.equal(Object.keys(estado.movimentacoes).length, 0);
  } finally {
    pool.getConnection = original;
  }
});