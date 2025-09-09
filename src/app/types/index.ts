// ==========================================
// TIPOS TYPESCRIPT DA APLICAÇÃO (APP)
// ==========================================
// Arquivo: src/app/types/index.ts
// Versão: 1.0
// Última atualização: 2025-09-09
// Autor: Barber Lopes Club Dev Team
// Descrição: Tipos específicos da camada de apresentação (app)
// ==========================================

/**
 * TIPOS DA APLICAÇÃO - BARBER LOPES CLUB
 * ======================================
 * 
 * Definições de tipos específicas para a camada de apresentação
 * da aplicação, incluindo interfaces para componentes, modais,
 * formulários e estados de UI.
 * 
 * DIFERENÇA DOS TIPOS GLOBAIS:
 * ============================
 * - /src/types/api.ts: Contratos de API e backend
 * - /src/app/types/index.ts: Estados de UI e componentes
 * 
 * CATEGORIAS INCLUÍDAS:
 * ====================
 * - Usuários e sessão da aplicação
 * - Dados de formulários e modais
 * - Estados de agendamento na UI
 * - Interfaces de componentes
 * 
 * MANUTENÇÃO:
 * ===========
 * - Manter sincronizado com /src/types/api.ts
 * - Documentar breaking changes
 * - Considerar migração para tipos globais se reutilizados
 * 
 * @author Sistema de Tipos UI - Lopes Club
 * @version 1.0
 * @lastModified 2025-09-09
 */

// ==========================================
// TIPOS DE USUÁRIOS NA APLICAÇÃO
// ==========================================

/**
 * Interface do usuário na camada de apresentação
 * Versão simplificada para componentes e estado local
 */
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  username?: string;
}

// ==========================================
// TIPOS DE FORMULÁRIOS E AUTENTICAÇÃO
// ==========================================

/**
 * Dados de login para autenticação via formulário
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Dados de cadastro de novo usuário
 */
export interface CadastroData {
  nome: string;
  email: string;
  telefone: string;
  password: string;
}

// ==========================================
// TIPOS DE AGENDAMENTO (UI)
// ==========================================

/**
 * Interface de agendamento na camada de apresentação
 * Compatível com diferentes formatos de ID e campos opcionais
 */
export interface AgendamentoData {
  id?: string | number;
  _id?: string;
  nome: string;
  telefone: string;
  servico: string;
  data: string;
  horario: string;
  hora?: string;
  usuario_id?: string;
}

// ==========================================
// TIPOS DE RESPOSTA DE API (UI)
// ==========================================

/**
 * Resposta padrão da API para operações na UI
 * Genérica para suportar diferentes tipos de dados
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  codigo_dev?: string;
}

// ==========================================
// TIPOS DE SERVIÇOS
// ==========================================

/**
 * Interface de serviços oferecidos pela barbearia
 */
export interface Servico {
  id: string;
  nome: string;
  preco: string;
}
