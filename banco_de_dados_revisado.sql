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

CREATE TABLE tbl_produto (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    id_fornecedor INT NOT NULL,
    id_categoria INT NOT NULL,
    descricao TEXT,
    modelo VARCHAR(50),
    nome VARCHAR(100),
    data_validade DATE,
    codigo_produto VARCHAR(100),
    cor VARCHAR(50),

    CONSTRAINT FK_id_fornecedor_tbl_produto
        FOREIGN KEY (id_fornecedor) REFERENCES tbl_fornecedor(id_fornecedor),

    CONSTRAINT FK_id_categoria_tbl_produto
        FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id_categoria)
);

CREATE TABLE tbl_lote (
    id_lote INT PRIMARY KEY AUTO_INCREMENT,
    codigo_lote VARCHAR(50),
    quantidade_atual INT,
    validade DATE
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

ALTER TABLE PRODUTO ADD column categoria VARCHAR(100);

select * from produto;

drop table subcategoria;

alter table produto drop foreign key id_subcategoria;

alter table lote drop foreign key FK_id_produto_tbl_lote;

alter table lote drop column id_produto;

SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'lote' AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND TABLE_SCHEMA = DATABASE();

show tables;

select * from lote;

ALTER TABLE produto ADD COLUMN id_lote INT NOT NULL;

ALTER TABLE produto 
ADD CONSTRAINT fk_id_lote
FOREIGN KEY (id_lote) 
REFERENCES lote (id_lote);

 alter table produto add column imagem varchar (255);
 
 ALTER TABLE movimentacao_estoque ADD COLUMN id_produto INT NOT NULL;
 
 ALTER TABLE movimentacao_estoque
ADD CONSTRAINT fk_id_produto
FOREIGN KEY (id_produto) 
REFERENCES produto (id_produto);
 
 select * from produto