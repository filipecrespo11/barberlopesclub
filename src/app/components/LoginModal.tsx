"use client";
import { useState, useEffect, useCallback } from "react";
import { apiRequest, API_CONFIG } from "@/app/utils/api";
import { User } from "@/app/types";
import { openPopup } from "@/app/utils/popup";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCadastro: () => void;
  onLoginSuccess: (userData: User) => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToCadastro, onLoginSuccess }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const resetState = useCallback(() => {
    setFormData({ email: '', password: '' });
    setErro('');
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  // Limpa o estado se o modal for fechado externamente
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErro(''); // Limpar erro ao digitar
  };

  // Listener para o popup do Google
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'google-auth-success') {
        localStorage.setItem('user', JSON.stringify(event.data.user));
        localStorage.setItem('token', event.data.token);
        onLoginSuccess(event.data.user);
        handleClose();
      } else if (event.data?.type === 'google-auth-error') {
        setErro(event.data.message || 'Erro na autenticação Google');
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [onLoginSuccess, handleClose]);

  const handleGoogleLogin = useCallback(async () => {
    setErro(''); // Limpar erros anteriores
    try {
      // Buscar configurações do Google OAuth do backend
      const googleConfig = await apiRequest(API_CONFIG.endpoints.auth.googleConfig, {
        method: 'GET',
      });
      
      if (!googleConfig || !googleConfig.clientId) {
        setErro('Google OAuth não está configurado no servidor.');
        return;
      }

      // Construir URL de redirect baseada na URL atual
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleConfig.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&response_type=code&state=login`;
      
      // Abrir popup
      openPopup(googleAuthUrl, 'Login Google', 500, 600);

    } catch (error) {
      console.error('Erro ao buscar configurações do Google:', error);
      // Se for 404, significa que o Google OAuth não está implementado no backend
      if (error instanceof Error && error.message.includes('404')) {
        setErro('Google OAuth não está disponível no momento. Use email e senha.');
      } else {
        setErro('Erro ao configurar autenticação com Google. Tente novamente.');
      }
    }
  }, []);// Nenhuma dependência de props ou state é necessária aqui
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    console.log('🔐 ========= INICIANDO LOGIN =========');
    console.log('📧 Email:', formData.email);
    console.log('🔑 Senha:', formData.password ? '***oculta***' : 'VAZIA!');
    console.log('📊 Form Data completo:', { ...formData, password: '***oculta***' });

    try {      const loginData = {
        username: formData.email,
        password: formData.password
      };
      
      console.log('📤 Enviando dados:', { ...loginData, password: '***oculta***' });
      
      const response = await apiRequest(API_CONFIG.endpoints.auth.login, {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      console.log('✅ Login bem-sucedido!', response);

      // Login realizado com sucesso
      localStorage.setItem("user", JSON.stringify(response.usuario));
      localStorage.setItem("token", response.token);
      
      onLoginSuccess(response.usuario);
      handleClose(); // Limpa o estado e fecha o modal
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao conectar com o servidor";
      setErro(errorMessage);
      console.error("Erro no login:", error);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {erro}
            </div>
          )}

          {/* Botão do Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sua senha"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Link para Cadastro */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={onSwitchToCadastro}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Criar Conta
              </button>
            </p>
          </div>

          {/* Esqueci minha senha */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
