// Tipos para a aplicação
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  username?: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface CadastroData {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface AgendamentoData {
  nome: string;
  telefone: string;
  servico: string;
  data: string;
  horario: string;
  usuario_id?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  codigo_dev?: string;
}

export interface Servico {
  id: string;
  nome: string;
  preco: string;
}
