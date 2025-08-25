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
  password: string;
}

export interface CadastroData {
  nome: string;
  email: string;
  telefone: string;
  password: string;
}

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
