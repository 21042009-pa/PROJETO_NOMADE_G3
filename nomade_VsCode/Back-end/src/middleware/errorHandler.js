function errorHandler(erro, req, res, next) {
  console.error(erro);

  const status = erro.status || 500;

  res.status(status).json({
    erro: status >= 500
      ? "Erro interno do servidor."
      : erro.message
  });
}

module.exports = errorHandler;
