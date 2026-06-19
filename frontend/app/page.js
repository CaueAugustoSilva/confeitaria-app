import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-pink-700 mb-4">
          Sistema de Confeitaria
        </h1>

        <p className="text-gray-600 mb-8">
          Controle simples de clientes e pedidos para confeitaria.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/clientes"
            className="bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
          >
            Gerenciar Clientes
          </Link>

          <Link
            href="/pedidos"
            className="bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Gerenciar Pedidos
          </Link>
        </div>
      </div>
    </main>
  );
}
