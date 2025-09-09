/**
 * SISTEMA DE LOGGING CENTRALIZADO
 * ================================
 * 
 * Sistema profissional de logging com múltiplos níveis e contextos.
 * Permite controle granular de logs e formatação consistente.
 * 
 * FUNCIONALIDADES:
 * - Níveis de log: ERROR, WARN, INFO, DEBUG
 * - Contextos específicos: Auth, API, Agendamento
 * - Formatação com timestamp e módulo
 * - Controle baseado em ambiente (dev/prod)
 * - Estilos visuais para desenvolvimento
 * - Preparado para integração com serviços externos
 * 
 * USO:
 * - import { logger } from '@/utils/logger';
 * - logger.info('Mensagem', { module: 'ModuleName' });
 * - logger.auth.success('Login realizado', userId);
 * 
 * MANUTENÇÃO:
 * - Para adicionar novos contextos: criar objetos como 'auth', 'api'
 * - Para alterar níveis: modificar LogLevel enum
 * - Para integrar monitoramento: modificar método error()
 * - Para alterar formato: modificar formatMessage()
 * 
 * @author Sistema de Manutenção - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

import { APP_CONFIG } from '@/config/app';

/**
 * ENUM DOS NÍVEIS DE LOG
 * ======================
 * Hierarquia: ERROR < WARN < INFO < DEBUG
 * Valores numéricos permitem comparação de níveis
 */
export enum LogLevel {
  ERROR = 0,  // Apenas erros críticos
  WARN = 1,   // Avisos importantes
  INFO = 2,   // Informações gerais
  DEBUG = 3,  // Detalhes de desenvolvimento
}

/**
 * INTERFACE PARA CONTEXTO DO LOG
 * ==============================
 * Permite identificar origem e adicionar metadados
 */
export interface LogContext {
  module: string;        // Nome do módulo (ex: 'Auth', 'API')
  function?: string;     // Nome da função específica
  userId?: string;       // ID do usuário (para auditoria)
  extra?: Record<string, any>; // Dados adicionais
}

/**
 * CLASSE PRINCIPAL DO LOGGER
 * ==========================
 * Implementa sistema de logging com controle de níveis e formatação
 */
class Logger {
  private level: LogLevel;      // Nível atual de logging
  private isDevelopment: boolean; // Flag de ambiente de desenvolvimento

  /**
   * CONSTRUTOR
   * ==========
   * Configura nível de log baseado no ambiente
   * Desenvolvimento: DEBUG (todos os logs)
   * Produção: WARN (apenas warnings e errors)
   */
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  /**
   * VERIFICAÇÃO DE NÍVEL
   * ====================
   * Determina se um log deve ser exibido baseado no nível e configuração
   * @param level - Nível do log a ser verificado
   * @returns boolean - Se deve ou não logar
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.level && APP_CONFIG.dev.enableLogs;
  }

  /**
   * FORMATAÇÃO DE MENSAGEM
   * ======================
   * Cria formato padrão: timestamp + nível + contexto + mensagem
   * @param level - String do nível (ERROR, WARN, etc.)
   * @param message - Mensagem principal
   * @param context - Contexto opcional com módulo/função
   * @returns string - Mensagem formatada
   */
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context 
      ? `[${context.module}${context.function ? `::${context.function}` : ''}]`
      : '';
    
    return `${timestamp} ${level} ${contextStr} ${message}`;
  }

  /**
   * LOG COM ESTILO VISUAL
   * =====================
   * Aplica cores e estilos em desenvolvimento para melhor legibilidade
   * @param level - Nível do log
   * @param message - Mensagem
   * @param data - Dados adicionais
   * @param style - CSS style para console
   */
  private logWithStyle(level: string, message: string, data?: any, style?: string) {
    if (this.isDevelopment && style) {
      console.log(`%c${message}`, style, data || '');
    } else {
      console.log(message, data || '');
    }
  }

  // ==========================================
  // MÉTODOS PRINCIPAIS DE LOGGING
  // ==========================================

  /**
   * LOG DE ERRO
   * ===========
   * Para erros críticos e exceções
   * Em produção, pode integrar com serviços de monitoramento
   */
  error(message: string, context?: LogContext, error?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const formattedMessage = this.formatMessage('ERROR', message, context);
    console.error(formattedMessage, error || '');
    
    // ==========================================
    // INTEGRAÇÃO COM MONITORAMENTO (FUTURO)
    // ==========================================
    // Em produção, enviar para Sentry, LogRocket, etc.
    if (!this.isDevelopment && error) {
      // TODO: Integrar com Sentry, LogRocket, etc.
      // Exemplo: Sentry.captureException(error, { contexts: { custom: context } });
    }
  }

  /**
   * LOG DE AVISO
   * ============
   * Para situações que merecem atenção mas não são críticas
   */
  warn(message: string, context?: LogContext, data?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const formattedMessage = this.formatMessage('WARN', message, context);
    console.warn(formattedMessage, data || '');
  }

  /**
   * LOG INFORMATIVO
   * ===============
   * Para informações gerais de fluxo da aplicação
   * Cor azul em desenvolvimento para destaque visual
   */
  info(message: string, context?: LogContext, data?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const formattedMessage = this.formatMessage('INFO', message, context);
    this.logWithStyle(formattedMessage, '', data, 'color: #2196F3'); // Azul
  }

  /**
   * LOG DE DEBUG
   * ============
   * Para detalhes técnicos durante desenvolvimento
   * Cor verde em desenvolvimento para fácil identificação
   */
  debug(message: string, context?: LogContext, data?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const formattedMessage = this.formatMessage('DEBUG', message, context);
    this.logWithStyle(formattedMessage, '', data, 'color: #4CAF50'); // Verde
  }

  // ==========================================
  // CONTEXTOS ESPECÍFICOS PARA MÓDULOS
  // ==========================================
  // Facilita logging padronizado por área da aplicação

  /**
   * CONTEXTO DE AUTENTICAÇÃO
   * ========================
   * Logs específicos para login, logout, registro, etc.
   * Inclui emojis para fácil identificação visual
   */
  auth = {
    success: (message: string, userId?: string) => 
      this.info(`🔐 ${message}`, { module: 'Auth', userId }),
    error: (message: string, error?: any) => 
      this.error(`❌ ${message}`, { module: 'Auth' }, error),
    debug: (message: string, data?: any) => 
      this.debug(`🔍 ${message}`, { module: 'Auth' }, data)
  };

  /**
   * CONTEXTO DE API
   * ===============
   * Logs para requests, responses e erros de API
   * Útil para debug de integrações e performance
   */
  api = {
    request: (endpoint: string, method: string) =>
      this.debug(`🚀 ${method} ${endpoint}`, { module: 'API' }),
    response: (endpoint: string, status: number, data?: any) =>
      this.debug(`📥 ${endpoint} - ${status}`, { module: 'API' }, data),
    error: (endpoint: string, error: any) =>
      this.error(`❌ API Error on ${endpoint}`, { module: 'API' }, error)
  };

  /**
   * CONTEXTO DE AGENDAMENTO
   * =======================
   * Logs específicos para sistema de agendamentos
   * Rastreia criação, edição e erros de agendamentos
   */
  agendamento = {
    created: (id: string, data: any) =>
      this.info(`📅 Agendamento criado: ${id}`, { module: 'Agendamento' }, data),
    updated: (id: string, data: any) =>
      this.info(`✏️ Agendamento atualizado: ${id}`, { module: 'Agendamento' }, data),
    deleted: (id: string) =>
      this.info(`🗑️ Agendamento removido: ${id}`, { module: 'Agendamento' }),
    error: (action: string, error: any) =>
      this.error(`❌ Erro no agendamento (${action})`, { module: 'Agendamento' }, error)
  };

  // ==========================================
  // FUTURAS EXPANSÕES DE CONTEXTO
  // ==========================================
  // Adicionar novos contextos conforme necessário:
  // - whatsapp = { sent, error }
  // - payment = { success, failed, pending }
  // - notification = { sent, failed }
}

// ==========================================
// INSTÂNCIA SINGLETON E EXPORTS
// ==========================================

/**
 * INSTÂNCIA GLOBAL DO LOGGER
 * ===========================
 * Singleton pattern garante uma única instância em toda aplicação
 * Importar como: import { logger } from '@/utils/logger'
 */
export const logger = new Logger();

// ==========================================
// FUNÇÕES DE COMPATIBILIDADE
// ==========================================
/**
 * FUNÇÕES LEGACY PARA COMPATIBILIDADE
 * ====================================
 * Mantém compatibilidade com código existente
 * RECOMENDAÇÃO: Migrar gradualmente para logger.debug() e logger.error()
 */
export const debugLog = (message: string, data?: any) => logger.debug(message, undefined, data);
export const debugError = (message: string, error?: any) => logger.error(message, undefined, error);
