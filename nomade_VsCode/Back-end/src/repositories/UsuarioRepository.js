const pool = require("../config/database");

class UsuarioRepository {
  async listarUsuarios() {
    const [listaUsuarios] = await pool.query("SELECT * FROM tbl_usuario");

    return listaUsuarios;
  }

  async buscarUsuarioId(id) {
    const [mostrarUsuario] = await pool.query(
      "SELECT * FROM tbl_usuario WHERE id_usuario = ?",
      [id],
    );

    return mostrarUsuario[0];
  }

  async cadastrarUsuario(dadosDoUsuario) {
    const [resultadoUsuario] = await pool.query(
      "INSERT INTO tbl_usuario SET ?",
      [dadosDoUsuario],
    );

    return resultadoUsuario.insertId;
  }

  async atualizarUsuario(id, dadosDoUsuario) {
    const camposUsuario = [];
    const valoresUsuario = [];

    for (const [key, value] of Object.entries(dadosDoUsuario)) {
      camposUsuario.push(`${key} = ?`);
      valoresUsuario.push(value);
    }

    if (camposUsuario.length === 0) {
      return null;
    }

    valoresUsuario.push(id);

    const query = `
            UPDATE tbl_usuario
            SET ${camposUsuario.join(", ")}
            WHERE id_usuario = ?
        `;

    const [resultadoUsuario] = await pool.query(query, valoresUsuario);

    return resultadoUsuario.affectedRows;
  }

  async apagarUsuario(id) {
    await pool.query("DELETE FROM tbl_usuario WHERE id_usuario = ?", [id]);

    return true;
  }
}

module.exports = new UsuarioRepository();
