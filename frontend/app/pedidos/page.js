"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    id_cliente: "",
    descricao: "",
    sabor: "",
    tamanho: "",
    quantidade: 1,
    valor: "",
    data_entrega: "",
    status_pedido: "Pendente",
  });

  async function carregarPedidos() {
    try {
      const resposta = await fetch("http://localhost:3001/pedidos");

      if (!resposta.ok) {
        throw new Error("Erro na resposta da API de pedidos.");
      }

      const dados = await resposta.json();

      console.log("Pedidos recebidos:", dados);

      if (Array.isArray(dados)) {
        setPedidos(dados);
      } else {
        console.error("A API não retornou uma lista de pedidos:", dados);
        setPedidos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setPedidos([]);
    }
  }

  async function carregarClientes() {
    try {
      const resposta = await fetch("http://localhost:3001/clientes");

      if (!resposta.ok) {
        throw new Error("Erro na resposta da API de clientes.");
      }

      const dados = await resposta.json();

      console.log("Clientes recebidos:", dados);

      if (Array.isArray(dados)) {
        setClientes(dados);
      } else {
        console.error("A API não retornou uma lista de clientes:", dados);
        setClientes([]);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setClientes([]);
    }
  }

  useEffect(() => {
    let componenteAtivo = true;

    Promise.all([
      fetch("http://localhost:3001/pedidos").then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro na resposta da API de pedidos.");
        }

        return resposta.json();
      }),

      fetch("http://localhost:3001/clientes").then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro na resposta da API de clientes.");
        }

        return resposta.json();
      }),
    ])
      .then(([dadosPedidos, dadosClientes]) => {
        console.log("Pedidos recebidos no useEffect:", dadosPedidos);
        console.log("Clientes recebidos no useEffect:", dadosClientes);

        if (componenteAtivo) {
          if (Array.isArray(dadosPedidos)) {
            setPedidos(dadosPedidos);
          } else {
            console.error(
              "A API não retornou uma lista de pedidos:",
              dadosPedidos,
            );
            setPedidos([]);
          }

          if (Array.isArray(dadosClientes)) {
            setClientes(dadosClientes);
          } else {
            console.error(
              "A API não retornou uma lista de clientes:",
              dadosClientes,
            );
            setClientes([]);
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar dados no useEffect:", error);

        if (componenteAtivo) {
          setPedidos([]);
          setClientes([]);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, []);

  async function cadastrarPedido(e) {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:3001/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar pedido.");
      }

      setForm({
        id_cliente: "",
        descricao: "",
        sabor: "",
        tamanho: "",
        quantidade: 1,
        valor: "",
        data_entrega: "",
        status_pedido: "Pendente",
      });

      carregarPedidos();
      carregarClientes();
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
    }
  }

  async function excluirPedido(id) {
    try {
      const resposta = await fetch(`http://localhost:3001/pedidos/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir pedido.");
      }

      carregarPedidos();
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      alert("Não foi possível excluir o pedido.");
    }
  }

  return (
    <main className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-purple-700 font-semibold">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-bold text-purple-700 mt-4 mb-6">
          Pedidos
        </h1>

        <form
          onSubmit={cadastrarPedido}
          className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <select
            className="border p-3 rounded-lg"
            value={form.id_cliente}
            onChange={(e) => setForm({ ...form, id_cliente: e.target.value })}
            required
          >
            <option value="">Selecione o cliente</option>

            {Array.isArray(clientes) &&
              clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nome}
                </option>
              ))}
          </select>

          <input
            className="border p-3 rounded-lg"
            placeholder="Descrição do pedido"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            required
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Sabor"
            value={form.sabor}
            onChange={(e) => setForm({ ...form, sabor: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Tamanho"
            value={form.tamanho}
            onChange={(e) => setForm({ ...form, tamanho: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            type="number"
            min="1"
            placeholder="Quantidade"
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            type="number"
            step="0.01"
            min="0"
            placeholder="Valor"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            type="date"
            value={form.data_entrega}
            onChange={(e) => setForm({ ...form, data_entrega: e.target.value })}
          />

          <select
            className="border p-3 rounded-lg"
            value={form.status_pedido}
            onChange={(e) =>
              setForm({ ...form, status_pedido: e.target.value })
            }
          >
            <option value="Pendente">Pendente</option>
            <option value="Em produção">Em produção</option>
            <option value="Pronto">Pronto</option>
            <option value="Entregue">Entregue</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Cadastrar Pedido
          </button>
        </form>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-purple-100">
              <tr>
                <th className="p-3">Cliente</th>
                <th className="p-3">Descrição</th>
                <th className="p-3">Sabor</th>
                <th className="p-3">Tamanho</th>
                <th className="p-3">Qtd.</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(pedidos) && pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                  <tr key={pedido.id_pedido} className="border-t">
                    <td className="p-3">{pedido.nome_cliente}</td>
                    <td className="p-3">{pedido.descricao}</td>
                    <td className="p-3">{pedido.sabor}</td>
                    <td className="p-3">{pedido.tamanho}</td>
                    <td className="p-3">{pedido.quantidade}</td>
                    <td className="p-3">R$ {pedido.valor}</td>
                    <td className="p-3">{pedido.status_pedido}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => excluirPedido(pedido.id_pedido)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-gray-500" colSpan="8">
                    Nenhum pedido cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
