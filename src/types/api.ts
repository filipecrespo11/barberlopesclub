// ==========================================
// TIPOS DA API REST
// ==========================================
// Arquivo: src/types/api.ts
// Versão: 2.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Definições de tipos para comunicação com API
// ==========================================

/**
 * API TYPES - BARBER LOPES CLUB
 * ==============================
 * 
 * Definições TypeScript para todos os contratos de API,
 * incluindo requests, responses e modelos de dados
 * utilizados na comunicação client-server.
 * 
 * ORGANIZAÇÃO:
 * ============
 * - Credenciais e autenticação
 * - Dados de cadastro e perfil
 * - Sistema de agendamentos
 * - Respostas padronizadas da API
 * - Integração OAuth Google
 * - Modelos de dados administrativos
 * 
 * COMPATIBILIDADE:
 * ===============
 * - Sincronizado com modelos do backend
 * - Versionamento para breaking changes
 * - Validação em runtime via zod/joi
 * - Documentação automática via OpenAPI
 * 
 * MANUTENÇÃO:
 * ===========
 * - Manter alinhado com contratos da API
 * - Versionar mudanças que quebrem compatibilidade
 * - Adicionar validações onde necessário
 * - Documentar campos opcionais vs obrigatórios
 */

// ==========================================
// TIPOS DE AUTENTICAÇÃO
// ==========================================

/**
 * CREDENCIAIS DE LOGIN
 * ===================
 * 
 * Dados necessários para autenticação tradicional
 * via username/password.
 * 
 * VALIDAÇÕES:
 * - username: Não pode estar vazio
 * - password: Mínimo 6 caracteres
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * RESPOSTA DE LOGIN SUCCESSFUL
 * ============================
 * 
 * Estrutura retornada após autenticação bem-sucedida
 * contendo token JWT e dados completos do usuário.
 */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome_completo: string;
    username: string;
    email: string;
    tel: string;
    isAdmin?: boolean;
  };
}

// ==========================================
// TIPOS DE CADASTRO E PERFIL
// ==========================================

/**
 * DADOS PARA CADASTRO
 * ===================
 * 
 * Informações necessárias para criar nova conta.
 * Password é opcional pois pode vir do Google OAuth.
 */
export interface CadastroData {
  nome_completo: string;
  email: string;
  tel: string;
  password?: string;
}

// ==========================================
// TIPOS DO SISTEMA DE AGENDAMENTOS
// ==========================================

/**
 * DADOS DE AGENDAMENTO
 * ====================
 * 
 * Estrutura para criação de novos agendamentos
 * com informações completas do cliente e serviço.
 */
export interface AgendamentoData {
  nome: string;
  telefone: string;
  servico: string;
  data: string;
  horario: string;
  observacoes?: string;
  preco?: number;
}

/**
 * AGENDAMENTO COMPLETO
 * ===================
 * 
 * Modelo completo de agendamento incluindo
 * metadados do sistema e controle de status.
 */
export interface Agendamento extends AgendamentoData {
  id: string;
  _id: string;
  usuarioId: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// TIPOS DE RESPOSTA PADRONIZADAS
// ==========================================

/**
 * RESPOSTA PADRÃO DA API
 * ======================
 * 
 * Template genérico para todas as respostas,
 * garantindo consistência na estrutura de dados.
 * 
 * @template T - Tipo dos dados retornados
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  agendamento?: T;        // Campo específico para endpoints de agendamento
  message?: string;
  error?: string;
}

// ==========================================
// TIPOS DE INTEGRAÇÃO OAUTH
// ==========================================

/**
 * CONFIGURAÇÃO DO GOOGLE OAUTH
 * ============================
 * 
 * Configurações dinâmicas para autenticação Google,
 * obtidas do servidor para maior segurança.
 */
export interface GoogleOAuthConfig {
  clientId: string;
}

// ==========================================
// TIPOS ADMINISTRATIVOS
// ==========================================

/**
 * DADOS PARA CRIAÇÃO DE ADMIN
 * ===========================
 * 
 * Estrutura completa para criação de usuário
 * com privilégios administrativos.
 * 
 * RESTRIÇÕES:
 * - Apenas admins existentes podem criar novos admins
 * - Todos os campos são obrigatórios
 * - Username deve ser único no sistema
 */
export interface AdminData {
  nome_completo: string;
  username: string;
  password: string;
  tel: string;
  email: string;
}
