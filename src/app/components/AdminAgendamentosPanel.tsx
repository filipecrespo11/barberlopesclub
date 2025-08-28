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

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  // Paginação
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

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

  // Helpers de filtro
  const normalizeStr = (v?: string) => (v || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const parseDate = (v?: string) => {
    if (!v) return null;
    // aceita YYYY-MM-DD ou DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v + "T00:00:00");
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`);
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const filteredAgendamentos = useMemo(() => {
    const s = normalizeStr(searchTerm);
    const start = parseDate(dateStart);
    const end = parseDate(dateEnd);
    const filtered = agendamentos.filter((ag) => {
      // filtro de busca
      const nome = normalizeStr(ag.nome);
      const tel = normalizeStr(ag.telefone);
      const matchSearch = !s || nome.includes(s) || tel.includes(s);

      // filtro de data (inclusive)
      const d = parseDate(ag.data);
      const matchStart = !start || (d && d >= start);
      const matchEnd = !end || (d && d <= end);

      return matchSearch && matchStart && matchEnd;
    });
    // ordenar por data ASC e horário ASC
    const toComparable = (ag: AgendamentoData) => {
      const d = parseDate(ag.data)?.getTime() ?? 0;
      const h = (ag.horario || (ag as any).hora || "00:00");
      const [hh, mm] = (typeof h === 'string' && /^\d{2}:\d{2}$/.test(h)) ? h.split(':').map(Number) : [0, 0];
      return d + hh * 60_000 * 60 + mm * 60_000; // date millis + time offset
    };
    filtered.sort((a, b) => toComparable(a) - toComparable(b));
    return filtered;
  }, [agendamentos, searchTerm, dateStart, dateEnd]);

  // Reset página ao alterar filtros/lista
  useEffect(() => { setPage(1); }, [searchTerm, dateStart, dateEnd, agendamentos.length]);

  const totalPages = Math.max(1, Math.ceil(filteredAgendamentos.length / pageSize));
  const pageClamped = Math.min(page, totalPages);
  const startIndex = (pageClamped - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedAgendamentos = filteredAgendamentos.slice(startIndex, endIndex);

  const clearFilters = () => {
    setSearchTerm("");
    setDateStart("");
    setDateEnd("");
  };

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

  // Listener para evento de novo agendamento vindo dos botões fixos
  useEffect(() => {
    const handleOpenNew = () => openNew();
    window.addEventListener('openNewAgendamento', handleOpenNew);
    return () => window.removeEventListener('openNewAgendamento', handleOpenNew);
  }, []);

  // Gera slots de horário (step em minutos)
  const generateSlots = (start = "09:00", end = "20:00", stepMin = 60) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const out: string[] = [];
    for (let m = startMin; m <= endMin; m += stepMin) {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      out.push(`${hh}:${mm}`);
    }
    return out;
  };

  const allTimeSlots = useMemo(() => generateSlots("09:00", "20:00", 60), []);

  // Lista de horários disponíveis conforme a data selecionada no modal
  const availableTimes = useMemo(() => {
    if (!editItem?.data) return [];
    const occupied = new Set(
      agendamentos
        .filter(a => a.data === editItem.data)
        .map(a => a.horario || (a as any).hora)
        .filter(Boolean)
    );
    let avail = allTimeSlots.filter(t => !occupied.has(t));

    // Se estiver editando, garanta que o horário atual conste na lista
    if (editItem?.id && editItem?.horario && !avail.includes(editItem.horario)) {
      avail = [editItem.horario, ...avail];
    }
    // dedup
    return Array.from(new Set(avail));
  }, [agendamentos, editItem?.data, editItem?.id, editItem?.horario, allTimeSlots]);

  async function handleSave(item: AgendamentoData) {
    const payload = {
      nome: item.nome,
      telefone: item.telefone,
      servico: item.servico,
      data: item.data,
      horario: item.horario,
    };

    // Validação básica
    if (!payload.data) return alert('Informe uma data.');
    if (!payload.horario) return alert('Selecione um horário.');
    if (!availableTimes.includes(payload.horario)) {
      return alert('Horário indisponível para a data selecionada. Escolha outro.');
    }
    if (item.id) {
      try {
        const resp = await apiRequest(API_CONFIG.endpoints.agendamentos.atualizar(item.id), {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if ((resp as any)?.success === false) return alert(resp?.message || 'Erro ao atualizar');
      } catch (e: any) {
        if (e?.status === 409) return alert(e?.message || 'Horário já ocupado. Escolha outro.');
        return alert(e?.message || 'Erro ao atualizar');
      }
    } else {
      try {
        const resp = await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if ((resp as any)?.success === false) return alert(resp?.message || 'Erro ao criar');
      } catch (e: any) {
        if (e?.status === 409) return alert(e?.message || 'Horário já ocupado. Escolha outro.');
        return alert(e?.message || 'Erro ao criar');
      }
    }
    setIsModalOpen(false);
    setEditItem(null);
    await refresh();
    alert('Agendamento salvo.');
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Painel Administrativo - Agendamentos</h2>
      </div>

      {/* Barra de filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar (nome ou telefone)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="Ex.: João ou 2299..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data inicial</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded text-sm"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data final</label>
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 px-3 py-2 border rounded text-sm"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
            <button
              type="button"
              className="px-2 py-2 border rounded hover:bg-gray-50 text-sm"
              onClick={clearFilters}
              title="Limpar filtros"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 gap-2">
        <span>
          Exibindo {filteredAgendamentos.length === 0 ? 0 : startIndex + 1}
          -{Math.min(endIndex, filteredAgendamentos.length)} de {filteredAgendamentos.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageClamped <= 1}
          >
            Anterior
          </button>
          <span className="text-xs sm:text-sm">Página {pageClamped} / {totalPages}</span>
          <button
            type="button"
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageClamped >= totalPages}
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Layout responsivo: Cards em mobile, tabela em desktop */}
      <div className="block md:hidden">
        {/* Cards para mobile */}
        <div className="space-y-3">
          {filteredAgendamentos.length === 0 ? (
            <div className="bg-white p-4 rounded border text-center text-gray-500 text-sm">
              Nenhum agendamento encontrado com os filtros atuais.
            </div>
          ) : (
            pagedAgendamentos.map((ag, idx) => (
              <div key={(ag as any)?.id ?? (ag as any)?._id ?? idx} className="bg-white p-4 rounded border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{ag.nome}</h3>
                    <p className="text-xs text-gray-600">{ag.telefone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{ag.servico}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
                  <span>{ag.data}</span>
                  <span className="font-medium">{ag.horario || ag.hora}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-600 font-semibold" onClick={() => openEdit(ag)}>Editar</button>
                  <button className="flex-1 px-3 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700 font-semibold" onClick={() => handleDelete(ag)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tabela para desktop */}
      <div className="hidden md:block">
        <table className="w-full bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-sm text-left">Nome</th>
              <th className="py-3 px-4 border-b text-sm text-left">Telefone</th>
              <th className="py-3 px-4 border-b text-sm text-left">Serviço</th>
              <th className="py-3 px-4 border-b text-sm text-left">Data</th>
              <th className="py-3 px-4 border-b text-sm text-left">Horário</th>
              <th className="py-3 px-4 border-b text-sm text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgendamentos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500 text-sm">Nenhum agendamento encontrado com os filtros atuais.</td>
              </tr>
            ) : (
              pagedAgendamentos.map((ag, idx) => (
                <tr key={(ag as any)?.id ?? (ag as any)?._id ?? idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{ag.nome}</td>
                  <td className="py-3 px-4 text-sm">{ag.telefone}</td>
                  <td className="py-3 px-4 text-sm">{ag.servico}</td>
                  <td className="py-3 px-4 text-sm">{ag.data}</td>
                  <td className="py-3 px-4 text-sm">{ag.horario || ag.hora}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="px-3 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600 font-semibold" onClick={() => openEdit(ag)}>Editar</button>
                      <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-semibold" onClick={() => handleDelete(ag)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-bold">{editItem?.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
              <button className="text-gray-500 hover:text-gray-700 text-xl" onClick={() => { setIsModalOpen(false); setEditItem(null); }}>✕</button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input className="w-full px-3 py-2 border rounded text-sm" value={editItem?.nome || ''} onChange={(e) => setEditItem((prev: AgendamentoData | null) => prev ? { ...prev, nome: e.target.value } : prev)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input className="w-full px-3 py-2 border rounded text-sm" value={editItem?.telefone || ''} onChange={(e) => setEditItem((prev: AgendamentoData | null) => prev ? { ...prev, telefone: e.target.value } : prev)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                <select className="w-full px-3 py-2 border rounded text-sm" value={editItem?.servico || ''} onChange={(e) => setEditItem((prev: AgendamentoData | null) => prev ? { ...prev, servico: e.target.value } : prev)}>
                  <option value="">Selecione</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input type="date" className="w-full px-3 py-2 border rounded text-sm" value={editItem?.data || ''} onChange={(e) => setEditItem((prev: AgendamentoData | null) => prev ? { ...prev, data: e.target.value } : prev)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                <select
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={editItem?.horario || ''}
                  onChange={(e) => setEditItem((prev: AgendamentoData | null) => prev ? { ...prev, horario: e.target.value } : prev)}
                  disabled={!editItem?.data}
                >
                  <option value="">{editItem?.data ? 'Selecione um horário' : 'Selecione a data primeiro'}</option>
                  {availableTimes.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2 border rounded text-sm" onClick={() => { setIsModalOpen(false); setEditItem(null); }}>Cancelar</button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm" onClick={() => editItem && handleSave(editItem)}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
