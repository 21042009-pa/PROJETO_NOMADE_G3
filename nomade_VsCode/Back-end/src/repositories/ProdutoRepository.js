const pool = require("../config/database");

function nomeObrigatorio(valor, descricao, limite) {
  const texto = typeof valor === "string" ? valor.trim().replace(/\s+/g, " ") : "";
  if (!texto) {
    const erro = new Error(`Informe ${descricao}.`);
    erro.status = 400;
    throw erro;
  }
  if (texto.length > limite) {
    const erro = new Error(`${descricao} deve ter até ${limite} caracteres.`);
    erro.status = 400;
    throw erro;
  }
  return texto;
}

function identificador(valor, descricao) {
  if (valor === undefined || valor === null || valor === "") return null;
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero) || numero <= 0) {
    const erro = new Error(`Identificador inválido para ${descricao}.`);
    erro.status = 400;
    throw erro;
  }
  return numero;
}

async function localizarOuCriar(conn, { id, texto, tabela, chave, coluna, descricao, limite }) {
  const idExistente = identificador(id, descricao);
  if (idExistente !== null) {
    const [linhas] = await conn.query(
      `SELECT ${chave} FROM ${tabela} WHERE ${chave} = ?`,
      [idExistente],
    );
    if (!linhas.length) {
      const erro = new Error(`${descricao} selecionado não existe mais. Atualize a página.`);
      erro.status = 400;
      throw erro;
    }
    return { id: idExistente, novo: false };
  }

  const nome = nomeObrigatorio(texto, descricao.toLowerCase(), limite);
  const [encontrados] = await conn.query(
    `SELECT ${chave} FROM ${tabela} WHERE LOWER(TRIM(${coluna})) = LOWER(?) ORDER BY ${chave} LIMIT 1`,
    [nome],
  );
  if (encontrados.length) return { id: encontrados[0][chave], novo: false };

  const [resultado] = await conn.query(
    `INSERT INTO ${tabela} (${coluna}) VALUES (?)`,
    [nome],
  );
  return { id: resultado.insertId, novo: true };
}

class ProdutoRepository {
  async listarProdutos() {
    const [listaProdutos] = await pool.query("SELECT * FROM tbl_produto");
    return listaProdutos;
  }

  async buscarProdutoId(id) {
    const [mostrarProduto] = await pool.query(
      "SELECT * FROM tbl_produto WHERE id_produto = ?",
      [id],
    );
    return mostrarProduto[0];
  }

  // Cria fornecedor, categoria e lote (quando necessários), e o produto,
  // na MESMA transação: um erro não deixa cadastros incompletos no banco.
  async cadastrarProdutoComRelacionamentos(dados) {
    const nome = nomeObrigatorio(dados.nome, "o nome do produto", 100);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const fornecedor = await localizarOuCriar(conn, {
        id: dados.id_fornecedor,
        texto: dados.nome_fornecedor,
        tabela: "tbl_fornecedor",
        chave: "id_fornecedor",
        coluna: "nome",
        descricao: "Fornecedor",
        limite: 100,
      });
      const categoria = await localizarOuCriar(conn, {
        id: dados.id_categoria,
        texto: dados.nome_categoria,
        tabela: "tbl_categoria",
        chave: "id_categoria",
        coluna: "nome_categoria",
        descricao: "Categoria",
        limite: 100,
      });

      let idLote = identificador(dados.id_lote, "lote");
      if (idLote !== null) {
        const [encontrados] = await conn.query(
          "SELECT id_lote FROM tbl_lote WHERE id_lote = ?",
          [idLote],
        );
        if (!encontrados.length) {
          const erro = new Error("O lote selecionado não existe mais. Atualize a página.");
          erro.status = 400;
          throw erro;
        }
      } else if (dados.codigo_lote !== undefined && dados.codigo_lote !== null && String(dados.codigo_lote).trim()) {
        const codigo = nomeObrigatorio(dados.codigo_lote, "o código do lote", 50);
        const [lotes] = await conn.query(
          "SELECT id_lote FROM tbl_lote WHERE LOWER(TRIM(codigo_lote)) = LOWER(?) ORDER BY id_lote LIMIT 1",
          [codigo],
        );
        if (lotes.length) {
          idLote = lotes[0].id_lote;
        } else {
          const quantidade = dados.quantidade_atual === "" || dados.quantidade_atual == null
            ? 0 : Number(dados.quantidade_atual);
          if (!Number.isSafeInteger(quantidade) || quantidade < 0) {
            const erro = new Error("A quantidade inicial do lote deve ser um inteiro não negativo.");
            erro.status = 400;
            throw erro;
          }
          const [resultado] = await conn.query(
            "INSERT INTO tbl_lote (codigo_lote, quantidade_atual, validade) VALUES (?, ?, ?)",
            [codigo, quantidade, dados.validade_lote || dados.data_validade || null],
          );
          idLote = resultado.insertId;
        }
      }

      const [resultado] = await conn.query("INSERT INTO tbl_produto SET ?", [{
        id_fornecedor: fornecedor.id,
        id_categoria: categoria.id,
        id_lote: idLote,
        nome,
        descricao: dados.descricao || null,
        modelo: dados.modelo || null,
        data_validade: dados.data_validade || null,
        codigo_produto: dados.codigo_produto || null,
        cor: dados.cor || null,
        imagem: dados.imagem || null,
      }]);
      await conn.commit();
      return resultado.insertId;
    } catch (erro) {
      await conn.rollback();
      throw erro;
    } finally {
      conn.release();
    }
  }

  // Mantido para quem utilizar o repositório diretamente com IDs já existentes.
  async cadastrarProduto(dadosDoProduto) {
    const [resultadoProduto] = await pool.query(
      "INSERT INTO tbl_produto SET ?",
      [dadosDoProduto],
    );
    return resultadoProduto.insertId;
  }

  async atualizarProduto(id, dadosDoProduto) {
    const camposProduto = [];
    const valoresProduto = [];
    for (const [key, value] of Object.entries(dadosDoProduto)) {
      camposProduto.push(`${key} = ?`);
      valoresProduto.push(value);
    }
    if (!camposProduto.length) return null;
    valoresProduto.push(id);
    const [resultadoProduto] = await pool.query(
      `UPDATE tbl_produto SET ${camposProduto.join(", ")} WHERE id_produto = ?`,
      valoresProduto,
    );
    return resultadoProduto.affectedRows;
  }

  async apagarProduto(id) {
    const [resultado] = await pool.query(
      "DELETE FROM tbl_produto WHERE id_produto = ?",
      [id],
    );
    return resultado.affectedRows;
  }
}

module.exports = new ProdutoRepository();