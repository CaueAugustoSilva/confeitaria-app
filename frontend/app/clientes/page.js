"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
  });

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

    fetch("http://localhost:3001/clientes")
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (componenteAtivo) {
          if (Array.isArray(dados)) {
            setClientes(dados);
          } else {
            setClientes([]);
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);

        if (componenteAtivo) {
          setClientes([]);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, []);

  async function salvarCliente(e) {
    e.preventDefault();

    try {
      if (clienteEditando) {
        const resposta = await fetch(
          `http://localhost:3001/clientes/${clienteEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          },
        );

        if (!resposta.ok) {
          throw new Error("Erro ao editar cliente.");
        }

        alert("Cliente atualizado com sucesso.");
      } else {
        const resposta = await fetch("http://localhost:3001/clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!resposta.ok) {
          throw new Error("Erro ao cadastrar cliente.");
        }

        alert("Cliente cadastrado com sucesso.");
      }

      limparFormulario();
      carregarClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Não foi possível salvar o cliente.");
    }
  }

  function editarCliente(cliente) {
    setClienteEditando(cliente.id_cliente);

    setForm({
      nome: cliente.nome || "",
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      endereco: cliente.endereco || "",
    });
  }

  async function excluirCliente(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este cliente?");

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir cliente.");
      }

      alert("Cliente excluído com sucesso.");

      carregarClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert(
        "Não foi possível excluir o cliente. Verifique se ele possui pedidos cadastrados.",
      );
    }
  }

  function limparFormulario() {
    setClienteEditando(null);

    setForm({
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
    });
  }

  function executarAcaoCliente(acao, cliente) {
    if (acao === "editar") {
      editarCliente(cliente);
    }

    if (acao === "excluir") {
      excluirCliente(cliente.id_cliente);
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-pink-700 font-semibold">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-bold text-pink-700 mt-4 mb-6">Clientes</h1>

        <form
          onSubmit={salvarCliente}
          className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="border p-3 rounded-lg"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Endereço"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />

          <button
            type="submit"
            className="md:col-span-2 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
          >
            {clienteEditando ? "Salvar alterações" : "Cadastrar Cliente"}
          </button>

          {clienteEditando && (
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
            <thead className="bg-pink-100">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Endereço</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(clientes) && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.id_cliente} className="border-t">
                    <td className="p-3">{cliente.nome}</td>
                    <td className="p-3">{cliente.telefone}</td>
                    <td className="p-3">{cliente.email}</td>
                    <td className="p-3">{cliente.endereco}</td>
                    <td className="p-3">
                      <select
                        value=""
                        onChange={(e) =>
                          executarAcaoCliente(e.target.value, cliente)
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
                  <td className="p-3 text-gray-500" colSpan="5">
                    Nenhum cliente cadastrado.
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
