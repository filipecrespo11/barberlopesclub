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
  };  // Adicionar token apenas se não for login, cadastro ou endpoints do Google OAuth
  const isAuthEndpoint = endpoint.includes('/auterota/login') || 
                         endpoint.includes('/auterota/cadastro') || 
                         endpoint.includes('/auterota/iniciar-cadastro') || 
                         endpoint.includes('/auterota/verificar-codigo') ||
                         endpoint.includes('/auterota/google-config') ||
                         endpoint.includes('/auterota/auth/google/callback');
  
  if (!isAuthEndpoint) {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 Token encontrado para request:', token.substring(0, 20) + '...');
      // Try both formats - some backends expect different header formats
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
        'x-access-token': token, // Some backends use this format
      };
    } else {
      console.warn('⚠️ Nenhum token encontrado no localStorage para request autenticado');
    }
  }
  try {
    console.log('🚀 Fazendo requisição para:', url);
    console.log('📝 Headers:', defaultOptions.headers);
    console.log('📝 Body:', defaultOptions.body);
    
    const response = await fetch(url, defaultOptions);
    
    console.log('📥 Resposta recebida:', response.status, response.statusText);
    console.log('📥 Headers de resposta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      // Tentar fazer parse do JSON de erro, se falhar usar mensagem genérica
      try {
        const errorData = await response.json();
        // console.error('❌ Erro do servidor:', errorData);
        throw new Error(errorData.message || errorData.error || `Erro no servidor (${response.status})`);      } catch {
        // console.error('❌ Erro ao fazer parse da resposta:', parseError);
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
