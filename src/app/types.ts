// ==========================================
// TIPOS TYPESCRIPT DA APLICAÇÃO
// ==========================================
// Arquivo: src/app/types.ts
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Definições de tipos centralizadas para type safety
// ==========================================

/**
 * SISTEMA DE TIPOS - BARBER LOPES CLUB
 * ====================================
 * 
 * Definições centralizadas de todos os tipos TypeScript
 * utilizados na aplicação para garantir type safety e
 * manutenibilidade do código.
 * 
 * CATEGORIAS DE TIPOS:
 * ===================
 * - Usuários e autenticação
 * - Sistema de agendamentos  
 * - Respostas de API padronizadas
 * - Integração OAuth Google
 * - Tipos utilitários e genéricos
 * 
 * MANUTENÇÃO:
 * ===========
 * - Manter sincronizado com estruturas do backend
 * - Adicionar validação em runtime quando necessário
 * - Documentar mudanças breaking
 * - Considerar versionamento para mudanças importantes
 */

// ==========================================
// TIPOS DE USUÁRIOS E AUTENTICAÇÃO
// ==========================================

/**
 * INTERFACE DO USUÁRIO
 * ====================
 * 
 * Representa um usuário completo do sistema com todas
 * as informações necessárias para autenticação e
 * personalização da experiência.
 * 
 * CAMPOS OBRIGATÓRIOS:
 * - id: Identificador único
 * - nome_completo: Nome completo do usuário
 * - username: Nome de usuário único
 * - email: Email para login e comunicação
 * - verificado: Status de verificação da conta
 * 
 * CAMPOS OPCIONAIS:
 * - tel: Telefone para contato e WhatsApp
 * - foto: URL da foto de perfil
 * - googleId: ID do Google OAuth (se aplicável)
 * - isAdmin: Privilégios administrativos
 */
export interface User {
  id: string;
  nome_completo: string;
  username: string;
  email: string;
  tel?: string;
  foto?: string;
  verificado: boolean;
  googleId?: string;
  isAdmin?: boolean;
}

/**
 * RESPOSTA DE LOGIN SUCCESSFUL
 * ============================
 * 
 * Estrutura retornada pela API após autenticação bem-sucedida,
 * contendo token JWT e dados completos do usuário.
 * 
 * USOS:
 * - Armazenar token para requisições autenticadas
 * - Popular estado da aplicação com dados do usuário
 * - Definir permissões e navegação baseada no perfil
 */
export interface LoginResponse {
  token: string;
  usuario: User;
}

/**
 * DADOS PARA CADASTRO DE USUÁRIO
 * ==============================
 * 
 * Estrutura de dados necessária para criação de nova conta,
 * incluindo validações básicas no frontend.
 * 
 * VALIDAÇÕES APLICADAS:
 * - nome_completo: Mínimo 2 palavras
 * - username: Único no sistema, sem espaços
 * - email: Formato válido, será verificado
 * - password: Mínimo 6 caracteres, hash no backend
 * - tel: Formato brasileiro opcional
 */
export interface CadastroData {
  nome_completo: string;
  username: string;
  email: string;
  password: string;
  tel?: string;
}

// ==========================================
// TIPOS DO SISTEMA DE AGENDAMENTOS
// ==========================================

/**
 * DADOS DO AGENDAMENTO
 * ===================
 * 
 * Estrutura para criação e atualização de agendamentos,
 * incluindo validações de horário e disponibilidade.
 * 
 * REGRAS DE NEGÓCIO:
 * - servico: Deve corresponder aos serviços cadastrados
 * - data: Formato YYYY-MM-DD, não pode ser passada
 * - hora: Formato HH:MM, dentro do horário comercial
 * - barbeiro: Opcional, sistema pode atribuir automaticamente
 * - observacoes: Campo livre para instruções especiais
 */
export interface AgendamentoData {
  servico: string;
  data: string;
  hora: string;
  barbeiro?: string;
  observacoes?: string;
}

// ==========================================
// TIPOS DE RESPOSTAS DA API
// ==========================================

/**
 * RESPOSTA PADRÃO DA API
 * ======================
 * 
 * Estrutura padronizada para todas as respostas da API,
 * garantindo consistência no tratamento de erros e dados.
 * 
 * PADRÕES:
 * - success: true/false para verificação rápida
 * - data: Dados da resposta (quando success=true)
 * - message: Mensagem de sucesso ou contexto
 * - error: Mensagem de erro (quando success=false)
 * 
 * @template T - Tipo dos dados retornados no campo data
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
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
 * Dados necessários para configurar autenticação Google,
 * obtidos dinamicamente do servidor para maior segurança.
 * 
 * SEGURANÇA:
 * - clientId é público mas específico do domínio
 * - Configuração dinâmica previne hardcoding
 * - Permite diferentes configs por ambiente
 */
export interface GoogleOAuthConfig {
  clientId: string;
}

// ==========================================
// EXPORTS PARA COMPATIBILIDADE
// ==========================================

/**
 * EXPORTAÇÕES EXPLÍCITAS
 * ======================
 * 
 * Aliases para manter compatibilidade com código legado
 * e melhorar legibilidade em diferentes contextos.
 */
export type { User as UserType, LoginResponse as LoginResponseType };
