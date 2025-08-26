// Configuração da API
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backbarbearialopez.onrender.com',
  endpoints: {    auth: {
      login: '/auterota/login',
      cadastro: '/auterota/iniciar-cadastro',
      verificarCodigo: '/auterota/verificar-codigo',
      googleConfig: '/auterota/google-config',
      googleCallback: '/auterota/auth/google/callback',
    },
    agendamentos: {
      criar: '/auterota/agendar',
      listar: '/auterota/agendamentos',
      atualizar: (id: string | number) => `/auterota/agendar/${id}`,
      remover: (id: string | number) => `/auterota/agendar/${id}`,
    },
    usuarios: {
      listar: '/auterota/usuarios',
      criar: '/auterota/criausuarios',
    }
  }
};

// Função utilitária para fazer chamadas para a API
export const apiRequest = async (endpoint: string, options: RequestInit & { skipAuth?: boolean } = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  // Adicionar token apenas se não for login, cadastro ou endpoints do Google OAuth
  const isAuthEndpoint = endpoint.includes('/auterota/login') || 
                         endpoint.includes('/auterota/cadastro') || 
                         endpoint.includes('/auterota/iniciar-cadastro') || 
                         endpoint.includes('/auterota/verificar-codigo') ||
                         endpoint.includes('/auterota/google-config') ||
                         endpoint.includes('/auterota/auth/google/callback');
  const skipAuth = (options as any).skipAuth === true;
  if (!isAuthEndpoint && !skipAuth) {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    // Optionally pick from cookies on server-side calls (when used in RSC, though apiRequest is client-first)
    if (token) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔑 Token encontrado para request:', token.substring(0, 8) + '...');
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
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 Fazendo requisição para:', url);
      console.log('📝 Headers:', defaultOptions.headers);
      console.log('📝 Body:', defaultOptions.body);
    }
    
    const response = await fetch(url, defaultOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📥 Resposta recebida:', response.status, response.statusText);
      console.log('📥 Headers de resposta:', Object.fromEntries(response.headers.entries()));
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
        console.log('❌ Erro do servidor:', errorData, 'status:', response.status);
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
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Sucesso:', data);
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
