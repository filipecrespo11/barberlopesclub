"use client";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCadastro: () => void;
  onLoginSuccess: (userData: any) => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToCadastro, onLoginSuccess }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErro(''); // Limpar erro ao digitar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login realizado com sucesso
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        onLoginSuccess(data.user);
        onClose();
        
        // Limpar formulário
        setFormData({
          email: '',
          senha: ''
        });
      } else {
        setErro(data.message || 'Email ou senha incorretos');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor');
      console.error('Erro no login:', error);
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
            onClick={onClose}
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
              name="senha"
              value={formData.senha}
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
              onClick={onClose}
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
