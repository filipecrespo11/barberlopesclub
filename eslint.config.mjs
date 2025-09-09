// ==========================================
// CONFIGURAÇÃO ESLINT - BARBER LOPES CLUB
// ==========================================
// Arquivo: eslint.config.mjs
// Versão: 1.0
// Última atualização: 2025-09-09
// Autor: Barber Lopes Club Dev Team
// Descrição: Configurações de linting para qualidade e consistência de código
// ==========================================

/**
 * ESLINT CONFIGURATION - BARBER LOPES CLUB
 * ========================================
 * 
 * Configuração ESLint para garantir qualidade e consistência
 * do código em todo o projeto. Utiliza ESLint v9+ com
 * configuração flat config para melhor performance e
 * compatibilidade com Next.js 14.
 * 
 * EXTENDS CONFIGURADOS:
 * ====================
 * - next/core-web-vitals: Regras específicas do Next.js
 * - next/typescript: Suporte completo ao TypeScript
 * 
 * REGRAS CUSTOMIZADAS:
 * ===================
 * - @typescript-eslint/no-unused-vars: OFF
 *   Permite variáveis não utilizadas durante desenvolvimento
 * 
 * - @typescript-eslint/no-explicit-any: OFF
 *   Permite uso de 'any' para compatibilidade com APIs externas
 * 
 * - @typescript-eslint/no-unused-expressions: OFF
 *   Permite expressões não utilizadas para debugging
 * 
 * - react-hooks/exhaustive-deps: OFF
 *   Desabilita warning sobre dependências de hooks
 * 
 * - prefer-const: WARN
 *   Sugere uso de const quando variável não é reatribuída
 * 
 * SCRIPTS RELACIONADOS:
 * =====================
 * - npm run lint: Executa linting em todo o projeto
 * - npm run lint:fix: Corrige automaticamente problemas
 * - npm run lint:check: Apenas verifica sem corrigir
 * 
 * INTEGRAÇÃO COM IDE:
 * ==================
 * - VS Code: Extensão ESLint ativa
 * - Lint-on-save habilitado
 * - Format-on-save integrado com Prettier
 * - Problemas mostrados na guia Problems
 * 
 * MANUTENÇÃO:
 * ===========
 * - Para adicionar regras: estender seção rules
 * - Para novos parsers: configurar na seção parser
 * - Para ignores: usar .eslintignore ou ignorePatterns
 * - Para plugins: adicionar à lista de extends
 * 
 * @author Sistema de Qualidade de Código - Lopes Club
 * @version 1.0
 * @lastModified 2025-09-09
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignores devem vir primeiro para serem aplicados globalmente
  {
    ignores: [
      "out/**",
      ".next/**", 
      "dist/**",
      "build/**",
      "node_modules/**",
      "public/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "react-hooks/exhaustive-deps": "off",
      "prefer-const": "warn"
    }
  }
];

export default eslintConfig;
