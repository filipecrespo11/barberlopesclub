// Configuração da API para conectar com o backend externo
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backbarbearialopez-r4bg.onrender.com',
  endpoints: {    
    auth: {
      login: '/api/login',
      cadastro: '/api/iniciar-cadastro',
      verificarCodigo: '/api/verificar-codigo',
      googleConfig: '/api/google-config',
      googleCallback: '/api/auth/google/callback',
      atualizarTelefone: '/api/atualizar-telefone'
    },
    agendamentos: {
      criar: '/api/agendar',
      listar: '/api/agendamentos',
      atualizar: (id: string | number) => `/api/agendar/${id}`,
      remover: (id: string | number) => `/api/agendar/${id}`,
    },
    usuarios: {
      listar: '/api/usuarios',
      criar: '/api/criausuarios',
    },
    admin: {
      criarAdmin: '/api/criar-admin',
    }
  }
};

// Função utilitária para fazer chamadas para a API
export const apiRequest = async (endpoint: string, options: RequestInit & { skipAuth?: boolean } = {}) => {
  // Detecta rotas internas do Next (/api/...) e URLs absolutas
  let url: string;
  if (/^https?:\/\//i.test(endpoint)) {
    url = endpoint; // URL absoluta
  } else if (endpoint.startsWith('/api/')) {
    url = endpoint; // Rota interna do Next (mesma origem)
  } else {
    url = `${API_CONFIG.baseURL}${endpoint}`; // Endpoint do backend
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  // Adicionar token apenas se não for login, cadastro ou endpoints do Google OAuth
  const isAuthEndpoint = endpoint.includes('/api/login') || 
                         endpoint.includes('/api/cadastro') || 
                         endpoint.includes('/api/iniciar-cadastro') || 
                         endpoint.includes('/api/verificar-codigo') ||
                         endpoint.includes('/api/google-config') ||
                         endpoint.includes('/api/auth/google/callback') ||
                         endpoint.includes('/api/agendamentos'); // Rota pública conforme backend
  const skipAuth = (options as any).skipAuth === true;
  if (!isAuthEndpoint && !skipAuth) {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    // Optionally pick from cookies on server-side calls (when used in RSC, though apiRequest is client-first)
    if (token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 Fazendo request autenticado...');
        console.log('🔑 Endpoint sendo chamado:', endpoint);
      }
      // Try both formats - some backends expect different header formats
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
        'x-access-token': token, // Some backends use this format
      };
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ Nenhum token encontrado no localStorage para request autenticado');
        console.warn('⚠️ Endpoint sendo chamado:', endpoint);
      }
    }
  }
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Fazendo requisição para:', url);
      console.log('📝 Método:', defaultOptions.method || 'GET');
    }
    
    const response = await fetch(url, defaultOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 Status da resposta:', response.status);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 Headers recebidos');
    }
    if (!response.ok) {
      // Tenta parsear JSON de erro e anexa status/dados ao Error
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        // ignore
      }
      if (process.env.NODE_ENV !== 'production') {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Erro do servidor - Status:', response.status);
        }
      }
      const err: any = new Error(
        (errorData && (errorData.message || errorData.error)) ||
        (response.status === 401 ? 'Usuário não autenticado. Faça login novamente.' : `Erro no servidor (${response.status})`)
      );
      err.status = response.status;
      err.data = errorData;
      throw err;
    }

    const data = await response.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Request concluído com sucesso');
    }
    return data;
  } catch (error) {
    // Se for erro de rede (servidor não está rodando)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar com o servidor. Verifique se o backend está rodando.');
    }
    throw error;
  }
};

// ========== FUNÇÕES ESPECÍFICAS PARA CADA ENDPOINT ==========

// Função para login
export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });
    return response;
  } catch (error: any) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Função para iniciar cadastro
export const iniciarCadastro = async (userData: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.cadastro, {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao iniciar cadastro:', error);
    throw error;
  }
};

// Função para verificar código
export const verificarCodigo = async (data: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.verificarCodigo, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao verificar código:', error);
    throw error;
  }
};

// Função para callback do Google OAuth
export const googleCallback = async (data: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.googleCallback, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
    return response;
  } catch (error: any) {
    console.error('Erro no callback do Google:', error);
    throw error;
  }
};

// Função para obter configuração do Google OAuth
export const getGoogleConfig = async () => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.googleConfig, {
      method: 'GET',
      skipAuth: true,
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao obter configuração do Google:', error);
    throw error;
  }
};

// Função para atualizar telefone
export const atualizarTelefone = async (telefoneData: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.atualizarTelefone, {
      method: 'PUT',
      body: JSON.stringify(telefoneData),
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao atualizar telefone:', error);
    throw error;
  }
};

// Função para criar agendamento
export const criarAgendamento = async (agendamentoData: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
      method: 'POST',
      body: JSON.stringify(agendamentoData),
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

// Função para listar agendamentos
export const listarAgendamentos = async () => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.agendamentos.listar, {
      method: 'GET',
      skipAuth: true, // Rota pública conforme seu backend
    });
    // Backend retorna { success: true, data: [...] }
    return response.data || response;
  } catch (error: any) {
    console.error('Erro ao listar agendamentos:', error);
    throw error;
  }
};

// Função para atualizar agendamento
export const atualizarAgendamento = async (id: string, agendamentoData: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.agendamentos.atualizar(id), {
      method: 'PUT',
      body: JSON.stringify(agendamentoData),
    });
    // Backend retorna { success: true, agendamento: {...} }
    return response.agendamento || response;
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento:', error);
    throw error;
  }
};

// Função para deletar agendamento
export const deletarAgendamento = async (id: string) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.agendamentos.remover(id), {
      method: 'DELETE',
    });
    // Backend retorna { success: true, message: "Agendamento excluído" }
    return response;
  } catch (error: any) {
    console.error('Erro ao deletar agendamento:', error);
    throw error;
  }
};

// Função para listar usuários
export const listarUsuarios = async () => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.usuarios.listar, {
      method: 'GET',
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
};

// Função para criar usuário
export const criarUsuario = async (userData: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.usuarios.criar, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Função para criar admin
export const criarAdmin = async (adminData: any) => {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.admin.criarAdmin, {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
    return response;
  } catch (error: any) {
    console.error('Erro ao criar admin:', error);
    throw error;
  }
};
