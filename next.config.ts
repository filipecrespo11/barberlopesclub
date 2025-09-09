// ==========================================
// CONFIGURAÇÃO DO NEXT.JS
// ==========================================
// Arquivo: next.config.ts
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Configurações de build e otimização do Next.js
// ==========================================

/**
 * CONFIGURAÇÃO NEXT.JS - BARBER LOPES CLUB
 * ========================================
 * 
 * Configurações otimizadas para deployment estático e
 * performance da aplicação em produção.
 * 
 * CARACTERÍSTICAS PRINCIPAIS:
 * ==========================
 * - Export estático para hospedagem simples
 * - Otimização de imagens configurada
 * - Padrões de segurança para SVGs
 * - Suporte a múltiplos protocolos de imagem
 * - Experimental features ativadas
 * 
 * DECISÕES DE ARQUITETURA:
 * ========================
 * - output: 'export' - Gera site estático (sem server-side)
 * - trailingSlash: true - URLs sempre terminam com /
 * - unoptimized: true - Necessário para export estático
 * - remotePatterns: ** - Aceita imagens de qualquer domínio
 * 
 * SEGURANÇA:
 * ==========
 * - CSP configurado para SVGs
 * - Sandbox mode para conteúdo externo
 * - Validação de protocolos HTTP/HTTPS
 * 
 * MANUTENÇÃO:
 * ===========
 * - Revisar configurações após updates do Next.js
 * - Monitorar performance de imagens em produção
 * - Considerar restringir domínios de imagem se necessário
 * - Testar experimental features antes de deploy
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ==========================================
  // CONFIGURAÇÕES DE BUILD E DEPLOYMENT
  // ==========================================
  
  // Gera build estático para hospedagem simples (Vercel, Netlify, etc.)
  output: 'export',
  
  // Garante que URLs sempre terminem com / para consistência
  trailingSlash: true,
  
  // ==========================================
  // OTIMIZAÇÃO DE IMAGENS
  // ==========================================
  images: {
    // Desabilita otimização automática (necessário para export estático)
    unoptimized: true,
    
    // Permite imagens de qualquer domínio (útil para CDNs e APIs externas)
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
    
    // Habilita suporte a SVGs (com medidas de segurança)
    dangerouslyAllowSVG: true,
    
    // Política de segurança para conteúdo SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ==========================================
  // FUNCIONALIDADES EXPERIMENTAIS
  // ==========================================
  experimental: {
    // Otimiza imports de pacotes para melhor performance
    optimizePackageImports: ["@tailwindcss/typography"],
  },
};

export default nextConfig;
