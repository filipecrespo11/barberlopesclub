// ==========================================
// ÍNDICE CENTRAL DE UTILITÁRIOS
// ==========================================
// Arquivo: src/utils/index.ts
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Ponto centralizado de exportação para todos os utilitários
// ==========================================

/**
 * SISTEMA CENTRAL DE UTILITÁRIOS - BARBER LOPES CLUB
 * ==================================================
 * 
 * Este arquivo serve como o ponto único de importação para todos
 * os utilitários da aplicação, facilitando o acesso e mantendo
 * uma API consistente em todo o projeto.
 * 
 * FILOSOFIA DO DESIGN:
 * ===================
 * - Ponto único de importação (Barrel Pattern)
 * - Organização por responsabilidade
 * - Tipos exportados junto com implementações
 * - Constantes centralizadas para evitar magic numbers
 * - Tipos utilitários para manipulação de TypeScript
 * 
 * ESTRUTURA DE IMPORTAÇÃO:
 * =======================
 * import { 
 *   logger, 
 *   Validator, 
 *   Formatter, 
 *   notifications,
 *   CONSTANTS 
 * } from '@/utils';
 * 
 * MANUTENÇÃO:
 * ===========
 * - Adicionar novas exportações seguindo a organização existente
 * - Manter constantes atualizadas conforme regras de negócio
 * - Documentar alterações significativas
 * - Testar imports após mudanças na estrutura
 */

// ==========================================
// EXPORTAÇÕES DO SISTEMA DE LOGGING
// ==========================================
// Sistema centralizado de logs com diferentes níveis e contextos
export { logger, debugLog, debugError, LogLevel, type LogContext } from './logger';

// ==========================================
// EXPORTAÇÕES DO SISTEMA DE VALIDAÇÃO
// ==========================================
// Validações robustas para formulários e dados de entrada
export { Validator, type ValidationResult, type ValidationRule } from './validator';

// ==========================================
// EXPORTAÇÕES DO SISTEMA DE FORMATAÇÃO
// ==========================================
// Formatação padronizada para dados brasileiros e internacionais
export { Formatter } from './formatter';

// ==========================================
// EXPORTAÇÕES DO SISTEMA DE NOTIFICAÇÕES
// ==========================================
// Sistema de toast notifications com padrões contextuais
export { notifications, useNotifications, type NotificationOptions, type ToastState } from './notifications';

// ==========================================
// UTILITÁRIOS LEGADOS (COMPATIBILIDADE)
// ==========================================
// Mantidos para compatibilidade com código existente
export { openPopup } from '../app/utils/popup';

// ==========================================
// CONSTANTES CENTRALIZADAS DA APLICAÇÃO
// ==========================================
// Valores padronizados para evitar magic numbers e strings
export const CONSTANTS = {
  // ==========================================
  // PADRÕES REGEX PARA VALIDAÇÃO
  // ==========================================
  // Expressões regulares padronizadas para validação de dados
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,        // Email básico RFC compliant
    PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,        // Telefone brasileiro formatado
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,         // CPF formatado (xxx.xxx.xxx-xx)
    CEP: /^\d{5}-\d{3}$/,                       // CEP formatado (xxxxx-xxx)
  },

  // ==========================================
  // LIMITES DE CAMPOS E VALIDAÇÕES
  // ==========================================
  // Definições de tamanhos máximos e mínimos para campos
  LIMITS: {
    NAME_MAX_LENGTH: 100,      // Nome completo máximo
    EMAIL_MAX_LENGTH: 255,     // Email máximo (padrão RFC)
    MESSAGE_MAX_LENGTH: 500,   // Mensagens de contato
    PHONE_LENGTH: 11,          // Telefone brasileiro (com DDD)
    CPF_LENGTH: 11,            // CPF sem formatação
  },

  // ==========================================
  // HORÁRIOS DE FUNCIONAMENTO
  // ==========================================
  // Configurações padrão para horários da barbearia
  BUSINESS_HOURS: {
    OPEN: '08:00',           // Abertura padrão
    CLOSE: '18:00',          // Fechamento padrão
    LUNCH_START: '12:00',    // Início do almoço
    LUNCH_END: '13:00',      // Fim do almoço
  },

  // ==========================================
  // CONFIGURAÇÕES DE AGENDAMENTO
  // ==========================================
  // Regras de negócio para o sistema de agendamentos
  APPOINTMENT: {
    DURATION_MINUTES: 30,      // Duração padrão de cada serviço
    MIN_ADVANCE_HOURS: 2,      // Antecedência mínima para agendamento
    MAX_ADVANCE_DAYS: 30,      // Antecedência máxima para agendamento
  },

  // ==========================================
  // URLS DE REDES SOCIAIS E EXTERNOS
  // ==========================================
  // Links padronizados para redes sociais e integração WhatsApp
  SOCIAL: {
    WHATSAPP_BASE: 'https://wa.me/',              // Base para links do WhatsApp
    INSTAGRAM: 'https://instagram.com/barberlopesclub',
    FACEBOOK: 'https://facebook.com/barberlopesclub',
  },

  // ==========================================
  // PALETA DE CORES DO SISTEMA
  // ==========================================
  // Cores padronizadas para notificações e estados da UI
  COLORS: {
    PRIMARY: '#F59E0B',    // Dourado/Amarelo principal
    SUCCESS: '#10B981',    // Verde para sucesso
    ERROR: '#EF4444',      // Vermelho para erros
    WARNING: '#F59E0B',    // Amarelo para avisos
    INFO: '#3B82F6',       // Azul para informações
  },
} as const;

// ==========================================
// TIPOS UTILITÁRIOS TYPESCRIPT
// ==========================================
// Tipos auxiliares para manipulação avançada de TypeScript

/**
 * TIPOS UTILITÁRIOS
 * =================
 * 
 * KeyOf<T> - Extrai as chaves de um tipo como union
 * ValueOf<T> - Extrai os valores de um tipo como union
 * Optional<T, K> - Torna propriedades específicas opcionais
 * Required<T, K> - Torna propriedades específicas obrigatórias
 * 
 * EXEMPLOS DE USO:
 * ===============
 * type UserKeys = KeyOf<User>; // 'name' | 'email' | 'id'
 * type Colors = ValueOf<typeof CONSTANTS.COLORS>; // '#F59E0B' | '#10B981' | ...
 * 
 * type OptionalEmail = Optional<User, 'email'>; // email se torna opcional
 * type RequiredName = Required<Partial<User>, 'name'>; // apenas name é obrigatório
 * 
 * MANUTENÇÃO:
 * ===========
 * - Adicionar novos tipos utilitários conforme necessidade
 * - Documentar casos de uso específicos
 * - Testar compatibilidade com TypeScript mais recente
 */
export type KeyOf<T> = keyof T;
export type ValueOf<T> = T[keyof T];
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
