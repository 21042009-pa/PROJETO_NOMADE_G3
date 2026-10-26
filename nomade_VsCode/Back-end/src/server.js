const app = require("./app");
const pool = require("./config/database");
const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    const conexao = await pool.getConnection();
    conexao.release();
    console.log("Conectado ao MySQL com sucesso!");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (erro) {
    console.error("Erro ao conectar no MySQL:", erro.message);
    process.exitCode = 1;
  }
}

iniciarServidor();