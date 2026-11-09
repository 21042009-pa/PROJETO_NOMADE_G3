CREATE DATABASE IF NOT EXISTS db_nomades_g3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_nomades_g3;

CREATE TABLE IF NOT EXISTS tbl_usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  login VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) DEFAULT 'Operador',
  setor VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS tbl_categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_fornecedor (
  id_fornecedor INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  contato VARCHAR(100),
  endereco VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS tbl_lote (
  id_lote INT AUTO_INCREMENT PRIMARY KEY,
  codigo_lote VARCHAR(50) NOT NULL,
  quantidade_atual INT NOT NULL DEFAULT 0,
  validade DATE
);

CREATE TABLE IF NOT EXISTS tbl_produto (
  id_produto INT AUTO_INCREMENT PRIMARY KEY,
  id_fornecedor INT,
  id_categoria INT,
  id_lote INT,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  modelo VARCHAR(100),
  data_validade DATE,
  codigo_produto VARCHAR(50),
  cor VARCHAR(50),
  imagem VARCHAR(255),
  FOREIGN KEY (id_fornecedor) REFERENCES tbl_fornecedor(id_fornecedor),
  FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id_categoria),
  FOREIGN KEY (id_lote) REFERENCES tbl_lote(id_lote)
);

CREATE TABLE IF NOT EXISTS tbl_movimentacao_estoque (
  id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
  id_produto INT NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  data_movimentacao DATE NOT NULL,
  quantidade INT NOT NULL,
  observacao VARCHAR(255),
  FOREIGN KEY (id_produto) REFERENCES tbl_produto(id_produto)
);
