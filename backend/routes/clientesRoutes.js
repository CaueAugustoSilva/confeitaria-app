const express = require("express");
const router = express.Router();
const db = require("../db");

//Listar Clientes
router.get("/", (req, res) => {
  const sql = "SELECT * FROM clientes ORDER BY id_cliente DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao listar clientes:", err);

      return res.status(500).json({
        erro: "Erro ao listar clientes.",
        detalhe: err.message,
        codigo: err.code,
      });
    }

    res.json(results);
  });
});

//Cadastrar Clientes
router.post("/", (req, res) => {
  const { nome, telefone, email, endereco } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: "O nome do cliente é obrigatório." });
    // erro 400: Bad Request
  }

  const sql = `
        INSERT INTO clientes (nome, telefone, email, endereco)
        VALUES (?,?,?,?)
    `;

  db.query(sql, [nome, telefone, email, endereco], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao cadastrar o cliente." });
    }

    res.status(201).json({
      // cod 201: Created
      mensagem: "Cliente cadastrado com sucesso.",
      id_cliente: result.insertId,
    });
  });
});

//Editar cliente
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email, endereco } = req.body;

  const sql = `
    UPDATE clientes
    SET nome = ?, telefone = ?, email = ?, endereco = ?
    WHERE id_cliente = ? 
    `;
  db.query(sql, [nome, telefone, endereco, email, id], (err) => {
    if (err) {
      return res.json({ erro: "Erro ao editar cliente." });
    }

    res.json({ mensgem: "Cliente atualizado com sucesso." });
  });
});

//Excluir cliente
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM clientes WHERE id_cliente = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        erro: "Erro ao excluir o cliente. Verifique se ele possui pedidos cadastrados",
      });
    }
    json.res({ mensagem: "Cliente excliído com sucesso." });
  });
});

module.exports = router;

// cod 200: OK(Sucesso)
// cod 204: No Content (Sucesso sem retornar conteúdo)
// cod 401: Unauthorized (não autenticado)
// cod 403: Forbidden (sem permissao)
// cod 404: Not found (não encontrado)
