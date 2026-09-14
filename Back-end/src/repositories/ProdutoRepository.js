const pool = require("../config/database");

class ProdutoRepository {
  async listarProdutos() {
    const [listaProdutos] = await pool.query("SELECT * FROM tbl_produto");

    return listaProdutos;
  }

  async buscarProdutoId(id) {
    const [mostrarProduto] = await pool.query(
      "SELECT * FROM tbl_produto WHERE id_produto = ?",
      [id],
    );

    return mostrarProduto[0];
  }

  async cadastrarProduto(dadosDoProduto) {
    const [resultadoProduto] = await pool.query(
      "INSERT INTO tbl_produto SET ?",
      [dadosDoProduto],
    );

    return resultadoProduto.insertId;
  }

  async atualizarProduto(id, dadosDoProduto) {
    const camposProduto = [];
    const valoresProduto = [];

    for (const [key, value] of Object.entries(dadosDoProduto)) {
      camposProduto.push(`${key} = ?`);
      valoresProduto.push(value);
    }

    if (camposProduto.length === 0) {
      return null;
    }

    valoresProduto.push(id);

    const query = `
            UPDATE tbl_produto
            SET ${camposProduto.join(", ")}
            WHERE id_produto = ?
        `;

    const [resultadoProduto] = await pool.query(query, valoresProduto);

    return resultadoProduto.affectedRows;
  }

  async apagarProduto(id) {
    await pool.query("DELETE FROM tbl_produto WHERE id_produto = ?", [id]);

    return true;
  }
}

module.exports = new ProdutoRepository();
