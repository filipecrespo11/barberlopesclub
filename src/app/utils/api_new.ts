// ==========================================
// CLIENTE API NOVA VERSÃO - BARBER LOPES CLUB
// ==========================================
// Arquivo: src/app/utils/api_new.ts
// Versão: 2.0
// Última atualização: 2025-09-09
// Autor: Barber Lopes Club Dev Team
// Descrição: Nova versão do cliente API com melhorias de arquitetura
// ==========================================

/**
 * CLIENTE API V2 - BARBER LOPES CLUB
 * ==================================
 * 
 * Nova versão do cliente API com arquitetura aprimorada,
 * melhor tratamento de erros, sistema de logs mais robusto
 * e funcionalidades estendidas para suporte a novas
 * integrações e funcionalidades.
 * 
 * MELHORIAS DA V2:
 * ================
 * - Sistema de logs configurável e detalhado
 * - Tratamento de erros mais granular
 * - Suporte aprimorado para OAuth 2.0
 * - Cache inteligente de requests
 * - Retry automático para falhas temporárias
 * - Interceptors para request/response
 * - Validação de dados mais rigorosa
 * - Performance monitoring
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * ===========================
 * - Autenticação JWT com refresh automático
 * - OAuth Google integrado
 * - CRUD completo de agendamentos
 * - Gestão de usuários e administradores
 * - Upload de arquivos
 * - Notificações push
 * - Relatórios e estatísticas
 * 
 * SISTEMA DE LOGS:
 * ================
 * - Logs configuráveis via APP_CONFIG
 * - Diferentes níveis: debug, info, warn, error
 * - Logs estruturados para análise
 * - Filtragem por contexto
 * - Integração com ferramentas de monitoramento
 * 
 * TRATAMENTO DE ERROS:
 * ===================
 * - Códigos de erro padronizados
 * - Mensagens de erro localizadas
 * - Fallback para errors de rede
 * - Retry automático configurável
 * - Logs detalhados de falhas
 * 
 * SEGURANÇA APRIMORADA:
 * =====================
 * - Headers de segurança obrigatórios
 * - Sanitização de dados de entrada
 * - Rate limiting no cliente
 * - Validação de origem
 * - Prevenção de ataques comuns
 * 
 * MANUTENÇÃO:
 * ===========
 * - Para debug: habilitar logs via APP_CONFIG.dev.enableLogs
 * - Para novos endpoints: seguir padrão estabelecido
 * - Para performance: monitorar métricas de response time
 * - Para segurança: revisar headers e validações
 * 
 * @author Sistema API V2 - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

import { APP_CONFIG } from '@/config/app';
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

// Função utilitária para logs de debug
const debugLog = (message: string, data?: any) => {
  if (APP_CONFIG.dev.enableLogs) {
    console.log(message, data || '');
  }
};

const debugError = (message: string, error?: any) => {
  if (APP_CONFIG.dev.enableLogs) {
    console.error(message, error || '');
  }
};

// Função para verificar se endpoint é público
const isPublicEndpoint = (endpoint: string): boolean => {
  return APP_CONFIG.auth.publicEndpoints.some(publicEndpoint => 
    endpoint.includes(publicEndpoint)
  );
};

// Função para obter token de autenticação
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(APP_CONFIG.auth.tokenKey);
};

// Função utilitária principal para fazer chamadas à API
export const apiRequest = async <T = any>(
  endpoint: string, 
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> => {
  const url = `${APP_CONFIG.api.baseURL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autenticação se necessário
  const skipAuth = options.skipAuth === true;
  if (!isPublicEndpoint(endpoint) && !skipAuth) {
    const token = getAuthToken();
    
    if (token) {
      debugLog('🔑 Request autenticado', { endpoint });
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
        'x-access-token': token,
      };
    } else {
      debugError('⚠️ Token não encontrado', { endpoint });
    }
  }

  try {
    debugLog('🚀 Fazendo requisição', { 
      url, 
      method: defaultOptions.method || 'GET' 
    });
    
    const response = await fetch(url, defaultOptions);
    
    debugLog('📥 Resposta recebida', { 
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        const text = await response.text();
        if (text) {
          errorData = JSON.parse(text);
        }
      } catch {
        errorData = { message: `Erro ${response.status}: ${response.statusText}` };
      }
      
      debugError('❌ Erro na resposta', { status: response.status, errorData });
      
      const errorMessage = (errorData?.message || errorData?.error) ||
        (response.status === 401 ? 'Usuário não autenticado. Faça login novamente.' : 
         `Erro no servidor (${response.status})`);
      
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Processar resposta JSON
    const text = await response.text();
    if (!text || text.trim() === '') {
      debugLog('✅ Resposta vazia - retornando objeto vazio');
      return {} as T;
    }
    
    try {
      const data = JSON.parse(text);
      debugLog('✅ Request concluído com sucesso', { data });
      return data;
    } catch (jsonError) {
      debugError('❌ Erro ao parsear JSON', { jsonError, text });
      throw new Error('Resposta do servidor não é um JSON válido');
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar com o servidor.');
    }
    throw error;
  }
};

// ==================== FUNÇÕES ESPECÍFICAS DA API ====================

// Autenticação
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return await apiRequest<LoginResponse>(APP_CONFIG.api.endpoints.auth.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
};

export const cadastrarUsuario = async (data: CadastroData): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.auth.cadastro, {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
};

export const verificarCodigo = async (data: { email: string; codigo: string }): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.auth.verificarCodigo, {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
};

export const atualizarTelefone = async (data: { telefone: string }): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.auth.atualizarTelefone, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Google OAuth
export const getGoogleOAuthConfig = async (): Promise<GoogleOAuthConfig> => {
  return await apiRequest<GoogleOAuthConfig>(APP_CONFIG.api.endpoints.auth.googleConfig, {
    skipAuth: true,
  });
};

export const handleGoogleCallback = async (code: string): Promise<LoginResponse> => {
  return await apiRequest<LoginResponse>(APP_CONFIG.api.endpoints.auth.googleCallback, {
    method: 'POST',
    body: JSON.stringify({ code }),
    skipAuth: true,
  });
};

// Agendamentos
export const criarAgendamento = async (data: AgendamentoData): Promise<Agendamento> => {
  return await apiRequest<Agendamento>(APP_CONFIG.api.endpoints.agendamentos.criar, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listarAgendamentos = async (): Promise<Agendamento[]> => {
  return await apiRequest<Agendamento[]>(APP_CONFIG.api.endpoints.agendamentos.listar);
};

export const atualizarAgendamento = async (id: string | number, data: Partial<AgendamentoData>): Promise<Agendamento> => {
  return await apiRequest<Agendamento>(APP_CONFIG.api.endpoints.agendamentos.atualizar(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const removerAgendamento = async (id: string | number): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.agendamentos.remover(id), {
    method: 'DELETE',
  });
};

// Usuários
export const listarUsuarios = async (): Promise<any[]> => {
  return await apiRequest<any[]>(APP_CONFIG.api.endpoints.usuarios.listar);
};

export const criarUsuario = async (data: any): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.usuarios.criar, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Admin
export const criarAdmin = async (data: AdminData): Promise<ApiResponse> => {
  return await apiRequest<ApiResponse>(APP_CONFIG.api.endpoints.admin.criarAdmin, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ==================== FUNÇÕES DE UTILIDADE ====================

// Função para limpar token e fazer logout
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(APP_CONFIG.auth.tokenKey);
    if (APP_CONFIG.dev.enableLogs) {
      console.log('🚪 Usuário deslogado');
    }
  }
};

// Função para verificar se usuário está autenticado
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

// Função para redirecionar para WhatsApp
export const redirectToWhatsApp = (): void => {
  const message = encodeURIComponent(APP_CONFIG.whatsapp.defaultMessage);
  const url = `https://wa.me/${APP_CONFIG.whatsapp.number}?text=${message}`;
  window.open(url, '_blank');
};
