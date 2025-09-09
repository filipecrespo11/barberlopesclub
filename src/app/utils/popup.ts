// ==========================================
// UTILITÁRIO DE POPUP CENTRALIZADO
// ==========================================
// Arquivo: src/app/utils/popup.ts
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Utilitário para abertura de popups centralizados
// ==========================================

"use client";

/**
 * SISTEMA DE POPUP CENTRALIZADO
 * =============================
 * 
 * Utilitário para criar popups centralizados na tela, com cálculos
 * automáticos de posicionamento considerando diferentes resoluções
 * e configurações de zoom do sistema.
 * 
 * CARACTERÍSTICAS:
 * ===============
 * - Centralização automática em qualquer resolução
 * - Suporte a múltiplos monitores (dual screen)
 * - Compensação automática para zoom do sistema
 * - Verificação de disponibilidade do objeto window (SSR safe)
 * - Foco automático na janela criada
 * 
 * CASOS DE USO:
 * =============
 * - Autenticação via OAuth (Google, Facebook, etc.)
 * - Visualização de documentos externos
 * - Formulários modais complexos
 * - Integrações com APIs externas que requerem popup
 * 
 * MANUTENÇÃO:
 * ===========
 * - Testar em diferentes resoluções e dispositivos
 * - Verificar compatibilidade com bloqueadores de popup
 * - Considerar alternativas modernas como modal dialogs
 * - Manter compatibilidade com SSR (Next.js)
 */

/**
 * ABRE POPUP CENTRALIZADO
 * =======================
 * 
 * Cria uma nova janela popup centralizada na tela principal,
 * com cálculos automáticos de posicionamento baseados na
 * resolução atual e configurações do sistema.
 * 
 * ALGORITMO DE CENTRALIZAÇÃO:
 * ===========================
 * 1. Detecta posição atual da janela principal (dual screen)
 * 2. Calcula dimensões disponíveis da tela
 * 3. Compensa zoom do sistema operacional
 * 4. Calcula posição central baseada nas dimensões desejadas
 * 5. Aplica configurações de segurança (scrollbars)
 * 
 * PARÂMETROS:
 * ===========
 * @param url - URL de destino para o popup
 * @param title - Título da janela (usado como identificador)
 * @param w - Largura desejada em pixels
 * @param h - Altura desejada em pixels
 * 
 * RETORNO:
 * ========
 * @returns Window | null - Referência da janela ou null se bloqueado
 * 
 * EXEMPLOS DE USO:
 * ===============
 * // OAuth Google
 * const authWindow = openPopup('/auth/google', 'google-auth', 500, 600);
 * 
 * // Visualização de documento
 * const docWindow = openPopup('/doc/terms', 'terms', 800, 600);
 * 
 * TRATAMENTO DE ERROS:
 * ===================
 * - Retorna null se window não estiver disponível (SSR)
 * - Retorna null se popup foi bloqueado pelo navegador
 * - Sempre verificar retorno antes de usar a referência
 */
export function openPopup(url: string, title: string, w: number, h: number): Window | null {
  // ==========================================
  // VERIFICAÇÃO DE AMBIENTE CLIENT-SIDE
  // ==========================================
  // Proteção contra execução em ambiente servidor (SSR)
  if (typeof window === "undefined") {
    return null;
  }

  // ==========================================
  // DETECÇÃO DE POSIÇÃO DUAL SCREEN
  // ==========================================
  // Calcula a posição atual da janela principal
  // Compatível com diferentes APIs de posicionamento
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  // ==========================================
  // CÁLCULO DE DIMENSÕES DA TELA
  // ==========================================
  // Obtém dimensões reais da janela/tela com fallbacks
  const width = window.innerWidth ? window.innerWidth : 
                document.documentElement.clientWidth ? document.documentElement.clientWidth : 
                screen.width;
  const height = window.innerHeight ? window.innerHeight : 
                 document.documentElement.clientHeight ? document.documentElement.clientHeight : 
                 screen.height;

  // ==========================================
  // COMPENSAÇÃO DE ZOOM DO SISTEMA
  // ==========================================
  // Calcula e compensa o zoom aplicado pelo sistema operacional
  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  // ==========================================
  // CRIAÇÃO E CONFIGURAÇÃO DO POPUP
  // ==========================================
  // Abre nova janela com configurações de segurança
  const newWindow = window.open(
    url,
    title,
    `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`
  );

  // ==========================================
  // APLICAÇÃO DE FOCO E RETORNO
  // ==========================================
  // Garante que o popup receba foco se foi criado com sucesso
  if (newWindow) {
    newWindow.focus();
  }

  // Retorna a referência da janela (ou null se bloqueado)
  return newWindow;
}
