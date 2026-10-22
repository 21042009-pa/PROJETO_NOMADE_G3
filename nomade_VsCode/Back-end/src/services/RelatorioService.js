const repository = require("../repositories/RelatorioRepository");

async function estoque() {
  return repository.estoque();
}

module.exports = { estoque };