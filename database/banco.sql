-- ============================================================
-- BANCO DE DADOS: confeitaria_db
-- PROJETO: Sistema de Confeitaria
-- DESCRIÇÃO:
-- Script de criação do banco de dados utilizado na aplicação.
-- O sistema possui duas tabelas principais:
-- 1. clientes
-- 2. pedidos
--
-- A tabela pedidos possui uma chave estrangeira para clientes.
-- ============================================================

DROP DATABASE IF EXISTS confeitaria_db;

CREATE DATABASE confeitaria_db;

USE confeitaria_db;

-- ============================================================
-- TABELA: clientes
-- Guarda os dados dos clientes da confeitaria.
-- ============================================================

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(200)
);

-- ============================================================
-- TABELA: pedidos
-- Guarda os pedidos realizados pelos clientes.
-- Cada pedido pertence a um cliente.
-- ============================================================

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    sabor VARCHAR(100),
    tamanho VARCHAR(50),
    quantidade INT DEFAULT 1,
    valor DECIMAL(10,2),
    data_entrega DATE,
    status_pedido VARCHAR(50) DEFAULT 'Pendente',

    CONSTRAINT fk_pedidos_clientes
    FOREIGN KEY (id_cliente)
    REFERENCES clientes(id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- ============================================================
-- DADOS DE TESTE
-- Esses registros servem apenas para testar a aplicação.
-- ============================================================

INSERT INTO clientes (nome, telefone, email, endereco)
VALUES 
('Maria Souza', '2199999-9999', 'maria@email.com', 'Rua das Flores, 100'),
('João Lima', '2198888-8888', 'joao@email.com', 'Rua dos Bolos, 200');

INSERT INTO pedidos 
(id_cliente, descricao, sabor, tamanho, quantidade, valor, data_entrega, status_pedido)
VALUES
(1, 'Bolo de aniversário', 'Chocolate com brigadeiro', '2 kg', 1, 150.00, '2026-06-25', 'Pendente'),
(2, 'Caixa de doces', 'Brigadeiro e beijinho', '50 unidades', 1, 90.00, '2026-06-28', 'Em produção');

-- ============================================================
-- CONSULTAS DE TESTE
-- ============================================================

SELECT * FROM clientes;

SELECT 
    p.id_pedido,
    p.id_cliente,
    c.nome AS nome_cliente,
    p.descricao,
    p.sabor,
    p.tamanho,
    p.quantidade,
    p.valor,
    p.data_entrega,
    p.status_pedido
FROM pedidos p
INNER JOIN clientes c
ON p.id_cliente = c.id_cliente
ORDER BY p.id_pedido DESC;