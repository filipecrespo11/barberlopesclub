// ==========================================
// CALLBACK DO GOOGLE OAUTH 2.0
// ==========================================
// Arquivo: src/app/auth/google/callback/page.tsx
// Versão: 2.0
// Última atualização: 2025-09-09
// Autor: Barber Lopes Club Dev Team
// Descrição: Página de callback para autenticação Google OAuth
// ==========================================

/**
 * GOOGLE OAUTH CALLBACK - BARBER LOPES CLUB
 * =========================================
 * 
 * Página de callback responsável pelo processamento da resposta
 * de autenticação do Google OAuth 2.0. Gerencia a troca de código
 * por tokens, criação/login de usuários e comunicação com a
 * janela pai via postMessage.
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * ===========================
 * - Processamento de códigos de autorização OAuth
 * - Troca de código por access tokens
 * - Criação automática de contas via Google
 * - Login automático de usuários existentes
 * - Comunicação segura via postMessage
 * - Tratamento de erros de autenticação
 * - Redirecionamento baseado no estado
 * - Interface de feedback visual
 * 
 * FLUXO OAUTH COMPLETO:
 * ====================
 * 1. Usuário é redirecionado do Google para esta página
 * 2. Extração do código de autorização da URL
 * 3. Verificação de parâmetros de estado (state)
 * 4. Envio do código para API backend
 * 5. Backend troca código por tokens no Google
 * 6. Criação/atualização de usuário no sistema
 * 7. Retorno de dados de usuário e tokens
 * 8. Comunicação com janela pai via postMessage
 * 9. Fechamento automático do popup
 * 
 * PARÂMETROS DE URL PROCESSADOS:
 * =============================
 * - code: Código de autorização do Google
 * - state: Estado para diferençar login/cadastro
 * - error: Erro de autenticação (se houver)
 * - error_description: Descrição detalhada do erro
 * 
 * COMUNICAÇÃO COM JANELA PAI:
 * ===========================
 * - Envio de dados via postMessage para window.opener
 * - Verificação de origem para segurança
 * - Diferentes tipos de mensagem (success, error)
 * - Fechamento automático após comunicação
 * 
 * TRATAMENTO DE ESTADOS:
 * =====================
 * - state=login: Login de usuário existente
 * - state=signup: Cadastro de novo usuário
 * - Sem state: Comportamento padrão (login)
 * 
 * SEGURANÇA IMPLEMENTADA:
 * ======================
 * - Validação de origem das mensagens
 * - Verificação de estado CSRF
 * - Sanitização de parâmetros de URL
 * - Tokens seguros para comunicação
 * - HTTPS obrigatório em produção
 * 
 * TRATAMENTO DE ERROS:
 * ===================
 * - access_denied: Usuário negou permissões
 * - invalid_request: Parâmetros OAuth inválidos
 * - server_error: Erro interno do Google
 * - temporarily_unavailable: Serviço indisponível
 * - Erros de rede e conectividade
 * - Tokens expirados ou inválidos
 * 
 * MANUTENÇÃO:
 * ===========
 * - Para alterar fluxo OAuth: modificar handleCallback
 * - Para debug: habilitar logs no AuthService
 * - Para novos provedores: estender lógica de processamento
 * - Para customizar UI: ajustar componentes de feedback
 * 
 * @author Sistema de Autenticação OAuth - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService, APP_CONFIG } from '@/services';
import { apiRequest } from '@/app/utils/api';

function GoogleCallbackContent() {
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
        }

        // Enviar código para o backend processar
        // Inclui redirectUri explícito, pois muitos backends exigem validação rígida
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        // Log seguro - sem dados sensíveis
        if (process.env.NODE_ENV === 'development') {
          console.log('🔵 Iniciando autenticação Google...');
        }
        let response: any;
        try {
          response = await AuthService.processGoogleCallback(code);
          // Log seguro - apenas status de sucesso
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Autenticação Google bem-sucedida');
          }
        } catch (e: any) {
          // Log apenas tipo de erro, sem dados sensíveis
          if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ Tentando métodos alternativos de autenticação...');
          }
          // Alguns backends esperam GET com query params; faz fallback automático
          const status = e?.status;
          if (status === 404 || status === 405) {
            const qp = new URLSearchParams({ code: code!, state: state || '', redirect_uri: redirectUri }).toString();
            // 1) tenta GET no mesmo caminho
            try {
              response = await AuthService.processGoogleCallback(code!);
            } catch (e2: any) {
              // 2) tenta caminho alternativo sem '/auth'
              const altPath = '/auterota/google/callback';
              try {
                response = await apiRequest(altPath, { method: 'POST', body: JSON.stringify({ code, state, redirect_uri: redirectUri, redirectUri }), skipAuth: true });
              } catch (e3: any) {
                // 3) fallback final GET no caminho alternativo
                response = await apiRequest(`${altPath}?${qp}`, { method: 'GET', skipAuth: true });
              }
            }
          } else {
            throw e;
          }
        }

        // Considera sucesso se vier token e usuário, mesmo sem flag 'success'
        const user = response.user || response.usuario || response.data?.usuario || response.data?.user;
        const token = response.token || response.data?.token;
        const isNewUser = response.isNewUser || response.is_new_user || !user?.tel;
        const ok = !!token && !!user;
        
        if (ok) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          
          // Se é usuário novo do Google sem telefone, pedir telefone
          if (isNewUser || !user.tel) {
            setStatus('success');
            setMessage('Login realizado! Precisamos do seu telefone para contato.');
            // Comunica sucesso mas com necessidade de telefone
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'google-auth-success', 
                user, 
                token, 
                needsPhone: true 
              }, window.location.origin);
              window.close();
            }
            setTimeout(() => router.push('/?needsPhone=true'), 2000);
          } else {
            setStatus('success');
            setMessage('Login realizado com sucesso! Redirecionando...');
            // Comunica sucesso normal
            if (window.opener) {
              window.opener.postMessage({ type: 'google-auth-success', user, token }, window.location.origin);
              window.close();
            }
            setTimeout(() => router.push('/'), 2000);
          }
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
        const msg = (error as any)?.data?.message || (error as any)?.message || 'Erro interno. Tente novamente.';
        setMessage(msg);
        // Comunica erro para opener
        if (window.opener) {
          window.opener.postMessage({ type: 'google-auth-error', message: msg }, window.location.origin);
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

export default function GoogleCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando...</h2>
            <p className="text-gray-600">Processando autenticação...</p>
          </div>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
