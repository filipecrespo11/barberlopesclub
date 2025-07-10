"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest, API_CONFIG } from '@/app/utils/api';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autenticação...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Autenticação cancelada pelo usuário.');
          // Comunica erro para opener
          if (window.opener) {
            window.opener.postMessage({ type: 'google-auth-error', message: 'Autenticação cancelada pelo usuário.' }, window.location.origin);
            window.close();
          }
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('Código de autorização não encontrado.');
          // Comunica erro para opener
          if (window.opener) {
            window.opener.postMessage({ type: 'google-auth-error', message: 'Código de autorização não encontrado.' }, window.location.origin);
            window.close();
          }
          setTimeout(() => router.push('/'), 3000);
          return;
        }        // Enviar código para o backend processar
        console.log('🔵 Enviando código Google para backend:', { code: code?.substring(0, 20) + '...', state });
        
        const response = await apiRequest(API_CONFIG.endpoints.auth.googleCallback, {
          method: 'POST',
          body: JSON.stringify({
            code,
            state
          }),
        });

        console.log('🔵 Resposta do backend Google:', response);

        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          setStatus('success');
          setMessage('Login realizado com sucesso! Redirecionando...');
          // Comunica sucesso para opener
          if (window.opener) {
            window.opener.postMessage({ type: 'google-auth-success', user: response.user, token: response.token }, window.location.origin);
            window.close();
          }
          setTimeout(() => router.push('/'), 2000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Erro na autenticação');
          // Comunica erro para opener
          if (window.opener) {
            window.opener.postMessage({ type: 'google-auth-error', message: response.message || 'Erro na autenticação' }, window.location.origin);
            window.close();
          }
          setTimeout(() => router.push('/'), 3000);
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        setStatus('error');
        setMessage('Erro interno. Tente novamente.');
        // Comunica erro para opener
        if (window.opener) {
          window.opener.postMessage({ type: 'google-auth-error', message: 'Erro interno. Tente novamente.' }, window.location.origin);
          window.close();
        }
        setTimeout(() => router.push('/'), 3000);
      }
    };
    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          )}
          
          {status === 'success' && (
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {status === 'loading' && 'Processando...'}
            {status === 'success' && 'Sucesso!'}
            {status === 'error' && 'Erro'}
          </h2>
          
          <p className="text-gray-600">
            {message}
          </p>
          
          {status === 'error' && (
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Voltar ao início
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
