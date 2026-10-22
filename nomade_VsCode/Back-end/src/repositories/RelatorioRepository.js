const pool = require("../config/database");

class RelatorioRepository {
  async estoque() {
    const [rows] = await pool.query(`
      SELECT
        p.id_produto,
        p.nome,
        p.codigo_produto,
        l.codigo_lote,
        l.quantidade_atual,
        l.validade
      FROM tbl_produto p
      LEFT JOIN tbl_lote l ON l.id_produto = p.id_produto
      ORDER BY p.nome
    `);

    return rows;
  }
}

module.exports = new RelatorioRepository();