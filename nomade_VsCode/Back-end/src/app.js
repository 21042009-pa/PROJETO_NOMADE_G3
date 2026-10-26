const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const frontendPath = path.join(__dirname, "../../front-end");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Permite testar o front-end também pelo Live Server/VS Code.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.static(frontendPath));
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), { index: false, dotfiles: "deny" }));
app.use("/", routes);

// Multer/Express: tamanho, formato ou multipart inválido.
app.use((erro, _req, res, _next) => {
  if (erro.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ sucesso: false, mensagem: "A imagem deve ter no máximo 5 MB." });
  }
  if (erro.code === "LIMIT_UNEXPECTED_FILE" || erro.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ sucesso: false, mensagem: "Envie somente uma imagem pelo campo imagem." });
  }
  if (!erro.status || erro.status >= 500) console.error(erro);
  res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.status ? erro.message : "Erro interno do servidor." });
});

module.exports = app;