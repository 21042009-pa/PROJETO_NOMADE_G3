const categoriaRepository = require("../repositories/CategoriaRepository");

async function criarCategoria(nome_categoria) {
  const dadosDaCategoria = {
    nome_categoria: nome_categoria,
  };

  const categoria =
    await categoriaRepository.cadastrarCategoria(dadosDaCategoria);

  return categoria;
}

async function listarCategorias() {
  const categorias = await categoriaRepository.listarCategorias();

  return categorias;
}

async function buscarCategoria(id) {
  const categoria = await categoriaRepository.buscarCategoriaId(id);

  return categoria;
}

async function atualizarCategoria(id, nome_categoria) {
  const dadosDaCategoria = {
    nome_categoria: nome_categoria,
  };

  const categoria = await categoriaRepository.atualizarCategoria(
    id,
    dadosDaCategoria,
  );

  return categoria;
}

async function excluirCategoria(id) {
  try {
    const excluidos = await categoriaRepository.apagarCategoria(id);
    if (!excluidos) {
      const erro = new Error("Categoria não encontrado para exclusão.");
      erro.status = 404;
      throw erro;
    }
    return { sucesso: true, mensagem: "Categoria excluído com sucesso." };
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.errno === 1451) {
      const conflito = new Error("Não é possível excluir este categoria: ele está vinculado a um produto ou outro registro. Remova o vínculo antes.");
      conflito.status = 409;
      throw conflito;
    }
    throw erro;
  }
}

module.exports = {
  criarCategoria,
  listarCategorias,
  buscarCategoria,
  atualizarCategoria,
  excluirCategoria,
};