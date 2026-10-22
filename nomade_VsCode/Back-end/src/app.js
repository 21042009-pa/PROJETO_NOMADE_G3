const express = require("express");
const path = require("path");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const frontendPath = path.join(__dirname, "../../front-end");

const origensPermitidas = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

app.use(cors({
  origin: origensPermitidas,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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
