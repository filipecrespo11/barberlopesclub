// ==========================================
// SERVIÇO DE AUTENTICAÇÃO
// ==========================================
// Arquivo: src/services/authService.ts
// Versão: 2.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Serviço centralizado para operações de autenticação
// ==========================================

/**
 * AUTHENTICATION SERVICE - BARBER LOPES CLUB
 * ===========================================
 * 
 * Serviço centralizado que encapsula todas as operações relacionadas
 * à autenticação de usuários, incluindo login tradicional, OAuth Google,
 * cadastro, verificação e gestão de sessões.
 * 
 * RESPONSABILIDADES:
 * =================
 * - Login via email/senha
 * - Integração OAuth Google
 * - Cadastro de novos usuários
 * - Verificação de código por email
 * - Gestão de tokens JWT
 * - Atualização de dados do usuário
 * - Criação de administradores
 * - Logout e limpeza de sessão
 * 
 * ARQUITETURA:
 * ============
 * - Padrão Service Layer para lógica de negócio
 * - Comunicação via API REST
 * - Gerenciamento de estado no localStorage
 * - Logging estruturado para debug
 * - Error handling padronizado
 * 
 * SEGURANÇA:
 * ==========
 * - Tokens JWT para autenticação
 * - Validação client-side e server-side
 * - Sanitização de dados de entrada
 * - Headers de segurança configurados
 * - Logout automático em caso de token inválido
 * 
 * MANUTENÇÃO:
 * ===========
 * - Monitorar logs de autenticação
 * - Atualizar configurações OAuth conforme APIs
 * - Validar compatibilidade com diferentes navegadores
 * - Testar fluxos completos regularmente
 */

import { 
  loginUser, 
  cadastrarUsuario, 
  verificarCodigo, 
  atualizarTelefone,
  getGoogleOAuthConfig,
  handleGoogleCallback,
  logout as apiLogout,
  isAuthenticated as checkAuth,
  criarAdmin as apiCriarAdmin
} from '@/app/utils/api';

import type { 
  LoginCredentials, 
  LoginResponse, 
  CadastroData, 
  ApiResponse,
  GoogleOAuthConfig,
  AdminData 
} from '@/types/api';

import { APP_CONFIG } from '@/config/app';
import { logger } from '@/utils';

/**
 * CLASSE PRINCIPAL DO SERVIÇO DE AUTENTICAÇÃO
 * ===========================================
 * 
 * Implementa padrão de Service Layer com métodos estáticos
 * para facilitar o uso em diferentes contextos da aplicação.
 */
export class AuthService {
  
  // ==========================================
  // AUTENTICAÇÃO TRADICIONAL (EMAIL/SENHA)
  // ==========================================
  
  /**
   * REALIZA LOGIN DO USUÁRIO
   * ========================
   * 
   * Autentica usuário via email/senha e gerencia a sessão
   * local salvando o token JWT para requisições futuras.
   * 
   * FLUXO:
   * 1. Valida credenciais no servidor
   * 2. Recebe token JWT e dados do usuário
   * 3. Salva token no localStorage
   * 4. Registra login no sistema de logs
   * 
   * @param credentials - Email e senha do usuário
   * @returns Promise<LoginResponse> - Token e dados do usuário
   * @throws Error - Em caso de credenciais inválidas ou erro de rede
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await loginUser(credentials);
      
      if (response.token) {
        this.saveToken(response.token);
      }
      
      return response;
    } catch (error) {
      logger.auth.error('Erro no login', error);
      throw error;
    }
  }

  // ==========================================
  // CADASTRO E VERIFICAÇÃO DE USUÁRIOS
  // ==========================================

  /**
   * INICIA PROCESSO DE CADASTRO
   * ===========================
   * 
   * Cria nova conta de usuário enviando código de verificação
   * por email. Usuário deve confirmar email antes de poder
   * fazer login na aplicação.
   * 
   * FLUXO:
   * 1. Valida dados de entrada
   * 2. Cria registro temporário no servidor
   * 3. Envia código de verificação por email
   * 4. Retorna status da operação
   * 
   * @param data - Dados completos do usuário (nome, email, senha, etc.)
   * @returns Promise<ApiResponse> - Status da criação
   * @throws Error - Se dados inválidos ou email já cadastrado
   */
  static async iniciarCadastro(data: CadastroData): Promise<ApiResponse> {
    try {
      return await cadastrarUsuario(data);
    } catch (error) {
      logger.auth.error('Erro no cadastro', error);
      throw error;
    }
  }

  /**
   * VERIFICA CÓDIGO DE CONFIRMAÇÃO
   * ==============================
   * 
   * Confirma cadastro através do código enviado por email,
   * ativando definitivamente a conta do usuário.
   * 
   * @param email - Email do usuário cadastrado
   * @param codigo - Código de 6 dígitos recebido por email
   * @returns Promise<ApiResponse> - Status da verificação
   * @throws Error - Se código inválido ou expirado
   */
  static async verificarCodigo(email: string, codigo: string): Promise<ApiResponse> {
    try {
      return await verificarCodigo({ email, codigo });
    } catch (error) {
      logger.auth.error('Erro na verificação', error);
      throw error;
    }
  }

  /**
   * ATUALIZA TELEFONE DO USUÁRIO
   * ============================
   * 
   * Atualiza número de telefone de usuário já autenticado.
   * Especialmente útil para usuários que fizeram login via Google
   * e precisam informar o telefone posteriormente.
   * 
   * @param telefone - Número no formato (11) 99999-9999
   * @returns Promise<ApiResponse> - Status da atualização
   * @throws Error - Se token inválido ou formato incorreto
   */
  static async atualizarTelefone(telefone: string): Promise<ApiResponse> {
    try {
      return await atualizarTelefone({ telefone });
    } catch (error) {
      logger.auth.error('Erro ao atualizar telefone', error);
      throw error;
    }
  }

  // ==========================================
  // INTEGRAÇÃO GOOGLE OAUTH
  // ==========================================

  /**
   * OBTÉM CONFIGURAÇÃO DO GOOGLE OAUTH
   * ==================================
   * 
   * Busca configurações necessárias para inicializar
   * o fluxo de autenticação Google OAuth, incluindo
   * Client ID e URLs de callback.
   * 
   * SEGURANÇA:
   * - Client ID é público mas restrito por domínio
   * - Configuração dinâmica impede hardcoding
   * - Permite diferentes configs por ambiente
   * 
   * @returns Promise<GoogleOAuthConfig> - Configurações do OAuth
   * @throws Error - Se serviço indisponível
   */
  static async getGoogleConfig(): Promise<GoogleOAuthConfig> {
    try {
      return await getGoogleOAuthConfig();
    } catch (error) {
      logger.auth.error('Erro ao obter config Google', error);
      throw error;
    }
  }

  /**
   * PROCESSA CALLBACK DO GOOGLE OAUTH
   * =================================
   * 
   * Processa código de autorização retornado pelo Google
   * após usuário autorizar acesso à aplicação. Converte
   * código em token JWT válido para autenticação.
   * 
   * FLUXO:
   * 1. Recebe código de autorização via popup/redirect
   * 2. Envia código para backend validar com Google
   * 3. Backend retorna token JWT + dados do usuário
   * 4. Salva token localmente para sessão
   * 
   * @param code - Código de autorização do Google
   * @returns Promise<LoginResponse> - Token e dados do usuário
   * @throws Error - Se código inválido ou expirado
   */
  static async processGoogleCallback(code: string): Promise<LoginResponse> {
    try {
      const response = await handleGoogleCallback(code);
      
      if (response.token) {
        this.saveToken(response.token);
      }
      
      return response;
    } catch (error) {
      logger.auth.error('Erro no callback Google', error);
      throw error;
    }
  }

  // ==========================================
  // OPERAÇÕES ADMINISTRATIVAS
  // ==========================================

  /**
   * CRIA NOVO ADMINISTRADOR
   * =======================
   * 
   * Cria conta de usuário com privilégios administrativos.
   * Operação restrita apenas para administradores existentes.
   * 
   * PERMISSÕES:
   * - Apenas admins podem criar outros admins
   * - Validação de token com privilégios elevados
   * - Log detalhado da operação para auditoria
   * 
   * @param data - Dados do novo administrador
   * @returns Promise<ApiResponse> - Status da criação
   * @throws Error - Se sem permissão ou dados inválidos
   */
  static async criarAdmin(data: AdminData): Promise<ApiResponse> {
    try {
      return await apiCriarAdmin(data);
    } catch (error) {
      logger.auth.error('Erro ao criar admin', error);
      throw error;
    }
  }

  // ==========================================
  // GERENCIAMENTO DE TOKENS JWT
  // ==========================================

  /**
   * SALVA TOKEN NO ARMAZENAMENTO LOCAL
   * ==================================
   * 
   * Armazena token JWT no localStorage para persistência
   * da sessão entre recarregamentos da página.
   * 
   * SEGURANÇA:
   * - Verifica disponibilidade do window (SSR safe)
   * - Token é httpOnly no servidor para maior segurança
   * - Cliente mantém cópia para requisições AJAX
   * 
   * @param token - Token JWT válido
   */
  static saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(APP_CONFIG.auth.tokenKey, token);
    }
  }

  /**
   * OBTÉM TOKEN DO ARMAZENAMENTO LOCAL
   * =================================
   * 
   * Recupera token JWT salvo para uso em requisições
   * autenticadas à API.
   * 
   * @returns string | null - Token se encontrado, null caso contrário
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(APP_CONFIG.auth.tokenKey);
    }
    return null;
  }

  /**
   * REALIZA LOGOUT COMPLETO
   * =======================
   * 
   * Remove token do localStorage e limpa sessão do usuário.
   * Chama também logout na API para invalidar token no servidor.
   */
  static logout(): void {
    apiLogout();
  }

  /**
   * VERIFICA STATUS DE AUTENTICAÇÃO
   * ===============================
   * 
   * Determina se usuário possui sessão válida baseado
   * na existência do token local.
   * 
   * NOTA: Apenas verifica existência, não valida se token
   * ainda é válido no servidor.
   * 
   * @returns boolean - true se autenticado, false caso contrário
   */
  static isAuthenticated(): boolean {
    return checkAuth();
  }

  // ==================== REDIRECIONAMENTOS ====================

  /**
   * Redireciona para login se não autenticado
   */
  static requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return false;
    }
    return true;
  }

  /**
   * Redireciona usuário autenticado para home
   */
  static redirectIfAuthenticated(): boolean {
    if (this.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return true;
    }
    return false;
  }
}
