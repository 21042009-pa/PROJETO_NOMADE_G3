const express = require('express')
const routes = require('./routes')
const path = require("path")
const app = express()
const cors = require("cors");


app.use(express.json()) 
app.use('/', routes)

app.use('/uploads', express.static(path.join(__dirname, "../../uploads")))

const origens = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN
      .split(",")
      .map((origem) => origem.trim())
  : true;

app.use(cors({
  origin: origens,
  credentials: true
}));

app.use(errorHandler);

module.exports = app