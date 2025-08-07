"use client";
import { useState, useEffect, useMemo } from "react";
import { apiRequest, API_CONFIG } from "@/app/utils/api";
import { User } from "@/app/types";

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRequired: () => void;
}

export default function AgendamentoModal({ isOpen, onClose, onLoginRequired }: AgendamentoModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: '',
    data: '',
    horario: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Verificar se o usuário está logado
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData(prev => ({
          ...prev,
          nome: parsedUser.nome_completo || '',
          telefone: parsedUser.tel || ''
        }));
      }
    }
  }, [isOpen]);

  const servicos = [
    { id: 'corte', nome: 'Corte', preco: 'R$ 30,00' },
    { id: 'barba', nome: 'Barba', preco: 'R$ 20,00' },
    { id: 'cabelo-barba', nome: 'Cabelo e Barba', preco: 'R$ 45,00' },
    { id: 'sombrancelha', nome: 'Sombrancelha', preco: 'R$ 5,00' },
    { id: 'pezinho', nome: 'Pezinho', preco: 'R$ 10,00' }
  ];

  const horarios = useMemo(() => [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ], []);

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>(horarios);

  useEffect(() => {
    // Atualiza horários disponíveis ao mudar serviço ou data
    async function fetchHorarios() {
      if (!formData.data) {
        setHorariosDisponiveis(horarios);
        return;
      }
      try {
        const res = await apiRequest('/auterota/agendamentos', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.success && Array.isArray(res.data)) {
          // Filtra agendamentos para a data selecionada
          const agendamentosData = res.data.filter((ag: { data: string }) => ag.data === formData.data);
          // Remove horários já agendados
          const horariosIndisponiveis = agendamentosData.map((ag: { horario: string }) => ag.horario);
          setHorariosDisponiveis(horarios.filter(h => !horariosIndisponiveis.includes(h)));
        } else {
          setHorariosDisponiveis(horarios);
        }
      } catch {
        setHorariosDisponiveis(horarios);
      }
    }
    fetchHorarios();
  }, [formData.data, horarios]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o usuário está logado
    if (!user) {
      onClose();
      onLoginRequired();
      return;
    }

    // Validação dos campos
    if (!formData.servico || !formData.data || !formData.horario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      // Tentar salvar no backend primeiro
      try {
        const agendamentoData = {
          nome: formData.nome,
          telefone: formData.telefone,
          servico: formData.servico,
          data: formData.data,
          horario: formData.horario,
          usuario_id: user.id
        };
        await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
          method: 'POST',
          body: JSON.stringify(agendamentoData)
        });
      } catch (apiError) {
        // Se for erro de autenticação, redirecionar para login
        if (apiError instanceof Error && (apiError.message.includes('401') || apiError.message.includes('não autenticado'))) {
          alert('Sua sessão expirou. Faça login novamente para continuar.');
          onClose();
          onLoginRequired();
          return;
        }
        // Para outros erros, continuar com WhatsApp mas alertar o usuário
        console.warn('Agendamento não foi salvo no sistema, mas será enviado via WhatsApp');
      }
      
      // Criar mensagem para WhatsApp
      const servicoSelecionado = servicos.find(s => s.id === formData.servico);
      const dataFormatada = new Date(formData.data).toLocaleDateString('pt-BR');
      
      const mensagem = `Olá! Gostaria de confirmar meu agendamento:
        
👤 Nome: ${formData.nome}
📞 Telefone: ${formData.telefone}
✂️ Serviço: ${servicoSelecionado?.nome} (${servicoSelecionado?.preco})
📅 Data: ${dataFormatada}
🕐 Horário: ${formData.horario}

Agendamento solicitado via site!`;

      // Redirecionar para WhatsApp
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, '_blank');
      
      alert('Agendamento processado! Você será redirecionado para o WhatsApp para confirmar.');
      onClose();
      
      // Limpar apenas campos de agendamento
      setFormData(prev => ({
        ...prev,
        servico: '',
        data: '',
        horario: ''
      }));
    } catch (error) {
      console.error('Erro ao agendar:', error);
      alert('Erro ao processar agendamento. Tente novamente.');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  // Se não estiver logado, mostrar tela de login necessário
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Necessário</h2>
            <p className="text-gray-600 mb-6">Para agendar um horário, você precisa fazer login ou criar uma conta.</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onLoginRequired();
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Fazer Login / Criar Conta
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agendar Horário</h2>
            <p className="text-sm text-gray-600">Olá, {user?.nome_completo || 'Usuário'}!</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          {/* Telefone (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          {/* Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço *
            </label>
            <select
              name="servico"
              value={formData.servico}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome} - {servico.preco}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Horário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário *
            </label>
            <select
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map(horario => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Agendando...' : 'Agendar via WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
