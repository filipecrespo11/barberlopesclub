// Tipos para o sistema de agendamento

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

export interface LoginResponse {
  token: string;
  usuario: User;
}

export interface CadastroData {
  nome_completo: string;
  username: string;
  email: string;
  password: string;
  tel?: string;
}

export interface AgendamentoData {
  servico: string;
  data: string;
  hora: string;
  barbeiro?: string;
  observacoes?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface GoogleOAuthConfig {
  clientId: string;
}

// Exportação explícita
export type { User as UserType, LoginResponse as LoginResponseType };
