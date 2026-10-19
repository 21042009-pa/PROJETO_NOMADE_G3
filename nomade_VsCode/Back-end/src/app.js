const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const frontendPath = path.join(__dirname, "../../front-end/nomade");

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
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
app.use("/", routes);

module.exports = app;
