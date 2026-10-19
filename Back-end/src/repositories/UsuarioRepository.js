const pool = require("../config/database");

class UsuarioRepository {
  async listarUsuarios() {
    const [listaUsuarios] = await pool.query(
      `SELECT id_usuario, nome, login, cargo, setor
       FROM tbl_usuario
       ORDER BY id_usuario DESC`,
    );

    return listaUsuarios;
  }

  async buscarUsuarioPorLogin(login) {
    const [usuarios] = await pool.query(
      "SELECT * FROM tbl_usuario WHERE login = ? LIMIT 1",
      [login],
    );

    return usuarios[0];
  }

  async buscarUsuarioId(id) {
    const [usuarios] = await pool.query(
      "SELECT * FROM tbl_usuario WHERE id_usuario = ? LIMIT 1",
      [id],
    );

    return usuarios[0];
  }

  async cadastrarUsuario(dadosDoUsuario) {
    const [resultadoUsuario] = await pool.query(
      "INSERT INTO tbl_usuario SET ?",
      [dadosDoUsuario],
    );

    return resultadoUsuario.insertId;
  }

  async atualizarSenha(id, senhaHash) {
    const [resultado] = await pool.query(
      "UPDATE tbl_usuario SET senha = ? WHERE id_usuario = ?",
      [senhaHash, id],
    );

    return resultado.affectedRows;
  }

  async atualizarUsuario(id, dadosDoUsuario) {
    const camposUsuario = [];
    const valoresUsuario = [];

    for (const [key, value] of Object.entries(dadosDoUsuario)) {
      camposUsuario.push(`${key} = ?`);
      valoresUsuario.push(value);
    }

    if (camposUsuario.length === 0) return 0;

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
    const [resultado] = await pool.query(
      "DELETE FROM tbl_usuario WHERE id_usuario = ?",
      [id],
    );

    return resultado.affectedRows > 0;
  }
}

module.exports = new UsuarioRepository();
