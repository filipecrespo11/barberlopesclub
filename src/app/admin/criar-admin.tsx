"use client";
import { useState } from "react";
import { AuthService } from "@/services";
import bcrypt from "bcryptjs";

export default function CriarAdminPage() {
  const [form, setForm] = useState({ nome: "", email: "", password: "", tel: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Verifica token presente e não expirado
      const rawToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('authToken') || '') : '';
      const isExpired = (() => {
        if (!rawToken) return true;
        const parts = rawToken.split('.');
        if (parts.length < 2) return false;
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const exp = Number(payload?.exp);
          if (!exp) return false;
          const now = Math.floor(Date.now() / 1000);
          return exp <= now;
        } catch {
          return false;
        }
      })();
      if (!rawToken) {
        setError('Não autenticado. Faça login como admin.');
        return;
      }
      if (isExpired) {
        setError('Sessão expirada. Faça login novamente como admin.');
        return;
      }
      const hashed = await bcrypt.hash(form.password, 10);
      // Envie somente o que o backend precisa; o restante é forçado no servidor
      const payload = {
        nome_completo: form.nome,
        username: form.email,
        email: form.email,
        tel: form.tel,
        password: hashed,
      };
      const res = await AuthService.criarAdmin({
        nome_completo: form.nome,
        username: form.email,
        email: form.email,
        tel: form.tel,
        password: hashed,
      });
      const ok = res?.success === true || !!(res as any)?.usuario || !!(res as any)?.user || !!(res as any)?.id || !!(res as any)?._id || !!(res as any)?.admin;
      if (ok) {
        setSuccess("Administrador criado com sucesso!");
        setForm({ nome: "", email: "", password: "", tel: "" });
      } else {
        setError(res?.message || "Erro ao criar administrador.");
      }
    } catch (err: any) {
      const status = err?.status;
      if (status === 401) setError('Não autenticado. Faça login como admin.');
      else if (status === 403) setError('Permissão negada. Apenas administradores podem criar outros admins.');
      else setError(err?.data?.message || err?.message || "Erro ao criar administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Novo Admin</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Nome</label>
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Telefone</label>
          <input type="tel" name="tel" value={form.tel} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Senha</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black py-2 rounded font-bold hover:bg-yellow-600 transition">
          {loading ? "Criando..." : "Criar Admin"}
        </button>
      </form>
    </div>
  );
}
