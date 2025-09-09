/**
 * DOCUMENTAÇÃO TÉCNICA - COMPONENTE HEADER
 * ==========================================
 * 
 * Arquivo: src/app/components/Header.tsx
 * Autor: Sistema de Manutenção - Lopes Club
 * Versão: 2.0
 * Última modificação: 2025-09-09
 * 
 * VISÃO GERAL
 * -----------
 * Componente de navegação principal da aplicação com design responsivo.
 * Implementa menu hamburger para mobile e navegação horizontal para desktop.
 * Inclui funcionalidades de autenticação e integração com WhatsApp.
 * 
 * FUNCIONALIDADES PRINCIPAIS
 * ---------------------------
 * 1. Menu Responsivo
 *    - Desktop: Navegação horizontal com logo centralizado
 *    - Mobile: Menu hamburger overlay
 * 
 * 2. Animação de Scroll
 *    - Header transparente no topo da página
 *    - Fundo escuro e logo menor após scroll > 50px
 * 
 * 3. Autenticação
 *    - Verificação automática de login a cada 1s
 *    - Botões condicionais (Login/Logout)
 *    - Integração com AuthService
 * 
 * 4. Integração WhatsApp
 *    - Botão direto para contato
 *    - Mensagem pré-definida
 *    - Disponível em desktop e mobile
 * 
 * 5. Ocultação Condicional
 *    - Header oculto em rotas /admin
 *    - Permite interface limpa para painel administrativo
 * 
 * ESTRUTURA DE ESTADOS
 * --------------------
 * - isMenuOpen: boolean    - Controla abertura do menu mobile
 * - isScrolled: boolean    - Detecta se usuário fez scroll > 50px
 * - isAuthenticated: boolean - Status de autenticação do usuário
 * 
 * DEPENDÊNCIAS EXTERNAS
 * ---------------------
 * - @/services/AuthService: Gerenciamento de autenticação
 * - @/services/UtilsService: Funcionalidades utilitárias (WhatsApp)
 * - Next.js Image: Otimização de imagens
 * - Next.js Link: Navegação SPA
 * - Next.js usePathname: Detecção de rota atual
 * 
 * CUSTOMIZAÇÕES COMUNS
 * --------------------
 * 1. Alterar links de navegação:
 *    - Modificar href dos componentes Link
 *    - Alterar textos dos links
 * 
 * 2. Alterar comportamento de scroll:
 *    - Modificar valor 50 na função handleScroll
 *    - Alterar classes CSS condicionais
 * 
 * 3. Alterar cores e estilos:
 *    - Modificar classes Tailwind CSS
 *    - Ajustar transições e animações
 * 
 * 4. Alterar logo:
 *    - Modificar src="/assets/lopesclubicon.png"
 *    - Ajustar tamanhos responsivos
 * 
 * 5. Alterar autenticação:
 *    - Modificar intervalo de verificação (1000ms)
 *    - Alterar lógica de AuthService
 * 
 * BREAKPOINTS RESPONSIVOS
 * -----------------------
 * - Mobile: < 1024px (lg:hidden)
 * - Desktop: >= 1024px (lg:flex)
 * 
 * PERFORMANCE
 * -----------
 * - SVG icons inline para reduzir requests
 * - Image component do Next.js com otimização
 * - Transition CSS para animações suaves
 * - Event listeners com proper cleanup
 * 
 * ACESSIBILIDADE
 * --------------
 * - Alt text nas imagens
 * - Estrutura semântica HTML
 * - Contrastes adequados
 * - Navegação por teclado funcional
 * 
 * DEBUGGING
 * ---------
 * - Console.log statements marcados com // DEBUG
 * - Remover logs em produção
 * - IDs de debug: 🔵 🟢 para facilitar identificação
 * 
 * TROUBLESHOOTING
 * ---------------
 * 1. Menu hamburger não funciona:
 *    - Verificar z-index conflicts
 *    - Confirmar onClick handlers
 *    - Verificar CSS pointer-events
 * 
 * 2. Autenticação não atualiza:
 *    - Verificar AuthService.isAuthenticated()
 *    - Conferir intervalo de verificação
 *    - Validar localStorage/sessionStorage
 * 
 * 3. Logo não carrega:
 *    - Verificar path da imagem
 *    - Confirmar arquivo existe em public/assets/
 *    - Validar Next.js Image config
 * 
 * 4. WhatsApp não abre:
 *    - Verificar UtilsService.abrirWhatsApp()
 *    - Confirmar número e mensagem
 *    - Testar em diferentes dispositivos
 * 
 * TESTES RECOMENDADOS
 * -------------------
 * - Teste responsivo em diferentes tamanhos de tela
 * - Verificar scroll behavior em diferentes browsers
 * - Testar fluxo de login/logout
 * - Validar integração WhatsApp
 * - Confirmar ocultação em rotas /admin
 * 
 * FUTURAS MELHORIAS
 * -----------------
 * - Implementar Context API para autenticação
 * - Adicionar animações mais suaves
 * - Otimizar re-renders com React.memo
 * - Implementar lazy loading para menu mobile
 * - Adicionar testes unitários
 * - Implementar dark/light theme toggle
 */
