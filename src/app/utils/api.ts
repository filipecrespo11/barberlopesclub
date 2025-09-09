// ==========================================
// CLIENTE API CENTRALIZADO
// ==========================================
// Arquivo: src/app/utils/api.ts
// Versão: 2.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Cliente HTTP centralizado com autenticação automática
// ==========================================

/**
 * SISTEMA CLIENTE API - BARBER LOPES CLUB
 * =======================================
 * 
 * Cliente HTTP centralizado para todas as comunicações com a API,
 * incluindo autenticação automática, tratamento de erros padronizado
 * e logging detalhado para debugging.
 * 
 * ARQUITETURA:
 * ===========
 * - Função base `apiRequest` para todas as chamadas HTTP
 * - Funções específicas para cada endpoint da aplicação
 * - Autenticação automática via Bearer token
 * - Sistema de logging integrado para debugging
 * - Tratamento de erros padronizado
 * 
 * CARACTERÍSTICAS:
 * ===============
 * - Detecção automática de endpoints públicos/privados
 * - Refresh automático de tokens (futuro)
 * - Retry automático em caso de falhas (futuro)
 * - Cache de requisições (futuro)
 * - Offline support (futuro)
 * 
 * MANUTENÇÃO:
 * ===========
 * - Todas as URLs são centralizadas em APP_CONFIG
 * - Tipos TypeScript garantem type safety
 * - Logs detalhados facilitam debugging
 * - Estrutura modular para fácil extensão
 */

import { APP_CONFIG } from '@/config/app';
import { logger } from '@/utils/logger';
import type { 
  LoginCredentials, 
  LoginResponse, 
  CadastroData, 
  AgendamentoData, 
  Agendamento, 
  ApiResponse,
  GoogleOAuthConfig,
  AdminData 
} from '@/types/api';

// ==========================================
// FUNÇÕES AUXILIARES DE AUTENTICAÇÃO
// ==========================================

/**
 * VERIFICAÇÃO DE ENDPOINTS PÚBLICOS
 * =================================
 * 
 * Determina se um endpoint é público (não requer autenticação)
 * baseado na configuração central da aplicação.
 * 
 * ENDPOINTS PÚBLICOS TÍPICOS:
 * - /auth/login
 * - /auth/cadastro
 * - /auth/google-config
 * - /public/*
 * 
 * @param endpoint - Caminho do endpoint a ser verificado
 * @returns boolean - true se for público, false se requer autenticação
 */
const isPublicEndpoint = (endpoint: string): boolean => {
  return APP_CONFIG.auth.publicEndpoints.some(publicEndpoint => 
    endpoint.includes(publicEndpoint)
  );
};

/**
 * OBTENÇÃO DE TOKEN DE AUTENTICAÇÃO
 * =================================
 * 
 * Recupera o token JWT armazenado no localStorage.
 * Protegido contra execução server-side (SSR).
 * 
 * @returns string | null - Token se existe, null caso contrário
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(APP_CONFIG.auth.tokenKey);
};

// ==========================================
// FUNÇÃO BASE PARA REQUISIÇÕES HTTP
// ==========================================

/**
 * CLIENTE HTTP PRINCIPAL
 * ======================
 * 
 * Função base para todas as chamadas à API com:
 * - Autenticação automática via Bearer token
 * - Logging detalhado para debugging
 * - Tratamento de erros padronizado
 * - Suporte a diferentes tipos de conteúdo
 * - Headers customizáveis
 * 
 * FLUXO DE EXECUÇÃO:
 * ==================
 * 1. Monta URL completa baseada no endpoint
 * 2. Configura headers padrão (Content-Type, etc.)
 * 3. Adiciona token de autenticação se necessário
 * 4. Executa requisição HTTP com logging
 * 5. Processa resposta e trata erros
 * 6. Retorna dados tipados
 * 
 * TRATAMENTO DE ERROS:
 * ===================
 * - 401: Token inválido/expirado
 * - 403: Acesso negado
 * - 404: Recurso não encontrado
 * - 422: Dados inválidos
 * - 500: Erro interno do servidor
 * - Network: Problemas de conectividade
 * 
 * @param endpoint - Caminho relativo da API (ex: '/auth/login')
 * @param options - Opções fetch() com extensões customizadas
 * @returns Promise<T> - Dados da resposta tipados
 */
export const apiRequest = async <T = any>(
  endpoint: string, 
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> => {
  // ==========================================
  // CONFIGURAÇÃO INICIAL DA REQUISIÇÃO
  // ==========================================
  const url = `${APP_CONFIG.api.baseURL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // ==========================================
  // CONFIGURAÇÃO DE AUTENTICAÇÃO
  // ==========================================
  // Adiciona token JWT automaticamente se necessário
  const skipAuth = options.skipAuth === true;
  if (!isPublicEndpoint(endpoint) && !skipAuth) {
    const token = getAuthToken();
    
    if (token) {
      logger.debug('🔑 Request autenticado', { module: 'API', function: 'apiRequest' }, { endpoint });
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,        // Padrão OAuth2
        'x-access-token': token,                   // Header customizado para compatibilidade
      };
    } else {
      logger.error('⚠️ Token não encontrado', { module: 'API', function: 'apiRequest' }, { endpoint });
    }
  }

  try {
    // ==========================================
    // EXECUÇÃO DA REQUISIÇÃO HTTP
    // ==========================================
    logger.debug('🚀 Fazendo requisição', { module: 'API' }, { 
      url, 
      method: defaultOptions.method || 'GET' 
    });
    
    const response = await fetch(url, defaultOptions);
    
    logger.debug('📥 Resposta recebida', { module: 'API' }, { 
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });

    // ==========================================
    // TRATAMENTO DE ERROS HTTP
    // ==========================================
    if (!response.ok) {
      let errorData: any = null;
      try {
        const text = await response.text();
        if (text) {
          errorData = JSON.parse(text);
        }
      } catch {
        // Se não conseguir parsear, cria erro padrão
        errorData = { message: `Erro ${response.status}: ${response.statusText}` };
      }
      
      logger.error('❌ Erro na resposta', { module: 'API' }, { status: response.status, errorData });
      
      // Mensagens de erro contextuais
      const errorMessage = (errorData?.message || errorData?.error) ||
        (response.status === 401 ? 'Usuário não autenticado. Faça login novamente.' : 
         `Erro no servidor (${response.status})`);
      
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // ==========================================
    // PROCESSAMENTO DA RESPOSTA
    // ==========================================
    const text = await response.text();
    if (!text || text.trim() === '') {
      logger.debug('✅ Resposta vazia - retornando objeto vazio', { module: 'API' });
      return {} as T;
    }
    
    try {
      const data = JSON.parse(text);
      logger.debug('✅ Request concluído com sucesso', { module: 'API' }, { data });
      return data;
    } catch (jsonError) {
      logger.error('❌ Erro ao parsear JSON', { module: 'API' }, { jsonError, text });
      throw new Error('Resposta do servidor não é um JSON válido');
    }
  } catch (error) {
    // ==========================================
    // TRATAMENTO DE ERROS DE REDE
    // ==========================================
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar com o servidor.');
    }
    throw error;
  }
};

// ==========================================
// FUNÇÕES ESPECÍFICAS DA API
// ==========================================
// Funções especializadas para cada domínio da aplicação
// organizadas por contexto e responsabilidade

// ==========================================
// DOMÍNIO: AUTENTICAÇÃO
// ==========================================
// Funções para login, cadastro, verificação e OAuth

/**
 * AUTENTICAÇÃO DE USUÁRIO
 * =======================
 * Realiza login com email/senha e retorna token JWT
 * 
 * @param credentials - Email e senha do usuário
 * @returns Promise<LoginResponse> - Token e dados do usuário
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return await apiRequest<LoginResponse>(APP_CONFIG.api.endpoints.auth.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
};

/**
 * CADASTRO DE NOVO USUÁRIO
 * ========================
 * Inicia processo de cadastro enviando código de verificação
 * 
 * @param data - Dados do usuário para cadastro
 * @returns Promise<ApiResponse> - Status da operação
 */
export const cadastrarUsuario = async (data: CadastroData): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.auth.cadastro, {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
};

/**
 * VERIFICAÇÃO DE CÓDIGO DE CONFIRMAÇÃO
 * ====================================
 * Verifica código enviado por email durante cadastro
 * 
 * @param data - Email e código de verificação
 * @returns Promise<ApiResponse> - Status da verificação
 */
export const verificarCodigo = async (data: { email: string; codigo: string }): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.auth.verificarCodigo, {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
};

/**
 * ATUALIZAÇÃO DE TELEFONE
 * =======================
 * Atualiza número de telefone do usuário autenticado
 * 
 * @param data - Novo número de telefone
 * @returns Promise<ApiResponse> - Status da atualização
 */
export const atualizarTelefone = async (data: { telefone: string }): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.auth.atualizarTelefone, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ==========================================
// DOMÍNIO: GOOGLE OAUTH
// ==========================================
// Integração com autenticação Google

/**
 * CONFIGURAÇÃO DO GOOGLE OAUTH
 * ============================
 * Obtém configurações necessárias para OAuth Google
 * 
 * @returns Promise<GoogleOAuthConfig> - Client ID e URLs
 */
export const getGoogleOAuthConfig = async (): Promise<GoogleOAuthConfig> => {
  return await apiRequest<GoogleOAuthConfig>(APP_CONFIG.api.endpoints.auth.googleConfig, {
    skipAuth: true,
  });
};

/**
 * CALLBACK DO GOOGLE OAUTH
 * ========================
 * Processa código de autorização recebido do Google
 * 
 * @param code - Código de autorização do Google
 * @returns Promise<LoginResponse> - Token e dados do usuário
 */
export const handleGoogleCallback = async (code: string): Promise<LoginResponse> => {
  return await apiRequest<LoginResponse>(APP_CONFIG.api.endpoints.auth.googleCallback, {
    method: 'POST',
    body: JSON.stringify({ code }),
    skipAuth: true,
  });
};

// ==========================================
// DOMÍNIO: AGENDAMENTOS
// ==========================================
// CRUD completo para sistema de agendamentos da barbearia

/**
 * CRIAÇÃO DE AGENDAMENTO
 * ======================
 * Cria novo agendamento para usuário autenticado
 * 
 * @param data - Dados do agendamento (data, horário, serviço)
 * @returns Promise<Agendamento> - Agendamento criado com ID
 */
export const criarAgendamento = async (data: AgendamentoData): Promise<Agendamento> => {
  return await apiRequest<Agendamento>(APP_CONFIG.api.endpoints.agendamentos.criar, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * LISTAGEM DE AGENDAMENTOS
 * ========================
 * Lista todos os agendamentos do usuário autenticado
 * 
 * @returns Promise<Agendamento[]> - Array com agendamentos
 */
export const listarAgendamentos = async (): Promise<Agendamento[]> => {
  return await apiRequest<Agendamento[]>(APP_CONFIG.api.endpoints.agendamentos.listar);
};

/**
 * ATUALIZAÇÃO DE AGENDAMENTO
 * ==========================
 * Atualiza dados de agendamento existente
 * 
 * @param id - ID do agendamento
 * @param data - Dados parciais para atualização
 * @returns Promise<Agendamento> - Agendamento atualizado
 */
export const atualizarAgendamento = async (id: string | number, data: Partial<AgendamentoData>): Promise<Agendamento> => {
  return await apiRequest<Agendamento>(APP_CONFIG.api.endpoints.agendamentos.atualizar(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * REMOÇÃO DE AGENDAMENTO
 * ======================
 * Remove/cancela agendamento existente
 * 
 * @param id - ID do agendamento a remover
 * @returns Promise<ApiResponse> - Status da operação
 */
export const removerAgendamento = async (id: string | number): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.agendamentos.remover(id), {
    method: 'DELETE',
  });
};

// ==========================================
// DOMÍNIO: USUÁRIOS
// ==========================================
// Operações administrativas para gestão de usuários

/**
 * LISTAGEM DE USUÁRIOS (ADMIN)
 * ============================
 * Lista todos os usuários cadastrados (apenas admin)
 * 
 * @returns Promise<any[]> - Array com usuários
 */
export const listarUsuarios = async (): Promise<any[]> => {
  return await apiRequest<any[]>(APP_CONFIG.api.endpoints.usuarios.listar);
};

/**
 * CRIAÇÃO DE USUÁRIO (ADMIN)
 * ==========================
 * Cria novo usuário via painel administrativo
 * 
 * @param data - Dados do usuário
 * @returns Promise<ApiResponse> - Status da criação
 */
export const criarUsuario = async (data: any): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.usuarios.criar, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ==========================================
// DOMÍNIO: ADMINISTRAÇÃO
// ==========================================
// Operações específicas do painel administrativo

/**
 * CRIAÇÃO DE ADMINISTRADOR
 * ========================
 * Cria novo usuário com privilégios administrativos
 * 
 * @param data - Dados do administrador
 * @returns Promise<ApiResponse> - Status da criação
 */
export const criarAdmin = async (data: AdminData): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.admin.criarAdmin, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ==========================================
// FUNÇÕES UTILITÁRIAS DE SESSÃO
// ==========================================
// Operações auxiliares para gerenciamento de sessão

/**
 * LOGOUT DO USUÁRIO
 * =================
 * Remove token de autenticação e limpa sessão local
 * 
 * AÇÕES REALIZADAS:
 * - Remove token do localStorage
 * - Registra logout no sistema de logs
 * - Prepara estado para nova autenticação
 * 
 * USO RECOMENDADO:
 * Chamar sempre que usuário fizer logout manual ou
 * quando token expirar (401 response)
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(APP_CONFIG.auth.tokenKey);
    if (APP_CONFIG.dev.enableLogs) {
      logger.auth.success('Usuário deslogado');
    }
  }
};

/**
 * VERIFICAÇÃO DE AUTENTICAÇÃO
 * ===========================
 * Verifica se usuário possui token válido armazenado
 * 
 * NOTA: Esta função apenas verifica a existência do token,
 * não valida se o token ainda é válido no servidor.
 * 
 * @returns boolean - true se token existe, false caso contrário
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

// ==========================================
// INTEGRAÇÕES EXTERNAS
// ==========================================
// Funções para integração com serviços externos

/**
 * REDIRECIONAMENTO PARA WHATSAPP
 * ==============================
 * Abre conversa do WhatsApp com número da barbearia
 * incluindo mensagem padrão pré-configurada
 * 
 * FUNCIONALIDADES:
 * - Codifica mensagem para URL-safe
 * - Abre em nova aba/janela
 * - Funciona em desktop e mobile
 * 
 * CONFIGURAÇÃO:
 * Número e mensagem são definidos em APP_CONFIG.whatsapp
 */
export const redirectToWhatsApp = (): void => {
  const message = encodeURIComponent(APP_CONFIG.whatsapp.defaultMessage);
  const url = `https://wa.me/${APP_CONFIG.whatsapp.number}?text=${message}`;
  window.open(url, '_blank');
};
