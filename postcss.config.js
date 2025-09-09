// ==========================================
// CONFIGURAÇÃO DO POSTCSS
// ==========================================
// Arquivo: postcss.config.js
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Configuração do PostCSS para processamento de CSS
// ==========================================

/**
 * POSTCSS CONFIGURATION - BARBER LOPES CLUB
 * ==========================================
 * 
 * Configuração do PostCSS para processamento automático
 * de CSS, incluindo Tailwind CSS e autoprefixer.
 * 
 * PLUGINS CONFIGURADOS:
 * ====================
 * - tailwindcss: Processa utilitários do Tailwind
 * - autoprefixer: Adiciona prefixes para compatibilidade
 * 
 * FUNCIONALIDADES:
 * ===============
 * - Compilação do Tailwind CSS
 * - Prefixes automáticos para navegadores antigos
 * - Otimização de CSS para produção
 * - Suporte a sintaxes modernas de CSS
 * 
 * MANUTENÇÃO:
 * ===========
 * - Atualizar plugins conforme necessidade
 * - Verificar compatibilidade com versões do Tailwind
 * - Adicionar plugins para otimização se necessário
 */

module.exports = {
  plugins: {
    // Processamento do Tailwind CSS
    tailwindcss: {},
    
    // Prefixes automáticos para compatibilidade cross-browser
    autoprefixer: {},
  },
}