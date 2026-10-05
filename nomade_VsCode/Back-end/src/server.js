const app = require('./app');
const pool = require('./config/database');
const PORT = Number(process.env.PORT || 3000);

async function iniciar() {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("Não foi possível conectar ao banco de dados.");
    process.exit(1);
  }
}

iniciar();

pool.getConnection((err, connection) => { 
    if (err) { 
        console.error('Erro ao conectar no banco:', err);
        process.exit(1); 
    }

    console.log('Conectado ao MySQL com sucesso!');
    connection.release(); 
});

app.listen(PORT, () => { 
    console.log(`Servidor rodando na porta ${PORT}`);
});