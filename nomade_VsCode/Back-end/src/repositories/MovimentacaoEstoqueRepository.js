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
}

module.exports = new MovimentacaoEstoqueRepository();
