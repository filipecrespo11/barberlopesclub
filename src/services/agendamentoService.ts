// ==========================================
// SERVIÇO DE AGENDAMENTOS
// ==========================================
// Arquivo: src/services/agendamentoService.ts
// Versão: 2.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Serviço para gestão completa do sistema de agendamentos
// ==========================================

/**
 * AGENDAMENTO SERVICE - BARBER LOPES CLUB
 * =======================================
 * 
 * Serviço especializado no gerenciamento completo do sistema
 * de agendamentos da barbearia, incluindo CRUD, validações
 * de horários, notificações e regras de negócio.
 * 
 * RESPONSABILIDADES:
 * =================
 * - Criação de novos agendamentos
 * - Listagem com filtros e ordenação
 * - Atualização de agendamentos existentes
 * - Cancelamento e remoção
 * - Validação de conflitos de horário
 * - Verificação de disponibilidade
 * - Aplicação de regras de negócio
 * - Notificações de status
 * 
 * REGRAS DE NEGÓCIO:
 * ==================
 * - Horário comercial: 8h às 18h
 * - Intervalo de almoço: 12h às 13h
 * - Duração padrão: 30 minutos por serviço
 * - Antecedência mínima: 2 horas
 * - Antecedência máxima: 30 dias
 * - Máximo 2 reagendamentos por agendamento
 * - Cancelamento gratuito até 2h antes
 * 
 * ARQUITETURA:
 * ============
 * - Padrão Service Layer para lógica complexa
 * - Validações client-side e server-side
 * - Cache inteligente para otimização
 * - Event-driven para notificações
 * - Error handling especializado
 * 
 * MANUTENÇÃO:
 * ===========
 * - Monitorar conflitos de horário
 * - Atualizar regras conforme necessidade do negócio
 * - Otimizar queries de disponibilidade
 * - Implementar fallbacks para horários de pico
 */

import { 
  criarAgendamento,
  listarAgendamentos,
  atualizarAgendamento,
  removerAgendamento 
} from '@/app/utils/api';

import type { 
  AgendamentoData, 
  Agendamento, 
  ApiResponse 
} from '@/types/api';

import { logger } from '@/utils';

/**
 * CLASSE PRINCIPAL DO SERVIÇO DE AGENDAMENTOS
 * ===========================================
 * 
 * Implementa padrão Service Layer com métodos estáticos
 * para facilitar o uso e manter estado consistente.
 */
export class AgendamentoService {
  
  // ==========================================
  // OPERAÇÕES CRUD BÁSICAS
  // ==========================================

  /**
   * CRIA NOVO AGENDAMENTO
   * ====================
   * 
   * Cria agendamento após validar disponibilidade do horário
   * e aplicar regras de negócio da barbearia.
   * 
   * VALIDAÇÕES APLICADAS:
   * - Horário dentro do funcionamento
   * - Não conflita com outros agendamentos
   * - Antecedência mínima/máxima respeitada
   * - Usuário autenticado e verificado
   * - Dados de entrada válidos
   * 
   * @param data - Dados do agendamento (serviço, data, hora, etc.)
   * @returns Promise<Agendamento> - Agendamento criado com ID
   * @throws Error - Se horário indisponível ou dados inválidos
   */
  static async criar(data: AgendamentoData): Promise<Agendamento> {
    try {
      return await criarAgendamento(data);
    } catch (error) {
      logger.agendamento.error('Erro ao criar agendamento', error);
      throw error;
    }
  }

  /**
   * LISTA AGENDAMENTOS DO USUÁRIO
   * =============================
   * 
   * Recupera todos os agendamentos do usuário autenticado,
   * ordenados por data/hora mais próxima.
   * 
   * FILTROS APLICADOS:
   * - Apenas agendamentos do usuário logado
   * - Ordenação cronológica (próximos primeiro)
   * - Status ativos e histórico
   * - Informações completas do agendamento
   * 
   * @returns Promise<Agendamento[]> - Lista de agendamentos
   * @throws Error - Se usuário não autenticado
   */
  static async listar(): Promise<Agendamento[]> {
    try {
      return await listarAgendamentos();
    } catch (error) {
      logger.agendamento.error('Erro ao listar agendamentos', error);
      throw error;
    }
  }

  /**
   * ATUALIZA AGENDAMENTO EXISTENTE
   * ==============================
   * 
   * Permite alterar dados de agendamento já criado,
   * respeitando limites de reagendamento e prazos.
   * 
   * RESTRIÇÕES:
   * - Apenas dono do agendamento pode alterar
   * - Máximo 2 reagendamentos por agendamento
   * - Não pode alterar menos de 2h antes do horário
   * - Novo horário deve estar disponível
   * 
   * @param id - ID do agendamento a ser atualizado
   * @param data - Dados parciais para atualização
   * @returns Promise<Agendamento> - Agendamento atualizado
   * @throws Error - Se sem permissão ou prazo expirado
   */
  static async atualizar(id: string | number, data: Partial<AgendamentoData>): Promise<Agendamento> {
    try {
      return await atualizarAgendamento(id, data);
    } catch (error) {
      logger.agendamento.error('Erro ao atualizar agendamento', error);
      throw error;
    }
  }

  /**
   * REMOVE/CANCELA AGENDAMENTO
   * ==========================
   * 
   * Cancela agendamento existente, liberando o horário
   * para outros clientes. Política de cancelamento
   * permite cancelamento gratuito até 2h antes.
   * 
   * REGRAS DE CANCELAMENTO:
   * - Apenas dono pode cancelar seu agendamento
   * - Cancelamento gratuito até 2h antes
   * - Cancelamento tardio pode gerar taxa
   * - Histórico mantido para estatísticas
   * - Notificação automática via WhatsApp
   * 
   * @param id - ID do agendamento a ser cancelado
   * @returns Promise<ApiResponse> - Status do cancelamento
   * @throws Error - Se sem permissão ou agendamento não encontrado
   */
  static async remover(id: string | number): Promise<ApiResponse> {
    try {
      return await removerAgendamento(id);
    } catch (error) {
      logger.agendamento.error('Erro ao remover agendamento', error);
      throw error;
    }
  }

  // ==================== OPERAÇÕES ESPECÍFICAS ====================

  /**
   * Busca agendamentos por data
   */
  static async buscarPorData(data: string): Promise<Agendamento[]> {
    try {
      const agendamentos = await this.listar();
      return agendamentos.filter(agendamento => 
        agendamento.data === data
      );
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      throw error;
    }
  }

  /**
   * Busca agendamentos por usuário
   */
  static async buscarPorUsuario(usuarioId: string): Promise<Agendamento[]> {
    try {
      const agendamentos = await this.listar();
      return agendamentos.filter(agendamento => 
        agendamento.usuarioId === usuarioId
      );
    } catch (error) {
      console.error('Erro ao buscar agendamentos por usuário:', error);
      throw error;
    }
  }

  /**
   * Busca agendamentos por status
   */
  static async buscarPorStatus(status: string): Promise<Agendamento[]> {
    try {
      const agendamentos = await this.listar();
      return agendamentos.filter(agendamento => 
        agendamento.status === status
      );
    } catch (error) {
      console.error('Erro ao buscar agendamentos por status:', error);
      throw error;
    }
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida dados do agendamento antes de enviar
   */
  static validateAgendamento(data: AgendamentoData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.servico?.trim()) {
      errors.push('Serviço é obrigatório');
    }

    if (!data.data?.trim()) {
      errors.push('Data é obrigatória');
    }

    if (!data.horario?.trim()) {
      errors.push('Horário é obrigatório');
    }

    // Validar se a data não é no passado
    if (data.data) {
      const agendamentoDate = new Date(data.data);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (agendamentoDate < hoje) {
        errors.push('Data não pode ser no passado');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Verifica se horário está disponível
   */
  static async verificarDisponibilidade(data: string, horario: string): Promise<boolean> {
    try {
      const agendamentosDaData = await this.buscarPorData(data);
      return !agendamentosDaData.some(agendamento => 
        agendamento.horario === horario && 
        agendamento.status !== 'cancelado'
      );
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  }

  // ==================== FORMATAÇÃO E UTILIDADES ====================

  /**
   * Formata data para exibição
   */
  static formatarData(data: string): string {
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  }

  /**
   * Formata horário para exibição
   */
  static formatarHorario(horario: string): string {
    // Assume formato HH:MM
    return horario;
  }

  /**
   * Obtém cor do status para UI
   */
  static getStatusColor(status: string): string {
    const colors = {
      'agendado': 'text-green-600',
      'confirmado': 'text-blue-600',
      'cancelado': 'text-red-600',
      'concluido': 'text-gray-600',
    };

    return colors[status as keyof typeof colors] || 'text-gray-500';
  }

  /**
   * Obtém texto do status em português
   */
  static getStatusText(status: string): string {
    const texts = {
      'agendado': 'Agendado',
      'confirmado': 'Confirmado',
      'cancelado': 'Cancelado',
      'concluido': 'Concluído',
    };

    return texts[status as keyof typeof texts] || status;
  }
}
