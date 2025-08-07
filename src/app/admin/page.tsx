"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/app/utils/api";
import { useRouter } from "next/navigation";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("/auterota/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.success && res.usuario && res.usuario.isAdmin) {
        localStorage.setItem("user", JSON.stringify(res.usuario));
        localStorage.setItem("token", res.token);
        onSuccess();
      } else {
        setError("Acesso negado. Apenas administradores podem entrar.");
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login Admin</h2>
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

import AdminAgendamentosPanel from "../components/AdminAgendamentosPanel";

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setAutenticado(!!user.isAdmin);
      }
      setChecked(true);
    }
  }, []);

  if (!checked) return null;
  return autenticado ? (
    <>
      <div className="flex justify-end p-8">
        <button
          className="bg-yellow-500 text-black px-4 py-2 rounded shadow hover:bg-yellow-600 font-bold"
          onClick={() => router.push("/admin/criar-admin")}
        >
          Criar Novo Admin
        </button>
      </div>
      <AdminAgendamentosPanel />
    </>
  ) : (
    <AdminLogin onSuccess={() => setAutenticado(true)} />
  );
}
