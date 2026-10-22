function inteiroPositivo(valor, campo) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    const erro = new Error(`${campo} deve ser um inteiro positivo.`);
    erro.status = 400;
    erro.mensagem = erro.message;
    throw erro;
  }

  return numero;
}

function textoObrigatorio(valor, campo) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    const erro = new Error(`${campo} é obrigatório.`);
    erro.status = 400;
    erro.mensagem = erro.message;
    throw erro;
  }

  return texto;
}

function tipoMovimentacao(tipo) {
  if (!["Entrada", "Saída"].includes(tipo)) {
    const erro = new Error("Tipo de movimentação inválido.");
    erro.status = 400;
    erro.mensagem = erro.message;
    throw erro;
  }

  return tipo;
}

module.exports = {
  inteiroPositivo,
  textoObrigatorio,
  tipoMovimentacao,
};