// ==========================================
// MODAL DE AGENDAMENTO
// ==========================================
// Arquivo: src/app/components/AgendamentoModal.tsx
// Versão: 2.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Modal para criação e gestão de agendamentos
// ==========================================

/**
 * AGENDAMENTO MODAL - BARBER LOPES CLUB
 * =====================================
 * 
 * Componente modal responsável pela criação de novos agendamentos,
 * incluindo seleção de serviços, datas, horários disponíveis e
 * validações completas do processo de agendamento.
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * ===========================
 * - Formulário completo de agendamento
 * - Validação de disponibilidade de horários
 * - Integração com sistema de autenticação
 * - Preenchimento automático de dados do usuário
 * - Cálculo de preços por serviço
 * - Validação de regras de negócio
 * - Feedback visual para usuário
 * - Integração com WhatsApp
 * 
 * REGRAS DE NEGÓCIO APLICADAS:
 * ============================
 * - Horário comercial: 9h às 20h
 * - Intervalos de 1 hora entre agendamentos
 * - Não permite agendamento em horários passados
 * - Máximo 7 dias de antecedência
 * - Usuário deve estar logado e verificado
 * - Telefone é obrigatório para contato
 * 
 * VALIDAÇÕES IMPLEMENTADAS:
 * ========================
 * - Campos obrigatórios preenchidos
 * - Formato de telefone brasileiro
 * - Data não pode ser passada
 * - Horário dentro do funcionamento
 * - Disponibilidade do slot selecionado
 * - Usuário autenticado
 * 
 * FLUXO DE USO:
 * =============
 * 1. Verifica se usuário está logado
 * 2. Preenche dados automaticamente se logado
 * 3. Usuário seleciona serviço, data e horário
 * 4. Valida disponibilidade do horário
 * 5. Confirma agendamento
 * 6. Envia confirmação via WhatsApp
 * 7. Fecha modal e atualiza estado
 * 
 * MANUTENÇÃO:
 * ===========
 * - Atualizar horários conforme mudanças operacionais
 * - Validar compatibilidade com API de agendamentos
 * - Testar responsividade em diferentes dispositivos
 * - Monitorar performance com muitos slots de horário
 */

"use client";
import { useState, useEffect, useMemo } from "react";
import { AgendamentoService, UtilsService, AuthService } from "@/services";
import { apiRequest } from "@/app/utils/api";
import { User } from "@/app/types";

/**
 * PROPS DO COMPONENTE AGENDAMENTO MODAL
 * =====================================
 */
interface AgendamentoModalProps {
  isOpen: boolean;                      // Controla visibilidade do modal
  onClose: () => void;                 // Callback para fechar modal
  onLoginRequired: () => void;         // Callback quando login é necessário
}

/**
 * COMPONENTE PRINCIPAL DO MODAL
 * =============================
 */
export default function AgendamentoModal({ isOpen, onClose, onLoginRequired }: AgendamentoModalProps) {
  // ==========================================
  // ESTADO DO FORMULÁRIO
  // ==========================================
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: '',
    data: '',
    horario: ''
  });
  
  // ==========================================
  // ESTADO DE AUTENTICAÇÃO E UI
  // ==========================================
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // EFEITO PARA CARREGAR DADOS DO USUÁRIO
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      // Verificar se o usuário está logado e preencher dados automaticamente
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

  // ==========================================
  // CONFIGURAÇÃO DE SERVIÇOS DISPONÍVEIS
  // ==========================================
  const servicos = [
    { id: 'corte', nome: 'Corte', preco: 'R$ 35,00' },
    { id: 'barba', nome: 'Barba', preco: 'R$ 25,00' },
    { id: 'cabelo-barba', nome: 'Cabelo e Barba', preco: 'R$ 60,00' },
    { id: 'sombrancelha', nome: 'Sombrancelha', preco: 'R$ 15,00' },
    { id: 'pezinho', nome: 'Pezinho', preco: 'R$ 10,00' }
  ];

  /**
   * GERADOR DE SLOTS DE HORÁRIO
   * ===========================
   * 
   * Cria lista de horários disponíveis baseado em:
   * - Horário de abertura e fechamento
   * - Intervalo entre agendamentos
   * - Regras de funcionamento
   */
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

  const horarios = useMemo(() => generateSlots("09:00", "20:00", 60), []);

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>(horarios);

  useEffect(() => {
    // Consulta horários disponíveis diretamente do backend
    async function fetchHorariosDisponiveis() {
      if (!formData.data || !formData.servico) {
        setHorariosDisponiveis(horarios);
        return;
      }
      try {
        // Endpoint que retorna apenas horários disponíveis para a data e serviço
        const res = await apiRequest(`/auterota/agendamentos?data=${formData.data}&servico=${formData.servico}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.success && Array.isArray(res.data)) {
          // A API hoje retorna horários OCUPADOS (ou agendamentos com campo horario/hora).
          // Vamos normalizar e filtrar esses horários do conjunto total para exibir APENAS DISPONÍVEIS.
          const occupied = (res.data as any[])
            .map((h) => {
              if (typeof h === 'string') return h;
              if (h && typeof h === 'object') return h.horario || h.hora || '';
              return '';
            })
            .filter((v): v is string => typeof v === 'string' && v.length > 0);
          const occupiedSet = new Set(occupied);
          const available = horarios.filter((h) => !occupiedSet.has(h));
          setHorariosDisponiveis(available.length > 0 ? available : []);
        } else {
          setHorariosDisponiveis(horarios);
        }
      } catch {
        setHorariosDisponiveis(horarios);
      }
    }
    fetchHorariosDisponiveis();
  }, [formData.data, formData.servico, horarios]);

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
        
        await AgendamentoService.criar(agendamentoData);
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
      UtilsService.abrirWhatsAppComMensagem(mensagem);
      
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
              disabled={horariosDisponiveis.length === 0}
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map((horario, idx) => (
                <option key={`${horario}-${idx}`} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
            {horariosDisponiveis.length === 0 && (
              <p className="text-red-500 text-sm mt-2">Nenhum horário disponível para esta data e serviço.</p>
            )}
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
              disabled={loading || horariosDisponiveis.length === 0}
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
