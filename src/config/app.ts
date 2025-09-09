// ==========================================
// CONFIGURAÇÕES CENTRALIZADAS DA APLICAÇÃO
// ==========================================
// Arquivo: src/config/app.ts
// Versão: 2.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Configurações centralizadas para toda a aplicação
// ==========================================

/**
 * CONFIGURATION MANAGER - BARBER LOPES CLUB
 * ==========================================
 * 
 * Centralizador de todas as configurações da aplicação,
 * incluindo URLs de API, chaves de integração, endpoints
 * e configurações específicas por ambiente.
 * 
 * BENEFÍCIOS:
 * ===========
 * - Configuração única e consistente
 * - Fácil alteração entre ambientes (dev/prod)
 * - Type safety para endpoints
 * - Versionamento de configurações
 * - Fallbacks para valores críticos
 * 
 * ESTRUTURA:
 * ==========
 * - API: URLs e endpoints organizados por domínio
 * - WhatsApp: Integração e mensagens padrão
 * - Auth: Configurações de autenticação
 * - Dev: Flags e configurações de desenvolvimento
 * 
 * VARIÁVEIS DE AMBIENTE:
 * =====================
 * - NEXT_PUBLIC_API_URL: URL base da API
 * - NEXT_PUBLIC_WHATSAPP_NUMBER: Número para WhatsApp
 * - NODE_ENV: Ambiente de execução
 * 
 * MANUTENÇÃO:
 * ===========
 * - Atualizar URLs quando API mudar
 * - Adicionar novos endpoints seguindo padrão
 * - Validar configurações em diferentes ambientes
 * - Documentar novas variáveis de ambiente
 */

// ==========================================
// FUNÇÕES AUXILIARES PARA ENDPOINTS DINÂMICOS
// ==========================================

/**
 * CRIA ENDPOINTS DE AGENDAMENTOS
 * ==============================
 * 
 * Factory function para gerar endpoints relacionados
 * ao sistema de agendamentos, incluindo operações
 * CRUD com parâmetros dinâmicos.
 * 
 * @returns Objeto com endpoints de agendamento
 */
const createAgendamentoEndpoints = () => ({
  criar: '/api/agendar',
  listar: '/api/agendamentos',
  atualizar: (id: string | number) => `/api/agendar/${id}`,
  remover: (id: string | number) => `/api/agendar/${id}`
});

// ==========================================
// CONFIGURAÇÃO PRINCIPAL DA APLICAÇÃO
// ==========================================

export const APP_CONFIG = {
  // ==========================================
  // CONFIGURAÇÕES DE API E ENDPOINTS
  // ==========================================
  api: {
    // URL base da API com fallback para ambiente de produção
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backbarbearialopez-r4bg.onrender.com',
    
    // Endpoints organizados por domínio funcional
    endpoints: {
      // ==========================================
      // AUTENTICAÇÃO E AUTORIZAÇÃO
      // ==========================================
      auth: {
        login: '/api/login',                              // Login tradicional
        cadastro: '/api/iniciar-cadastro',               // Início de cadastro
        verificarCodigo: '/api/verificar-codigo',        // Verificação de email
        googleConfig: '/api/google-config',              // Config OAuth Google
        googleCallback: '/api/auth/google/callback',     // Callback OAuth Google
        atualizarTelefone: '/api/atualizar-telefone'     // Atualização de telefone
      },
      
      // ==========================================
      // SISTEMA DE AGENDAMENTOS
      // ==========================================
      agendamentos: createAgendamentoEndpoints(),
      
      // ==========================================
      // GESTÃO DE USUÁRIOS
      // ==========================================
      usuarios: {
        listar: '/api/usuarios',                         // Lista todos os usuários
        criar: '/api/criausuarios'                       // Criação de usuário
      },
      
      // ==========================================
      // OPERAÇÕES ADMINISTRATIVAS
      // ==========================================
      admin: {
        criarAdmin: '/api/criar-admin'                   // Criação de administrador
      }
    }
  },
  
  // ==========================================
  // INTEGRAÇÃO WHATSAPP
  // ==========================================
  whatsapp: {
    // Número com código do país (Brasil) e DDD
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999',
    
    // Mensagem padrão para abrir conversa
    defaultMessage: 'Olá! Gostaria de agendar um horário na Barbearia Lopes Club.'
  },
  
  // ==========================================
  // CONFIGURAÇÕES DE DESENVOLVIMENTO
  // ==========================================
  dev: {
    // Habilita logs detalhados apenas em desenvolvimento
    enableLogs: process.env.NODE_ENV !== 'production',
    // Habilita funcionalidades de debug no console
    enableDebug: process.env.NODE_ENV === 'development',
  },
  
  // ==========================================
  // CONFIGURAÇÕES DE INTERFACE DE USUÁRIO
  // ==========================================
  ui: {
    // Duração das transições de modais (ms)
    modalTransitionDuration: 300,
    
    // Duração padrão dos toast notifications (ms)
    toastDuration: 3000,
  },
  
  // ==========================================
  // CONFIGURAÇÕES DE AUTENTICAÇÃO
  // ==========================================
  auth: {
    // Chave para armazenar token JWT no localStorage
    tokenKey: 'authToken',
    
    // Chave para armazenar dados do usuário no localStorage
    userKey: 'user',
    
    // Endpoints que não requerem autenticação
    publicEndpoints: [
      '/api/login',                    // Login público
      '/api/cadastro',                // Cadastro público  
      '/api/iniciar-cadastro',        // Início de cadastro público
      '/api/verificar-codigo',        // Verificação de código público
      '/api/google-config',           // Config OAuth público
      '/api/auth/google/callback',    // Callback OAuth público
      '/api/agendamentos'             // Listagem pública de agendamentos
    ]
  }
} as const;
