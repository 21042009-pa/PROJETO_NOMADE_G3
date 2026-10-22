const service = require("../services/RelatorioService");

async function estoque(_req, res) {
  try {
    res.json(await service.estoque());
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível gerar o relatório de estoque.",
    });
  }
}

module.exports = { estoque };