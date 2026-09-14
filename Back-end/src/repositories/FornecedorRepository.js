const pool = require("../config/database");

class FornecedorRepository {
  async listarFornecedores() {
    const [listaFornecedores] = await pool.query(
      "SELECT * FROM tbl_fornecedor",
    );

    return listaFornecedores;
  }

  async buscarFornecedorId(id) {
    const [mostrarFornecedor] = await pool.query(
      "SELECT * FROM tbl_fornecedor WHERE id_fornecedor = ?",
      [id],
    );

    return mostrarFornecedor[0];
  }

  async cadastrarFornecedor(dadosDoFornecedor) {
    const [resultadoFornecedor] = await pool.query(
      "INSERT INTO tbl_fornecedor SET ?",
      [dadosDoFornecedor],
    );

    return resultadoFornecedor.insertId;
  }

  async atualizarFornecedor(id, dadosDoFornecedor) {
    const camposFornecedor = [];
    const valoresFornecedor = [];

    for (const [key, value] of Object.entries(dadosDoFornecedor)) {
      camposFornecedor.push(`${key} = ?`);
      valoresFornecedor.push(value);
    }

    if (camposFornecedor.length === 0) {
      return null;
    }

    valoresFornecedor.push(id);

    const query = `
            UPDATE tbl_fornecedor
            SET ${camposFornecedor.join(", ")}
            WHERE id_fornecedor = ?
        `;

    const [resultadoFornecedor] = await pool.query(query, valoresFornecedor);

    return resultadoFornecedor.affectedRows;
  }

  async apagarFornecedor(id) {
    await pool.query("DELETE FROM tbl_fornecedor WHERE id_fornecedor = ?", [
      id,
    ]);

    return true;
  }
}

module.exports = new FornecedorRepository();
