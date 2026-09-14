CREATE DATABASE IF NOT EXISTS db_nomades_g3;
USE db_nomades_g3;

CREATE TABLE tbl_fornecedor (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    contato VARCHAR(50),
    endereco VARCHAR(200)
);

CREATE TABLE tbl_categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nome_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_subcategoria (
    id_subcategoria INT PRIMARY KEY AUTO_INCREMENT,
    id_categoria INT NOT NULL,
    nome_subcategoria VARCHAR(100) NOT NULL,

    CONSTRAINT FK_id_categoria_tbl_subcategoria
        FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id_categoria)
);

CREATE TABLE tbl_produto (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    id_fornecedor INT NOT NULL,
    id_categoria INT NOT NULL,
    id_subcategoria INT NOT NULL,
    descricao TEXT,
    modelo VARCHAR(50),
    nome VARCHAR(100),
    data_validade DATE,
    codigo_produto VARCHAR(100),
    cor VARCHAR(50),

    CONSTRAINT FK_id_fornecedor_tbl_produto
        FOREIGN KEY (id_fornecedor) REFERENCES tbl_fornecedor(id_fornecedor),

    CONSTRAINT FK_id_categoria_tbl_produto
        FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id_categoria),

    CONSTRAINT FK_id_subcategoria_tbl_produto
        FOREIGN KEY (id_subcategoria) REFERENCES tbl_subcategoria(id_subcategoria)
);

CREATE TABLE tbl_lote (
    id_lote INT PRIMARY KEY AUTO_INCREMENT,
    codigo_lote VARCHAR(50),
    quantidade_atual INT,
    id_produto INT NOT NULL,
    validade DATE,

    CONSTRAINT FK_id_produto_tbl_lote
        FOREIGN KEY (id_produto) REFERENCES tbl_produto(id_produto)
);

CREATE TABLE tbl_movimentacao_estoque (
    id_movimentacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('Entrada', 'Saída') NOT NULL,
    data_movimentacao DATE NOT NULL,
    quantidade INT NOT NULL,
    observacao TEXT
);

CREATE TABLE tbl_usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    setor VARCHAR(100)
);