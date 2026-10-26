// Confere a assinatura da imagem e remove arquivos não utilizados.
const fs = require("fs/promises");
const path = require("path");
const pastaUploads = path.resolve(__dirname, "../../uploads");

async function validarImagem(arquivo) {
  if (!arquivo) return;
  const f = await fs.open(arquivo.path, "r");
  const buffer = Buffer.alloc(16);
  try {
    await f.read(buffer, 0, buffer.length, 0);
  } finally {
    await f.close();
  }
  const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp = buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  const valido = (arquivo.mimetype === "image/jpeg" && jpg) ||
    (arquivo.mimetype === "image/png" && png) ||
    (arquivo.mimetype === "image/webp" && webp);
  if (!valido) {
    const erro = new Error("O arquivo não contém uma imagem válida do formato selecionado.");
    erro.status = 400;
    throw erro;
  }
}

async function apagarImagem(nome) {
  // Nunca aceitar caminhos arbitrários no banco ou em uma requisição.
  if (!nome || !/^[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(nome)) return;
  try {
    await fs.unlink(path.join(pastaUploads, nome));
  } catch (erro) {
    if (erro.code !== "ENOENT") console.error("Erro ao remover imagem:", erro);
  }
}

module.exports = { validarImagem, apagarImagem };