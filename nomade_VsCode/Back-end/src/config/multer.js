// Upload de uma imagem por produto: JPG, PNG ou WebP (até 5 MB).
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadsDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const extensoes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDir),
  filename: (_req, file, callback) => {
    // Não reutilizar nomes enviados pelo cliente: evita colisões e traversal.
    callback(null, `${crypto.randomUUID()}${extensoes[file.mimetype]}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!Object.hasOwn(extensoes, file.mimetype)) {
      const erro = new Error("Envie uma imagem JPG, PNG ou WebP.");
      erro.status = 400;
      return callback(erro);
    }
    callback(null, true);
  },
});