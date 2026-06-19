"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
  });

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

    fetch("http://localhost:3001/clientes")
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro na resposta da API de clientes.");
        }

        return resposta.json();
      })
      .then((dados) => {
        console.log("Clientes recebidos no useEffect:", dados);

        if (componenteAtivo) {
          if (Array.isArray(dados)) {
            setClientes(dados);
          } else {
            console.error("A API não retornou uma lista de clientes:", dados);
            setClientes([]);
          }
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes no useEffect:", error);

        if (componenteAtivo) {
          setClientes([]);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, []);

  async function cadastrarCliente(e) {
    e.preventDefault();

    try {
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

      setForm({
        nome: "",
        telefone: "",
        email: "",
        endereco: "",
      });

      carregarClientes();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    }
  }

  async function excluirCliente(id) {
    try {
      const resposta = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir cliente.");
      }

      carregarClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert(
        "Não foi possível excluir o cliente. Verifique se ele possui pedidos cadastrados.",
      );
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
          onSubmit={cadastrarCliente}
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
            Cadastrar Cliente
          </button>
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
                      <button
                        type="button"
                        onClick={() => excluirCliente(cliente.id_cliente)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
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
