const pool = require("../config/database");

class LoteRepository {
  async listarLotes() {
    const [listaLotes] = await pool.query("SELECT * FROM tbl_lote");

    return listaLotes;
  }

  async buscarLoteId(id) {
    const [mostrarLote] = await pool.query(
      "SELECT * FROM tbl_lote WHERE id_lote = ?",
      [id],
    );

    return mostrarLote[0];
  }

  async cadastrarLote(dadosDoLote) {
    const [resultadoLote] = await pool.query("INSERT INTO tbl_lote SET ?", [
      dadosDoLote,
    ]);

    return resultadoLote.insertId;
  }

  async atualizarLote(id, dadosDoLote) {
    const camposLote = [];
    const valoresLote = [];

    for (const [key, value] of Object.entries(dadosDoLote)) {
      camposLote.push(`${key} = ?`);
      valoresLote.push(value);
    }

    if (camposLote.length === 0) {
      return null;
    }

    valoresLote.push(id);

    const query = `
            UPDATE tbl_lote
            SET ${camposLote.join(", ")}
            WHERE id_lote = ?
        `;

    const [resultadoLote] = await pool.query(query, valoresLote);

    return resultadoLote.affectedRows;
  }

  async apagarLote(id) {
    await pool.query("DELETE FROM tbl_lote WHERE id_lote = ?", [id]);

    return true;
  }
}

module.exports = new LoteRepository();
