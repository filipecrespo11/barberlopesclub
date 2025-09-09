// ==========================================
// DOCUMENTAÇÃO DO JSCONFIG.JSON
// ==========================================
// Arquivo: JSCONFIG_README.md
// Versão: 1.0
// Última atualização: 2025-09-09
// Autor: Barber Lopes Club Dev Team
// Descrição: Documentação das configurações JavaScript para IDE
// ==========================================

/**
 * JAVASCRIPT CONFIGURATION - BARBER LOPES CLUB
 * =============================================
 * 
 * O arquivo jsconfig.json configura o JavaScript para IDEs e ferramentas
 * de desenvolvimento, complementando o tsconfig.json para melhor
 * suporte a arquivos JavaScript puros e mixed codebases.
 * 
 * CONFIGURAÇÕES PRINCIPAIS:
 * ========================
 * - module: ESNext: Suporte a módulos ES modernos
 * - moduleResolution: Bundler: Otimizado para bundlers
 * - target: ES2022: JavaScript moderno com features recentes
 * - jsx: react-jsx: Suporte ao JSX automático do React 17+
 * - allowImportingTsExtensions: true: Importação de arquivos .ts
 * 
 * STRICT CHECKS:
 * ==============
 * - strictNullChecks: true: Verificação rigorosa de null/undefined
 * - strictFunctionTypes: true: Type checking rigoroso de funções
 * 
 * PATHS CONFIGURADOS:
 * ==================
 * - @/*: Alias para ./src/* (mesma configuração do tsconfig)
 * 
 * EXCLUSÕES:
 * ==========
 * - node_modules: Bibliotecas externas
 * - **/node_modules/*: Subpastas node_modules aninhadas
 * 
 * USO NO PROJETO:
 * ===============
 * - Suporte de IDE para arquivos .js/.jsx
 * - IntelliSense em mixed TypeScript/JavaScript
 * - Validação de syntax em tempo real
 * - Navegação de código aprimorada
 * 
 * MANUTENÇÃO:
 * ===========
 * - Manter sincronizado com tsconfig.json
 * - Para novos paths: adicionar em compilerOptions.paths
 * - Para compatibilidade: verificar target ECMAScript
 * - Para performance: ajustar exclusões conforme necessário
 * 
 * @author Sistema de Configuração IDE - Lopes Club
 * @version 1.0
 * @lastModified 2025-09-09
 */
