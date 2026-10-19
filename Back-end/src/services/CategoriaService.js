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
  const categoria = await categoriaRepository.apagarCategoria(id);

  return categoria;
}

module.exports = {
  criarCategoria,
  listarCategorias,
  buscarCategoria,
  atualizarCategoria,
  excluirCategoria,
};
