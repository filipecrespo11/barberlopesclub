// Configuração da API
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  endpoints: {
    auth: {
      login: '/auterota/login',
      cadastro: '/auterota/iniciar-cadastro',
      verificarCodigo: '/auterota/verificar-codigo',
      googleConfig: '/auterota/google-config',
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

  // Adicionar token se existir
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      // Tentar fazer parse do JSON de erro, se falhar usar mensagem genérica
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Erro no servidor (${response.status})`);
      } catch {
        throw new Error(`Erro de conexão com o servidor (${response.status})`);
      }
    }
    
    return response.json();
  } catch (error) {
    // Se for erro de rede (servidor não está rodando)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar com o servidor. Verifique se o backend está rodando.');
    }
    throw error;
  }
};
