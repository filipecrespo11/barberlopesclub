"use client";
import { useState, useEffect, useRef } from "react";
import { apiRequest, API_CONFIG } from "@/app/utils/api";
import { openPopup } from "@/app/utils/popup";

interface CadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function CadastroModal({ isOpen, onClose, onSwitchToLogin }: CadastroModalProps) {
  const [step, setStep] = useState<'cadastro' | 'verificacao'>('cadastro');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmarSenha: ''
  });
  const [codigoVerificacao, setCodigoVerificacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const googlePopupRef = useRef<Window | null>(null);

  // Limpa o estado do modal sempre que ele for fechado
  useEffect(() => {
    if (!isOpen) {
      // Atraso para não limpar antes da animação de fechar
      setTimeout(() => {
        setStep('cadastro');
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          password: '',
          confirmarSenha: ''
        });
        setCodigoVerificacao('');
        setErro('');
        setLoading(false);
      }, 300); // 300ms para coincidir com transições comuns
    }
  }, [isOpen]);

  // Listener para receber dados do Google OAuth
  useEffect(() => {
    function handleGoogleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.user) {
        // Fechar popup
        if (googlePopupRef.current) {
          googlePopupRef.current.close();
        }
        // Preencher dados do usuário no formulário
        setFormData((prev) => ({
          ...prev,
          nome: event.data.user.nome_completo || '',
          email: event.data.user.email || '',
          password: '',
          confirmarSenha: ''
        }));
        setStep('cadastro');
        setErro('');
      }
    }
    window.addEventListener('message', handleGoogleMessage);
    return () => window.removeEventListener('message', handleGoogleMessage);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      // Permitir tanto "senha" quanto "password" para compatibilidade
      [e.target.name === 'senha' ? 'password' : e.target.name]: e.target.value
    });
    setErro(''); // Limpar erro ao digitar
  };

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigoVerificacao(e.target.value);
    setErro('');
  };  const handleGoogleSignup = async () => {
    try {
      // Buscar configurações do Google OAuth do backend
      const googleConfig = await apiRequest(API_CONFIG.endpoints.auth.googleConfig, {
        method: 'GET',
      });
      
      if (!googleConfig || !googleConfig.clientId) {
        alert('Google OAuth não está configurado no servidor.');
        return;
      }

      // Construir URL de redirect baseada na URL atual
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      
      // Redirecionar para Google OAuth em popup
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleConfig.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&response_type=code&state=signup`;
      googlePopupRef.current = openPopup(googleAuthUrl, 'Cadastro Google', 500, 600);
    } catch (error) {
      console.error('Erro ao buscar configurações do Google:', error);
      if (error instanceof Error && error.message.includes('404')) {
        alert('Google OAuth não está disponível no momento. Use o formulário abaixo.');
      } else {
        alert('Erro ao configurar autenticação com Google. Tente novamente.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    // Validações
    if (formData.password !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest(API_CONFIG.endpoints.auth.cadastro, {
        method: 'POST',
        body: JSON.stringify({
          nome_completo: formData.nome,
          username: formData.email, // Usando email como username
          password: formData.password,
          tel: formData.telefone,
          email: formData.email
        }),
      });

      // Se retornar código de desenvolvimento, preencher automaticamente
      if (response.codigo_dev) {
        const codigo = response.codigo_dev;
        console.log('🔐 Código de desenvolvimento recebido:', codigo);
        setCodigoVerificacao(codigo);
        
        // Mostrar mensagem específica para modo desenvolvimento
        if (response.debug) {
          console.log('ℹ️ Modo desenvolvimento:', response.debug);
        }
      }
      
      // Ir para o step de verificação
      setStep('verificacao');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com o servidor';
      setErro(errorMessage);
      console.error('Erro no cadastro:', error);
    }

    setLoading(false);
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    if (!codigoVerificacao.trim()) {
      setErro('Por favor, digite o código de verificação');
      setLoading(false);
      return;
    }

    try {
      // Chamar endpoint de verificação
      const response = await apiRequest(API_CONFIG.endpoints.auth.verificarCodigo, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          codigo: codigoVerificacao
        }),
      });

      if (response.success) {
        // Cadastro confirmado com sucesso
        alert('Cadastro realizado com sucesso! Você já pode fazer login.');
        onClose();
      } else {
        setErro(response.message || 'Código inválido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar código';
      setErro(errorMessage);
      console.error('Erro na verificação:', error);
    }

    setLoading(false);
  };

  const handleVoltarCadastro = () => {
    setStep('cadastro');
    setCodigoVerificacao('');
    setErro('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'cadastro' ? 'Criar Conta' : 'Verificar Email'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6">
          {step === 'cadastro' ? (
            <CadastroForm 
              formData={formData}
              loading={loading}
              erro={erro}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onGoogleSignup={handleGoogleSignup}
              onClose={onClose}
              onSwitchToLogin={onSwitchToLogin}
            />
          ) : (
            <VerificacaoForm
              email={formData.email}
              codigo={codigoVerificacao}
              loading={loading}
              erro={erro}
              onSubmit={handleVerificarCodigo}
              onCodigoChange={handleCodigoChange}
              onVoltar={handleVoltarCadastro}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para o formulário de cadastro
interface CadastroFormProps {
  formData: {
    nome: string;
    email: string;
    telefone: string;
    password: string;
    confirmarSenha: string;
  };
  loading: boolean;
  erro: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGoogleSignup: () => void;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function CadastroForm({ 
  formData, 
  loading, 
  erro, 
  onSubmit, 
  onChange, 
  onGoogleSignup, 
  onClose, 
  onSwitchToLogin 
}: CadastroFormProps) {
  return (
    <>
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {erro}
        </div>
      )}

      {/* Botão do Google */}
      <button
        type="button"
        onClick={onGoogleSignup}
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

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu nome completo"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone (WhatsApp)
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {/* Confirmar Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha *
          </label>
          <input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Repita sua senha"
          />
        </div>

        {/* Botões */}
        <div className="space-y-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Link para Login */}
      <div className="text-center pt-4 mt-4 border-t">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </>
  );
}

// Componente para o formulário de verificação de código
interface VerificacaoFormProps {
  email: string;
  codigo: string;
  loading: boolean;
  erro: string;
  onSubmit: (e: React.FormEvent) => void;
  onCodigoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVoltar: () => void;
}

function VerificacaoForm({ email, codigo, loading, erro, onSubmit, onCodigoChange, onVoltar }: VerificacaoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {erro}
        </div>
      )}
      
      <p className="text-gray-600 text-center">
        Enviamos um código de verificação para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada (e spam).
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Código de Verificação *
        </label>
        <input
          type="text"
          value={codigo}
          onChange={onCodigoChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-[0.5em]"
          placeholder="______"
        />
      </div>

      <div className="space-y-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar e Criar Conta'}
        </button>
        
        <button
          type="button"
          onClick={onVoltar}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>
    </form>
  );
}
