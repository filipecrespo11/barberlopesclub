// Configuração da API
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backbarbearialopez.onrender.com',
  endpoints: {
    auth: {
      login: '/auterota/login',
      cadastro: '/auterota/iniciar-cadastro',
      verificarCodigo: '/auterota/verificar-codigo',
      googleConfig: '/auterota/google/config',
      googleCallback: '/auterota/auth/google/callback',
    },
    agendamentos: {
      criar: '/auterota/agendar',
    },
    usuarios: {
      listar: '/auterota/usuarios',
      criar: '/auterota/criausuarios',
    }
  }
};

// Função utilitária para fazer chamadas para a API
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token apenas se não for login ou cadastro
  const isAuthEndpoint = endpoint.includes('/login') || endpoint.includes('/cadastro') || endpoint.includes('/iniciar-cadastro') || endpoint.includes('/verificar-codigo');
  
  if (!isAuthEndpoint) {
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }
  try {
    console.log('🚀 Fazendo requisição para:', url);
    console.log('📝 Dados:', defaultOptions);
    
    const response = await fetch(url, defaultOptions);
    
    console.log('📥 Resposta recebida:', response.status, response.statusText);
    
    if (!response.ok) {
      // Tentar fazer parse do JSON de erro, se falhar usar mensagem genérica
      try {
        const errorData = await response.json();
        console.error('❌ Erro do servidor:', errorData);
        throw new Error(errorData.message || errorData.error || `Erro no servidor (${response.status})`);
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse da resposta:', parseError);
        throw new Error(`Erro de conexão com o servidor (${response.status})`);
      }
    }
    
    const data = await response.json();
    console.log('✅ Sucesso:', data);
    return data;
  } catch (error) {
    // Se for erro de rede (servidor não está rodando)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar com o servidor. Verifique se o backend está rodando.');
    }
    throw error;
  }
};
