CREATE DATABASE IF NOT EXISTS db_nomades_g3;

USE db_nomades_g3;

-- =========================================
-- FORNECEDOR
-- =========================================
CREATE TABLE
    IF NOT EXISTS tbl_fornecedor (
        id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(100) NOT NULL,
        contato VARCHAR(50),
        endereco VARCHAR(200)
    );

-- =========================================
-- CATEGORIA
-- =========================================
CREATE TABLE
    IF NOT EXISTS tbl_categoria (
        id_categoria INT PRIMARY KEY AUTO_INCREMENT,
        nome_categoria VARCHAR(100) NOT NULL
    );

-- =========================================
-- USUÁRIO
-- =========================================
CREATE TABLE
    IF NOT EXISTS tbl_usuario (
        id_usuario INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(100) NOT NULL,
        login VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        cargo VARCHAR(100),
        setor VARCHAR(100)
    );

-- =========================================
-- PRODUTO
-- =========================================
CREATE TABLE
    IF NOT EXISTS tbl_produto (
        id_produto INT PRIMARY KEY AUTO_INCREMENT,
        id_fornecedor INT NOT NULL,
        id_categoria INT NOT NULL,
        descricao TEXT,
        modelo VARCHAR(50),
        nome VARCHAR(100),
        codigo_produto VARCHAR(100),
        cor VARCHAR(50),
        imagem VARCHAR(255),
        CONSTRAINT FK_id_fornecedor_tbl_produto FOREIGN KEY (id_fornecedor) REFERENCES tbl_fornecedor (id_fornecedor),
        CONSTRAINT FK_id_categoria_tbl_produto FOREIGN KEY (id_categoria) REFERENCES tbl_categoria (id_categoria)
    );

-- =========================================
-- LOTE
-- =========================================
CREATE TABLE
    IF NOT EXISTS tbl_lote (
        id_lote INT PRIMARY KEY AUTO_INCREMENT,
        id_produto INT NOT NULL,
        codigo_lote VARCHAR(50),
        validade DATE,
        CONSTRAINT FK_id_produto_tbl_lote FOREIGN KEY (id_produto) REFERENCES tbl_produto (id_produto)
    );

-- =========================================
-- MOVIMENTAÇÃO DE ESTOQUE
-- =========================================
CREATE TABLE
    IF NOT EXISTS tbl_movimentacao_estoque (
        id_movimentacao INT PRIMARY KEY AUTO_INCREMENT,
        id_produto INT NOT NULL,
        id_lote INT,
        id_usuario INT,
        tipo ENUM (
            'ENTRADA',
            'SAIDA',
            'AJUSTE_ENTRADA',
            'AJUSTE_SAIDA'
        ) NOT NULL,
        data_movimentacao DATE NOT NULL,
        quantidade INT NOT NULL,
        observacao TEXT,
        CONSTRAINT FK_id_produto_tbl_movimentacao FOREIGN KEY (id_produto) REFERENCES tbl_produto (id_produto),
        CONSTRAINT FK_id_lote_tbl_movimentacao FOREIGN KEY (id_lote) REFERENCES tbl_lote (id_lote),
        CONSTRAINT FK_id_usuario_tbl_movimentacao FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario)
    );