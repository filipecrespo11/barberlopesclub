# TSCONFIG.JSON - DOCUMENTAÇÃO

## CONFIGURAÇÃO TYPESCRIPT - BARBER LOPES CLUB
**Arquivo:** tsconfig.json  
**Versão:** 1.0  
**Última atualização:** 2025-09-09  
**Autor:** Barber Lopes Club Dev Team  
**Descrição:** Configurações do TypeScript para Next.js e type safety  

## TYPESCRIPT CONFIGURATION - BARBER LOPES CLUB

Configurações TypeScript otimizadas para Next.js 14 com foco em type safety, performance de compilação e compatibilidade com bibliotecas externas.

### CONFIGURAÇÕES PRINCIPAIS:
- **target: ES2017**: Compatibilidade com navegadores modernos
- **strict: true**: Type checking rigoroso ativado
- **moduleResolution: bundler**: Otimizado para Next.js
- **skipLibCheck: true**: Performance em libs externas
- **incremental: true**: Compilação incremental

### PATHS CONFIGURADOS:
- **@/\***: Alias para ./src/* (imports absolutos)

### INCLUÍDOS NO BUILD:
- Todos os arquivos .ts/.tsx do projeto
- next-env.d.ts: Tipos específicos do Next.js
- .next/types/**/*.ts: Tipos gerados pelo Next.js
- tailwind.config.js: Para plugins do Tailwind

### EXCLUÍDOS DO BUILD:
- node_modules: Bibliotecas externas

### PLUGINS ATIVADOS:
- **next**: Plugin oficial do Next.js para TypeScript

### MANUTENÇÃO:
- Para novos paths: adicionar em compilerOptions.paths
- Para libs externas: configurar em types ou @types
- Para performance: ajustar skipLibCheck conforme necessário
- Para compatibilidade: verificar target ECMAScript

---
**Autor:** Sistema de Tipos - Lopes Club  
**Versão:** 1.0  
**Última modificação:** 2025-09-09
