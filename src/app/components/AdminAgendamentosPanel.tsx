"use client";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, API_CONFIG } from "@/app/utils/api";
import type { AgendamentoData } from "@/app/types/index";
import { useRouter } from "next/navigation";

export default function AdminAgendamentosPanel() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

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
    apiRequest(API_CONFIG.endpoints.agendamentos.listar, { method: "GET" })
      .then((res) => {
        if (res.success && res.data) {
          const list = (res.data as any[]).map((a: any) => ({
            ...a,
            id: a?.id ?? a?._id ?? a?.agendamento_id ?? a?.id_agendamento ?? a?.codigo,
            horario: a?.horario ?? a?.hora,
          })) as AgendamentoData[];
          setAgendamentos(list);
        } else {
          setError(res.message || "Erro ao buscar agendamentos.");
        }
      })
      .catch((err) => {
        setError(err.message || "Erro ao buscar agendamentos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const servicos = useMemo(() => [
    { id: 'corte', nome: 'Corte' },
    { id: 'barba', nome: 'Barba' },
    { id: 'cabelo-barba', nome: 'Cabelo e Barba' },
    { id: 'sombrancelha', nome: 'Sombrancelha' },
    { id: 'pezinho', nome: 'Pezinho' },
  ], []);

  function getAuthHeader() {
    if (typeof window === 'undefined') return {} as Record<string,string>;
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest(API_CONFIG.endpoints.agendamentos.listar, { method: 'GET' });
      if (res.success && res.data) {
        const list = (res.data as any[]).map((a: any) => ({
          ...a,
          id: a?.id ?? a?._id ?? a?.agendamento_id ?? a?.id_agendamento ?? a?.codigo,
          horario: a?.horario ?? a?.hora,
        })) as AgendamentoData[];
        setAgendamentos(list);
      } else setError(res.message || 'Erro ao buscar agendamentos.');
    } catch (e: any) {
      setError(e?.message || 'Erro ao buscar agendamentos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: AgendamentoData) {
    const id = item?.id || (item as any)?._id;
    if (!id) return alert('Não é possível excluir: registro sem ID.');
    if (!confirm(`Excluir agendamento de ${item.nome} em ${item.data} às ${item.horario || item.hora}?`)) return;
    try {
      const resp = await apiRequest(API_CONFIG.endpoints.agendamentos.remover(id), { method: 'DELETE' });
      if ((resp as any)?.success === false) return alert(resp?.message || 'Erro ao excluir');
      await refresh();
      alert('Agendamento excluído.');
    } catch (e: any) {
      alert(e?.message || 'Erro ao excluir');
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AgendamentoData | null>(null);

  function openNew() {
    setEditItem({ nome: '', telefone: '', servico: '', data: '', horario: '' });
    setIsModalOpen(true);
  }
  function openEdit(item: AgendamentoData) {
    setEditItem({ ...item, horario: item.horario || item.hora || '' });
    setIsModalOpen(true);
  }

  async function handleSave(item: AgendamentoData) {
    const payload = {
      nome: item.nome,
      telefone: item.telefone,
      servico: item.servico,
      data: item.data,
      horario: item.horario,
    };
    if (item.id) {
      const resp = await apiRequest(API_CONFIG.endpoints.agendamentos.atualizar(item.id), {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if ((resp as any)?.success === false) return alert(resp?.message || 'Erro ao atualizar');
    } else {
      const resp = await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if ((resp as any)?.success === false) return alert(resp?.message || 'Erro ao criar');
    }
    setIsModalOpen(false);
    setEditItem(null);
    await refresh();
    alert('Agendamento salvo.');
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Painel Administrativo - Agendamentos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-bold"
          onClick={openNew}
        >
          Novo Agendamento
        </button>
      </div>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Telefone</th>
            <th className="py-2 px-4 border-b">Serviço</th>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Horário</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">Nenhum agendamento encontrado.</td>
            </tr>
          ) : (
            agendamentos.map((ag, idx) => (
              <tr key={(ag as any)?.id ?? (ag as any)?._id ?? idx} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{ag.nome}</td>
                <td className="py-2 px-4">{ag.telefone}</td>
                <td className="py-2 px-4">{ag.servico}</td>
                <td className="py-2 px-4">{ag.data}</td>
                <td className="py-2 px-4">{ag.horario || ag.hora}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600 font-semibold" onClick={() => openEdit(ag)}>Editar</button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-semibold" onClick={() => handleDelete(ag)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{editItem?.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => { setIsModalOpen(false); setEditItem(null); }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input className="w-full px-3 py-2 border rounded" value={editItem?.nome || ''} onChange={(e) => setEditItem(prev => prev ? { ...prev, nome: e.target.value } : prev)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input className="w-full px-3 py-2 border rounded" value={editItem?.telefone || ''} onChange={(e) => setEditItem(prev => prev ? { ...prev, telefone: e.target.value } : prev)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                <select className="w-full px-3 py-2 border rounded" value={editItem?.servico || ''} onChange={(e) => setEditItem(prev => prev ? { ...prev, servico: e.target.value } : prev)}>
                  <option value="">Selecione</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input type="date" className="w-full px-3 py-2 border rounded" value={editItem?.data || ''} onChange={(e) => setEditItem(prev => prev ? { ...prev, data: e.target.value } : prev)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                <input placeholder="HH:MM" className="w-full px-3 py-2 border rounded" value={editItem?.horario || ''} onChange={(e) => setEditItem(prev => prev ? { ...prev, horario: e.target.value } : prev)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2 border rounded" onClick={() => { setIsModalOpen(false); setEditItem(null); }}>Cancelar</button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => editItem && handleSave(editItem)}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
