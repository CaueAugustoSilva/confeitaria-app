"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidoEditando, setPedidoEditando] = useState(null);

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
      const dados = await resposta.json();

      if (Array.isArray(dados)) {
        setPedidos(dados);
      } else {
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
      const dados = await resposta.json();

      if (Array.isArray(dados)) {
        setClientes(dados);
      } else {
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
      fetch("http://localhost:3001/pedidos").then((resposta) =>
        resposta.json(),
      ),
      fetch("http://localhost:3001/clientes").then((resposta) =>
        resposta.json(),
      ),
    ])
      .then(([dadosPedidos, dadosClientes]) => {
        if (componenteAtivo) {
          if (Array.isArray(dadosPedidos)) {
            setPedidos(dadosPedidos);
          } else {
            setPedidos([]);
          }

          if (Array.isArray(dadosClientes)) {
            setClientes(dadosClientes);
          } else {
            setClientes([]);
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar dados:", error);

        if (componenteAtivo) {
          setPedidos([]);
          setClientes([]);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, []);

  async function salvarPedido(e) {
    e.preventDefault();

    try {
      if (pedidoEditando) {
        const resposta = await fetch(
          `http://localhost:3001/pedidos/${pedidoEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          },
        );

        if (!resposta.ok) {
          throw new Error("Erro ao editar pedido.");
        }

        alert("Pedido atualizado com sucesso.");
      } else {
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

        alert("Pedido cadastrado com sucesso.");
      }

      limparFormulario();
      carregarPedidos();
      carregarClientes();
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert("Não foi possível salvar o pedido.");
    }
  }

  function formatarDataParaInput(data) {
    if (!data) {
      return "";
    }

    return data.split("T")[0];
  }

  function editarPedido(pedido) {
    setPedidoEditando(pedido.id_pedido);

    setForm({
      id_cliente: pedido.id_cliente || "",
      descricao: pedido.descricao || "",
      sabor: pedido.sabor || "",
      tamanho: pedido.tamanho || "",
      quantidade: pedido.quantidade || 1,
      valor: pedido.valor || "",
      data_entrega: formatarDataParaInput(pedido.data_entrega),
      status_pedido: pedido.status_pedido || "Pendente",
    });
  }

  async function excluirPedido(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este pedido?");

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3001/pedidos/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir pedido.");
      }

      alert("Pedido excluído com sucesso.");

      carregarPedidos();
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      alert("Não foi possível excluir o pedido.");
    }
  }

  function limparFormulario() {
    setPedidoEditando(null);

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
  }

  function executarAcaoPedido(acao, pedido) {
    if (acao === "editar") {
      editarPedido(pedido);
    }

    if (acao === "excluir") {
      excluirPedido(pedido.id_pedido);
    }
  }

  function formatarValor(valor) {
    if (!valor) {
      return "R$ 0,00";
    }

    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
          onSubmit={salvarPedido}
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
            {pedidoEditando ? "Salvar alterações" : "Cadastrar Pedido"}
          </button>

          {pedidoEditando && (
            <button
              type="button"
              onClick={limparFormulario}
              className="md:col-span-2 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
            >
              Cancelar edição
            </button>
          )}
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
                    <td className="p-3">{formatarValor(pedido.valor)}</td>
                    <td className="p-3">{pedido.status_pedido}</td>
                    <td className="p-3">
                      <select
                        value=""
                        onChange={(e) =>
                          executarAcaoPedido(e.target.value, pedido)
                        }
                        className="border rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="" disabled>
                          Ações
                        </option>
                        <option value="editar">Editar</option>
                        <option value="excluir">Excluir</option>
                      </select>
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
