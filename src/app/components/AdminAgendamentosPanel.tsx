"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/utils/api";
import type { AgendamentoData } from "@/app/types/index";

export default function AdminAgendamentosPanel() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Verifica se o usuário é admin
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Exemplo: verificação simples, ajuste conforme sua lógica de admin
      if (!parsedUser.isAdmin) {
        setError("Acesso restrito: apenas administradores.");
        setLoading(false);
        return;
      }
    } else {
      setError("Faça login como administrador para acessar.");
      setLoading(false);
      return;
    }

    // Buscar agendamentos
    apiRequest("/auterota/agendar", { method: "GET" })
      .then((res) => {
        if (res.success && res.data) {
          setAgendamentos(res.data);
        } else {
          setError(res.message || "Erro ao buscar agendamentos.");
        }
      })
      .catch((err) => {
        setError(err.message || "Erro ao buscar agendamentos.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Painel Administrativo - Agendamentos</h2>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Telefone</th>
            <th className="py-2 px-4 border-b">Serviço</th>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Horário</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">Nenhum agendamento encontrado.</td>
            </tr>
          ) : (
            agendamentos.map((ag, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{ag.nome}</td>
                <td className="py-2 px-4">{ag.telefone}</td>
                <td className="py-2 px-4">{ag.servico}</td>
                <td className="py-2 px-4">{ag.data}</td>
                <td className="py-2 px-4">{ag.horario}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
