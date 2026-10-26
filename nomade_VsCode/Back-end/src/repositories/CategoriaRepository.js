const pool = require("../config/database");

class CategoriaRepository {
  async listarCategorias() {
    const [listaCategorias] = await pool.query("SELECT * FROM tbl_categoria");

    return listaCategorias;
  }

  async buscarCategoriaId(id) {
    const [mostrarCategoria] = await pool.query(
      "SELECT * FROM tbl_categoria WHERE id_categoria = ?",
      [id],
    );

    return mostrarCategoria[0];
  }

  async cadastrarCategoria(dadosDaCategoria) {
    const [resultadoCategoria] = await pool.query(
      "INSERT INTO tbl_categoria SET ?",
      [dadosDaCategoria],
    );

    return resultadoCategoria.insertId;
  }

  async atualizarCategoria(id, dadosDaCategoria) {
    const camposCategoria = [];
    const valoresCategoria = [];

    for (const [key, value] of Object.entries(dadosDaCategoria)) {
      camposCategoria.push(`${key} = ?`);
      valoresCategoria.push(value);
    }

    if (camposCategoria.length === 0) {
      return null;
    }

    valoresCategoria.push(id);

    const query = `
            UPDATE tbl_categoria
            SET ${camposCategoria.join(", ")}
            WHERE id_categoria = ?
        `;

    const [resultadoCategoria] = await pool.query(query, valoresCategoria);

    return resultadoCategoria.affectedRows;
  }

  async apagarCategoria(id) {
    await pool.query("DELETE FROM tbl_categoria WHERE id_categoria = ?", [id]);

    return true;
  }
}

module.exports = new CategoriaRepository();
