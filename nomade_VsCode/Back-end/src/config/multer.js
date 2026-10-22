const express = require("express")
const multer = require("multer")
const path = require("path")
const app = express()
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!permitidos.includes(file.mimetype)) {
    return cb(new Error("A imagem deve ser JPG, PNG ou WEBP."));
  }

  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});