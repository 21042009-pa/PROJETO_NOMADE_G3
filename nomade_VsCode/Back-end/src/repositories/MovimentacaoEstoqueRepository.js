const pool = require("../config/database");

class MovimentacaoEstoqueRepository {
  async listarMovimentacoesEstoque() {
    const [listaMovimentacoes] = await pool.query(
      "SELECT * FROM tbl_movimentacao_estoque",
    );

    return listaMovimentacoes;
  }

  async buscarMovimentacaoEstoqueId(id) {
    const [mostrarMovimentacao] = await pool.query(
      `SELECT * FROM tbl_movimentacao_estoque
             WHERE id_movimentacao = ?`,
      [id],
    );

    return mostrarMovimentacao[0];
  }

  async cadastrarMovimentacaoEstoque(dadosDaMovimentacao) {
    const [resultadoMovimentacao] = await pool.query(
      "INSERT INTO tbl_movimentacao_estoque SET ?",
      [dadosDaMovimentacao],
    );

    return resultadoMovimentacao.insertId;
  }

  async atualizarMovimentacaoEstoque(id, dadosDaMovimentacao) {
    const camposMovimentacao = [];
    const valoresMovimentacao = [];

    for (const [key, value] of Object.entries(dadosDaMovimentacao)) {
      camposMovimentacao.push(`${key} = ?`);
      valoresMovimentacao.push(value);
    }

    if (camposMovimentacao.length === 0) {
      return null;
    }

    valoresMovimentacao.push(id);

    const query = `
            UPDATE tbl_movimentacao_estoque
            SET ${camposMovimentacao.join(", ")}
            WHERE id_movimentacao = ?
        `;

    const [resultadoMovimentacao] = await pool.query(
      query,
      valoresMovimentacao,
    );

    return resultadoMovimentacao.affectedRows;
  }

  async apagarMovimentacaoEstoque(id) {
    await pool.query(
      "DELETE FROM tbl_movimentacao_estoque WHERE id_movimentacao = ?",
      [id],
    );

    return true;
  }

  async registrarComAtualizacao(dados) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [lotes] = await connection.query(
      `SELECT id_lote, id_produto, quantidade_atual
       FROM tbl_lote
       WHERE id_lote = ? AND id_produto = ?
       FOR UPDATE`,
      [dados.id_lote, dados.id_produto],
    );

    const lote = lotes[0];

    if (!lote) {
      const erro = new Error("Lote não encontrado para este produto.");
      erro.status = 404;
      erro.mensagem = erro.message;
      throw erro;
    }

    const quantidade = Number(dados.quantidade);
    const novaQuantidade = dados.tipo === "Entrada"
      ? Number(lote.quantidade_atual) + quantidade
      : Number(lote.quantidade_atual) - quantidade;

    if (novaQuantidade < 0) {
      const erro = new Error("Estoque insuficiente.");
      erro.status = 409;
      erro.mensagem = erro.message;
      throw erro;
    }

    await connection.query(
      "UPDATE tbl_lote SET quantidade_atual = ? WHERE id_lote = ?",
      [novaQuantidade, dados.id_lote],
    );

    const [resultado] = await connection.query(
      `INSERT INTO tbl_movimentacao_estoque
       (id_produto, id_lote, tipo, data_movimentacao, quantidade, observacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dados.id_produto,
        dados.id_lote,
        dados.tipo,
        dados.data_movimentacao,
        quantidade,
        dados.observacao,
      ],
    );

    await connection.commit();
    return resultado.insertId;
  } catch (erro) {
    await connection.rollback();
    throw erro;
  } finally {
    connection.release();
  }
}
}

module.exports = new MovimentacaoEstoqueRepository();
