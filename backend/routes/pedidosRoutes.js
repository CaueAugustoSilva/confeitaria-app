const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar pedidos com nome do cliente
router.get("/", (req, res) => {
  const sql = `
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
    ORDER BY p.id_pedido DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao listar pedidos:", err);

      return res.status(500).json({
        erro: "Erro ao listar pedidos.",
        detalhe: err.message,
        codigo: err.code,
      });
    }

    res.json(results);
  });
});

// Cadastrar pedidos
router.post("/", (req, res) => {
  const {
    id_cliente,
    descricao,
    sabor,
    tamanho,
    quantidade,
    valor,
    data_entrega,
    status_pedido,
  } = req.body;

  if (!id_cliente || !descricao) {
    return res.status(400).json({
      erro: "Cliente e descrição do pedido são obrigatórios.",
    });
  }

  const sql = `
        INSERT INTO pedidos
        (id_cliente, descricao, sabor, tamanho, quantidade, valor, data_entrega, status_pedido)
        VALUES (?,?,?,?,?,?,?,?)
    `;

  db.query(
    sql,
    [
      id_cliente,
      descricao,
      sabor,
      tamanho,
      quantidade,
      valor,
      data_entrega,
      status_pedido,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao cadastrar pedido." });
      }

      res.status(201).json({
        mensagem: "Pedidos cadastrado com sucesso",
        id_pedido: result.insertId,
      });
    },
  );
});

// Editar pedido
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    id_cliente,
    descricao,
    sabor,
    tamanho,
    quantidade,
    valor,
    data_entrega,
    status_pedido,
  } = req.body;

  const sql = `
    UPDATE pedidos
    SET 
      id_cliente = ?, 
      descricao = ?, 
      sabor = ?, 
      tamanho = ?, 
      quantidade = ?, 
      valor = ?, 
      data_entrega = ?, 
      status_pedido = ?
    WHERE id_pedido = ?
  `;

  db.query(
    sql,
    [
      id_cliente,
      descricao,
      sabor,
      tamanho,
      quantidade,
      valor,
      data_entrega,
      status_pedido,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao editar pedido." });
      }

      res.json({ mensagem: "Pedido atualizado com sucesso." });
    },
  );
});

// Excluir pedido
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pedidos WHERE id_pedido = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao excluir pedido." });
    }

    res.json({ mensagem: "Pedido excluído com sucesso." });
  });
});

module.exports = router;
