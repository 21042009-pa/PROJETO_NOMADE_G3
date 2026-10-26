const ProdutoService = require("../services/ProdutoService");
const { validarImagem, apagarImagem } = require("../services/ImagemProdutoService");

function responderErro(res, erro) {
  const status = erro.status || (erro.code === "ER_ROW_IS_REFERENCED_2" ? 409 : 500);
  return res.status(status).json({
    sucesso: false,
    mensagem: status === 500 ? "Erro interno do servidor." : erro.message,
  });
}

class ProdutoController {
  async listarProduto(_req, res) {
    try { res.json(await ProdutoService.listarProdutos()); }
    catch (erro) { responderErro(res, erro); }
  }

  async buscarProdutoPorId(req, res) {
    try {
      const produto = await ProdutoService.buscarProduto(req.params.id);
      if (!produto) return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado." });
      res.json(produto);
    } catch (erro) { responderErro(res, erro); }
  }

  async cadastrarProduto(req, res) {
    try {
      await validarImagem(req.file);
      const resultado = await ProdutoService.criarProduto({
        ...req.body,
        imagem: req.file?.filename ?? null,
      });
      res.status(201).json({ sucesso: true, id_produto: resultado });
    } catch (erro) {
      await apagarImagem(req.file?.filename);
      responderErro(res, erro);
    }
  }

  // Mantém compatibilidade com a rota PUT /produtos/:id já existente.
  async atualizarProduto(req, res) {
    try {
      await validarImagem(req.file);
      const antigo = await ProdutoService.buscarProduto(req.params.id);
      if (!antigo) {
        const erro = new Error("Produto não encontrado.");
        erro.status = 404;
        throw erro;
      }
      const resultado = await ProdutoService.atualizarProduto(
        req.params.id,
        req.body.id_fornecedor, req.body.id_categoria, req.body.nome,
        req.body.descricao, req.body.modelo, req.body.data_validade,
        req.body.codigo_produto, req.body.cor,
        req.file?.filename ?? null, req.body.id_lote,
      );
      if (req.file && resultado) await apagarImagem(antigo.imagem);
      if (!resultado) await apagarImagem(req.file?.filename);
      res.json({ sucesso: Boolean(resultado), alterados: resultado });
    } catch (erro) {
      await apagarImagem(req.file?.filename);
      responderErro(res, erro);
    }
  }

  // Altera APENAS a imagem: não sobrescreve fornecedor, categoria ou outros dados.
  async trocarImagem(req, res) {
    try {
      if (!req.file) {
        const erro = new Error("Selecione a imagem do produto.");
        erro.status = 400;
        throw erro;
      }
      await validarImagem(req.file);
      const antigo = await ProdutoService.buscarProduto(req.params.id);
      if (!antigo) {
        const erro = new Error("Produto não encontrado.");
        erro.status = 404;
        throw erro;
      }
      const alterados = await ProdutoService.atualizarApenasImagem(req.params.id, req.file.filename);
      if (!alterados) {
        const erro = new Error("Produto não encontrado.");
        erro.status = 404;
        throw erro;
      }
      await apagarImagem(antigo.imagem);
      res.json({ sucesso: true, imagem: req.file.filename });
    } catch (erro) {
      await apagarImagem(req.file?.filename);
      responderErro(res, erro);
    }
  }

  async removerImagem(req, res) {
    try {
      const antigo = await ProdutoService.buscarProduto(req.params.id);
      if (!antigo) return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado." });
      await ProdutoService.atualizarApenasImagem(req.params.id, null);
      await apagarImagem(antigo.imagem);
      res.json({ sucesso: true, mensagem: "Imagem removida." });
    } catch (erro) { responderErro(res, erro); }
  }

  async deletarProduto(req, res) {
    try {
      const antigo = await ProdutoService.buscarProduto(req.params.id);
      const resultado = await ProdutoService.excluirProduto(req.params.id);
      if (resultado && antigo) await apagarImagem(antigo.imagem);
      res.json({ sucesso: Boolean(resultado), excluidos: resultado });
    } catch (erro) { responderErro(res, erro); }
  }
}

module.exports = new ProdutoController();