// Configuração da API para conectar com o backend externo
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backbarbearialopez.onrender.com',
  endpoints: {    
    auth: {
      login: '/login',
      cadastro: '/iniciar-cadastro',
      verificarCodigo: '/verificar-codigo',
      googleConfig: '/google-config',
      googleCallback: '/auth/google/callback',
      atualizarTelefone: '/atualizar-telefone'
    },
    agendamentos: {
      criar: '/agendar',
      listar: '/agendamentos',
      atualizar: (id: string | number) => `/agendar/${id}`,
      remover: (id: string | number) => `/agendar/${id}`,
    },
    usuarios: {
      listar: '/usuarios',
      criar: '/criar-usuarios',
    },
    admin: {
      criarAdmin: '/criar-admin',
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
  const isAuthEndpoint = endpoint.includes('/login') || 
                         endpoint.includes('/cadastro') || 
                         endpoint.includes('/iniciar-cadastro') || 
                         endpoint.includes('/verificar-codigo') ||
                         endpoint.includes('/google-config') ||
                         endpoint.includes('/auth/google/callback');
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
