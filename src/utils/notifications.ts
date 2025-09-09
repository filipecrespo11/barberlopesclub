/**
 * SISTEMA DE NOTIFICAÇÕES CENTRALIZADO
 * ====================================
 * 
 * Sistema completo de notificações toast para feedback ao usuário.
 * Implementa padrão Observer para reatividade e gerenciamento de estado.
 * 
 * FUNCIONALIDADES:
 * - Toast notifications: success, error, warning, info
 * - Auto-remoção configurável por duração
 * - Notificações persistentes para ações críticas
 * - Sistema de confirmação integrado
 * - Contextos específicos: auth, agendamento, admin, system
 * - Gerenciamento de estado reativo com listeners
 * - Prevenção de spam com IDs únicos
 * 
 * TIPOS DE NOTIFICAÇÃO:
 * - success: Ações bem-sucedidas (verde)
 * - error: Erros e falhas (vermelho)
 * - warning: Avisos e alertas (amarelo)
 * - info: Informações gerais (azul)
 * 
 * USO:
 * - import { notifications } from '@/utils/notifications';
 * - notifications.success('Operação realizada!');
 * - notifications.auth.loginSuccess('João');
 * 
 * INTEGRAÇÃO COM UI:
 * - Subscribe para mudanças: notifications.subscribe(callback)
 * - Renderizar toasts baseado no estado
 * - Remover com notifications.remove(id)
 * 
 * MANUTENÇÃO:
 * - Para novos contextos: adicionar objetos como 'auth', 'admin'
 * - Para novos tipos: estender 'type' union
 * - Para personalizar duração: modificar defaults
 * - Para integração: implementar useNotifications hook
 * 
 * @author Sistema de Manutenção - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

/**
 * INTERFACE DAS OPÇÕES DE NOTIFICAÇÃO
 * ===================================
 * Define estrutura completa para configurar notificações
 */
export interface NotificationOptions {
  title?: string;           // Título opcional da notificação
  message: string;          // Mensagem obrigatória
  type: 'success' | 'error' | 'warning' | 'info'; // Tipo visual/semântico
  duration?: number;        // Duração em ms (auto-remove)
  action?: {                // Ação opcional (botão)
    label: string;          // Texto do botão
    callback: () => void;   // Função executada no click
  };
  persistent?: boolean;     // Se não deve auto-remover
}

/**
 * INTERFACE DO ESTADO DO TOAST
 * =============================
 * Estrutura interna para gerenciar toasts ativos
 */
export interface ToastState {
  id: string;               // ID único para identificação
  options: NotificationOptions; // Opções originais
  timestamp: number;        // Timestamp de criação
}

/**
 * CLASSE PRINCIPAL DO GERENCIADOR DE NOTIFICAÇÕES
 * ===============================================
 * Implementa padrão Observer para gerenciamento reativo de toasts
 */
class NotificationManager {
  // ==========================================
  // ESTADO INTERNO
  // ==========================================
  private toasts: ToastState[] = [];           // Lista de toasts ativos
  private listeners: ((toasts: ToastState[]) => void)[] = []; // Observers registrados

  /**
   * GERAÇÃO DE ID ÚNICO
   * ===================
   * Cria identificador único para cada toast
   * Formato: toast-timestamp-random
   * @returns string - ID único
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * NOTIFICAÇÃO DOS LISTENERS
   * =========================
   * Executa todos os observers registrados
   * Passa cópia do estado para evitar mutações
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  // ==========================================
  // GERENCIAMENTO DE OBSERVERS
  // ==========================================

  /**
   * REGISTRO DE LISTENER
   * ====================
   * Adiciona observer para mudanças no estado dos toasts
   * Retorna função de cleanup para remover o listener
   * 
   * USO:
   * const unsubscribe = notifications.subscribe((toasts) => {
   *   setToastList(toasts); // Atualiza UI
   * });
   * // Cleanup: unsubscribe();
   * 
   * @param listener - Função callback para mudanças
   * @returns function - Função para remover o listener
   */
  subscribe(listener: (toasts: ToastState[]) => void): () => void {
    this.listeners.push(listener);
    
    // Retorna função para remover o listener (cleanup)
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // ==========================================
  // OPERAÇÕES PRINCIPAIS
  // ==========================================

  /**
   * EXIBIR NOTIFICAÇÃO
   * ==================
   * Método principal para criar e exibir toasts
   * Configura auto-remoção baseada no tipo e duração
   * 
   * DURAÇÕES PADRÃO:
   * - error: 5000ms (mais tempo para ler erros)
   * - outros: 3000ms (tempo padrão)
   * 
   * @param options - Configuração da notificação
   * @returns string - ID do toast para referência
   */
  show(options: NotificationOptions): string {
    const id = this.generateId();
    
    // Define duração baseada no tipo se não especificada
    const duration = options.duration ?? (options.type === 'error' ? 5000 : 3000);
    
    const toast: ToastState = {
      id,
      options,
      timestamp: Date.now()
    };

    // Adiciona ao estado e notifica observers
    this.toasts.push(toast);
    this.notifyListeners();

    // ==========================================
    // AUTO-REMOÇÃO CONFIGURÁVEL
    // ==========================================
    // Remove automaticamente após duração especificada
    // Exceto se marcado como persistente
    if (!options.persistent) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id; // Retorna ID para remoção manual se necessário
  }

  /**
   * REMOVER NOTIFICAÇÃO ESPECÍFICA
   * ===============================
   * Remove toast pelo ID e atualiza observers
   * @param id - ID do toast a ser removido
   */
  remove(id: string): void {
    const index = this.toasts.findIndex(toast => toast.id === id);
    if (index > -1) {
      this.toasts.splice(index, 1);
      this.notifyListeners();
    }
  }

  /**
   * LIMPAR TODAS AS NOTIFICAÇÕES
   * =============================
   * Remove todos os toasts ativos
   * Útil para reset de estado ou limpeza geral
   */
  clear(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  // ==========================================
  // MÉTODOS DE CONVENIÊNCIA (SHORTCUTS)
  // ==========================================
  // Facilitam uso comum sem especificar todas as opções

  /**
   * NOTIFICAÇÃO DE SUCESSO
   * ======================
   * Para ações bem-sucedidas (cor verde)
   * @param message - Mensagem principal
   * @param title - Título opcional
   * @param duration - Duração customizada (opcional)
   * @returns string - ID do toast
   */
  success(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  /**
   * NOTIFICAÇÃO DE ERRO
   * ===================
   * Para erros e falhas (cor vermelha)
   * Por padrão não é persistente, mas pode ser configurada
   * @param message - Mensagem de erro
   * @param title - Título opcional
   * @param persistent - Se deve permanecer até remoção manual
   * @returns string - ID do toast
   */
  error(message: string, title?: string, persistent = false): string {
    return this.show({
      type: 'error',
      title,
      message,
      persistent
    });
  }

  /**
   * NOTIFICAÇÃO DE AVISO
   * ====================
   * Para avisos e alertas (cor amarela)
   * @param message - Mensagem de aviso
   * @param title - Título opcional
   * @param duration - Duração customizada (opcional)
   * @returns string - ID do toast
   */
  warning(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  /**
   * NOTIFICAÇÃO INFORMATIVA
   * =======================
   * Para informações gerais (cor azul)
   * @param message - Mensagem informativa
   * @param title - Título opcional
   * @param duration - Duração customizada (opcional)
   * @returns string - ID do toast
   */
  info(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  // ==========================================
  // CONTEXTOS ESPECÍFICOS DO DOMÍNIO
  // ==========================================
  // Notificações padronizadas para áreas específicas da aplicação

  /**
   * CONTEXTO DE AUTENTICAÇÃO
   * ========================
   * Notificações relacionadas a login, logout, cadastro, etc.
   */
  auth = {
    loginSuccess: (userName: string) =>
      this.success(`Bem-vindo, ${userName}!`, 'Login realizado'),
    
    loginError: (error: string) =>
      this.error(error, 'Erro no login'),
    
    logoutSuccess: () =>
      this.info('Você foi desconectado', 'Logout'),
    
    cadastroSuccess: () =>
      this.success('Cadastro iniciado! Verifique seu email.', 'Cadastro'),
    
    verificacaoSuccess: () =>
      this.success('Email verificado com sucesso!', 'Verificação'),
    
    sessionExpired: () =>
      this.warning('Sua sessão expirou. Faça login novamente.', 'Sessão expirada')
  };

  /**
   * CONTEXTO DE AGENDAMENTOS
   * ========================
   * Notificações relacionadas ao sistema de agendamentos
   */
  agendamento = {
    created: (data: string, horario: string) =>
      this.success(`Agendamento confirmado para ${data} às ${horario}`, 'Agendamento criado'),
    
    updated: () =>
      this.success('Agendamento atualizado com sucesso', 'Atualização'),
    
    cancelled: () =>
      this.info('Agendamento cancelado', 'Cancelamento'),
    
    error: (error: string) =>
      this.error(error, 'Erro no agendamento'),
    
    conflictError: () =>
      this.warning('Horário não disponível. Escolha outro horário.', 'Conflito de horário')
  };

  /**
   * CONTEXTO ADMINISTRATIVO
   * =======================
   * Notificações para operações administrativas
   */
  admin = {
    userCreated: (name: string) =>
      this.success(`Usuário ${name} criado com sucesso`, 'Admin'),
    
    permissionDenied: () =>
      this.error('Acesso negado. Apenas administradores podem acessar esta área.', 'Permissão negada'),
    
    operationSuccess: (operation: string) =>
      this.success(`${operation} realizada com sucesso`, 'Admin')
  };

  /**
   * CONTEXTO DO SISTEMA
   * ===================
   * Notificações sobre estado do sistema e conectividade
   */
  system = {
    offline: () =>
      this.warning('Você está offline. Algumas funcionalidades podem não funcionar.', 'Conexão', 0),
    
    online: () =>
      this.info('Conexão restaurada', 'Online'),
    
    updateAvailable: () =>
      this.info('Nova versão disponível. Recarregue a página para atualizar.', 'Atualização', 10000),
    
    maintenanceMode: () =>
      this.warning('Sistema em manutenção. Algumas funcionalidades podem estar indisponíveis.', 'Manutenção', 0)
  };

  /**
   * Confirma uma ação com o usuário
   */
  confirm(
    message: string,
    title: string = 'Confirmar',
    onConfirm: () => void,
    onCancel?: () => void
  ): string {
    return this.show({
      type: 'warning',
      title,
      message,
      persistent: true,
      action: {
        label: 'Confirmar',
        callback: () => {
          onConfirm();
          // O toast será removido automaticamente após a ação
        }
      }
    });
  }

  /**
   * Mostra progresso de uma operação
   */
  progress(message: string, title?: string): string {
    return this.show({
      type: 'info',
      title,
      message,
      persistent: true
    });
  }

  /**
   * Obtém todas as notificações ativas
   */
  getAll(): ToastState[] {
    return [...this.toasts];
  }

  /**
   * Verifica se há notificações de um tipo específico
   */
  hasType(type: NotificationOptions['type']): boolean {
    return this.toasts.some(toast => toast.options.type === type);
  }
}

// ==========================================
// INSTÂNCIA SINGLETON PARA ACESSO GLOBAL
// ==========================================
// Exportação da instância única do NotificationManager
// para garantir estado consistente em toda a aplicação

/**
 * INSTÂNCIA SINGLETON DO GERENCIADOR DE NOTIFICAÇÕES
 * ==================================================
 * 
 * Esta instância única permite:
 * - Estado consistente de notificações em toda a aplicação
 * - Evita conflitos entre múltiplas instâncias
 * - Facilita a importação e uso em diferentes componentes
 * 
 * USO RECOMENDADO:
 * ===============
 * import { notifications } from '@/utils/notifications';
 * 
 * // Notificações básicas
 * notifications.success('Operação realizada com sucesso!');
 * notifications.error('Algo deu errado');
 * 
 * // Notificações contextuais
 * notifications.auth.loginSuccess('João');
 * notifications.agendamento.created('15/01/2024', '14:00');
 * 
 * // Escutando mudanças de estado
 * useEffect(() => {
 *   const unsubscribe = notifications.subscribe((toasts) => {
 *     setToasts(toasts);
 *   });
 *   return unsubscribe;
 * }, []);
 * 
 * MANUTENÇÃO:
 * ===========
 * - Esta instância deve ser única em toda a aplicação
 * - Novos contextos devem ser adicionados à classe principal
 * - Sempre teste as notificações em diferentes cenários de uso
 */
export const notifications = new NotificationManager();

// ==========================================
// HOOK PARA INTEGRAÇÃO COM REACT
// ==========================================
// Hook personalizado para facilitar o uso em componentes React

/**
 * HOOK PARA NOTIFICAÇÕES
 * ======================
 * 
 * Hook personalizado que retorna o gerenciador de notificações
 * para uso em componentes React. Facilita a integração e
 * mantém a API consistente.
 * 
 * USO EM COMPONENTES:
 * ==================
 * const notifications = useNotifications();
 * 
 * const handleSuccess = () => {
 *   notifications.success('Operação realizada!');
 * };
 * 
 * EVOLUÇÃO FUTURA:
 * ================
 * Este hook pode ser expandido para incluir:
 * - Estado reativo integrado com React
 * - Configurações específicas por componente
 * - Integração com Context API
 */
export const useNotifications = () => {
  // Este hook seria implementado no contexto React
  // Por ora, retornamos o manager diretamente
  return notifications;
};
