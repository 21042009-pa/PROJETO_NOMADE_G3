const pool = require("../config/database");

function falha(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

// Valida os lançamentos no servidor: nenhuma outra rota pode contornar as regras.
function validarMovimentacao(dados) {
  const id = Number(dados.id_produto);
  const quantidade = Number(dados.quantidade);
  if (!Number.isSafeInteger(id) || id <= 0) throw falha("Selecione um produto válido.");
  if (!["Entrada", "Saída"].includes(dados.tipo)) throw falha("Tipo de movimentação inválido.");
  if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
    throw falha("A quantidade deve ser um número inteiro maior que zero.");
  }
  const data = String(dados.data_movimentacao || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || Number.isNaN(Date.parse(`${data}T00:00:00Z`))) {
    throw falha("Informe uma data de movimentação válida.");
  }
  return {
    id_produto: id,
    tipo: dados.tipo,
    data_movimentacao: data,
    quantidade,
    observacao: String(dados.observacao || "").trim(),
  };
}

async function comTransacao(executar) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const resultado = await executar(conexao);
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

// Estoque verdadeiro fica no lote; cada lançamento altera o lote na mesma
// transação do registro no histórico. O UPDATE condicional impede estoque negativo.
async function alterarSaldo(conexao, dados, reverter = false) {
  const [produtos] = await conexao.query(
    "SELECT id_lote FROM tbl_produto WHERE id_produto = ? FOR UPDATE",
    [dados.id_produto],
  );
  if (!produtos.length) throw falha("Produto não encontrado.", 404);
  const idLote = produtos[0].id_lote;
  if (!idLote) {
    throw falha("Este produto não possui lote. Vincule um lote antes de movimentar o estoque.", 409);
  }

  let diferenca = dados.tipo === "Entrada" ? dados.quantidade : -dados.quantidade;
  if (reverter) diferenca = -diferenca;
  const [resultado] = diferenca > 0
    ? await conexao.query(
        "UPDATE tbl_lote SET quantidade_atual = quantidade_atual + ? WHERE id_lote = ?",
        [diferenca, idLote],
      )
    : await conexao.query(
        "UPDATE tbl_lote SET quantidade_atual = quantidade_atual - ? WHERE id_lote = ? AND quantidade_atual >= ?",
        [-diferenca, idLote, -diferenca],
      );
  if (!resultado.affectedRows) {
    throw falha(
      reverter
        ? "Não é possível desfazer a movimentação: estoque insuficiente no lote."
        : "Estoque insuficiente no lote para registrar esta saída.",
      409,
    );
  }
}

class MovimentacaoEstoqueRepository {
  async listarMovimentacoesEstoque() {
    const [linhas] = await pool.query(
      "SELECT * FROM tbl_movimentacao_estoque ORDER BY id_movimentacao ASC",
    );
    return linhas;
  }

  async buscarMovimentacaoEstoqueId(id) {
    const [linhas] = await pool.query(
      "SELECT * FROM tbl_movimentacao_estoque WHERE id_movimentacao = ?",
      [id],
    );
    return linhas[0];
  }

  async cadastrarMovimentacaoEstoque(dados) {
    const validos = validarMovimentacao(dados);
    return comTransacao(async (conexao) => {
      await alterarSaldo(conexao, validos);
      const [resultado] = await conexao.query(
        "INSERT INTO tbl_movimentacao_estoque SET ?", [validos],
      );
      return resultado.insertId;
    });
  }

  async atualizarMovimentacaoEstoque(id, dados) {
    const validos = validarMovimentacao(dados);
    return comTransacao(async (conexao) => {
      const [anteriores] = await conexao.query(
        "SELECT * FROM tbl_movimentacao_estoque WHERE id_movimentacao = ? FOR UPDATE",
        [id],
      );
      if (!anteriores.length) throw falha("Movimentação não encontrada.", 404);
      await alterarSaldo(conexao, anteriores[0], true);
      await alterarSaldo(conexao, validos);
      const [resultado] = await conexao.query(
        "UPDATE tbl_movimentacao_estoque SET ? WHERE id_movimentacao = ?",
        [validos, id],
      );
      return resultado.affectedRows;
    });
  }

  async apagarMovimentacaoEstoque(id) {
    return comTransacao(async (conexao) => {
      const [anteriores] = await conexao.query(
        "SELECT * FROM tbl_movimentacao_estoque WHERE id_movimentacao = ? FOR UPDATE",
        [id],
      );
      if (!anteriores.length) throw falha("Movimentação não encontrada.", 404);
      await alterarSaldo(conexao, anteriores[0], true);
      const [resultado] = await conexao.query(
        "DELETE FROM tbl_movimentacao_estoque WHERE id_movimentacao = ?", [id],
      );
      return Boolean(resultado.affectedRows);
    });
  }
}

module.exports = new MovimentacaoEstoqueRepository();