// ==========================================
// CONFIGURAÇÃO DO TAILWIND CSS
// ==========================================
// Arquivo: tailwind.config.js
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Configurações customizadas do Tailwind CSS
// ==========================================

/**
 * CONFIGURAÇÃO TAILWIND CSS - BARBER LOPES CLUB
 * ==============================================
 * 
 * Configurações personalizadas do Tailwind CSS para
 * atender ao design system da barbearia, incluindo
 * paleta de cores, tipografia e animações customizadas.
 * 
 * CUSTOMIZAÇÕES INCLUÍDAS:
 * ========================
 * - Paleta de cores dourada (tema da marca)
 * - Família tipográfica Roboto
 * - Animações suaves para UX aprimorada
 * - Keyframes personalizados para transições
 * 
 * PADRÕES DE COR:
 * ===============
 * - primary.50: Dourado muito claro (backgrounds)
 * - primary.400: Dourado médio (hover states)
 * - primary.500: Dourado padrão (botões principais)
 * - primary.600: Dourado escuro (states ativos)
 * 
 * MANUTENÇÃO:
 * ===========
 * - Adicionar novas cores seguindo escala de 50-900
 * - Testar animações em diferentes dispositivos
 * - Manter consistência com design system
 * - Purgar CSS unused em produção
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ==========================================
  // ARQUIVOS PARA ESCANEAMENTO DE CLASSES
  // ==========================================
  // Define onde o Tailwind deve procurar por classes CSS
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",        // Source code principal
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // App directory (Next.js 13+)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Pages directory (compatibilidade)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",  // Componentes avulsos
  ],
  
  // ==========================================
  // TEMA CUSTOMIZADO
  // ==========================================
  theme: {
    extend: {
      // ==========================================
      // PALETA DE CORES DA MARCA
      // ==========================================
      colors: {
        primary: {
          50: '#fffbeb',   // Dourado muito claro - backgrounds sutis
          400: '#facc15',  // Dourado médio - hover effects
          500: '#eab308',  // Dourado padrão - botões principais
          600: '#ca8a04',  // Dourado escuro - estados ativos/pressed
        },
      },
      
      // ==========================================
      // TIPOGRAFIA PERSONALIZADA
      // ==========================================
      fontFamily: {
        // Stack tipográfico com Roboto como fonte principal
        sans: [
          "Roboto",                 // Fonte principal da marca
          "ui-sans-serif",         // Fallback moderno
          "system-ui",             // Font sistema nativa
          "-apple-system",         // Apple system font
          "BlinkMacSystemFont",    // MacOS Blink
          'Segoe UI',              // Windows
          'Helvetica Neue',        // Apple fallback
          "Arial",                 // Universal fallback
          'Noto Sans',             // Google fallback
          "sans-serif"             // Generic fallback
        ],
      },
      
      // ==========================================
      // ANIMAÇÕES CUSTOMIZADAS
      // ==========================================
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',  // Entrada suave de elementos
        'pulse-slow': 'pulse 2s infinite',        // Pulso lento para destaque
      },
      
      // ==========================================
      // KEYFRAMES PERSONALIZADOS
      // ==========================================
      keyframes: {
        // Animação de entrada com fade e movimento vertical
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  
  // ==========================================
  // PLUGINS ADICIONAIS
  // ==========================================
  // Lista vazia - adicionar plugins conforme necessidade:
  // - @tailwindcss/forms (formulários)
  // - @tailwindcss/typography (conteúdo rich text)
  // - @tailwindcss/aspect-ratio (aspect ratios)
  plugins: [],
}