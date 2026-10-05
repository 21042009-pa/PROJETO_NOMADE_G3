const categoriaRepository = require("../repositories/CategoriaRepository");

class CategoriaService {
  async criarCategoria(nome_categoria) {
  const dadosDaCategoria = {
    nome_categoria: nome_categoria,
  };

  const categoria =
    await categoriaRepository.cadastrarCategoria(dadosDaCategoria);

  return categoria;
}

async listarCategorias() {
  const categorias = await categoriaRepository.listarCategorias();

  return categorias;
}

async buscarCategoria(id) {
  const categoria = await categoriaRepository.buscarCategoriaId(id);

  return categoria;
}

async atualizarCategoria(id, nome_categoria) {
  const dadosDaCategoria = {
    nome_categoria: nome_categoria,
  };

  const categoria = await categoriaRepository.atualizarCategoria(
    id,
    dadosDaCategoria,
  );

  return categoria;
}

async deletarCategoria(id) {
  const categoria = await categoriaRepository.apagarCategoria(id);

  return categoria;
}
}

module.exports = new CategoriaService()
