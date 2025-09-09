/**
 * COMPONENTE HEADER DA APLICAÇÃO
 * ================================
 * 
 * Componente responsável pela navegação principal da aplicação.
 * Inclui menu desktop/mobile responsivo, autenticação e funcionalidades de contato.
 * 
 * FUNCIONALIDADES:
 * - Menu responsivo (desktop/mobile)
 * - Animação de scroll (header transparente → com fundo)
 * - Autenticação (login/logout)
 * - Integração WhatsApp
 * - Ocultação automática em rotas admin
 * 
 * DEPENDÊNCIAS:
 * - @/services: AuthService, UtilsService
 * - Next.js: Link, usePathname, Image
 * - React: useState, useEffect
 * 
 * MANUTENÇÃO:
 * - Para alterar links de navegação: modificar seções "Menu horizontal" e "Mobile menu"
 * - Para alterar comportamento de scroll: modificar valores em handleScroll (linha ~17)
 * - Para alterar autenticação: modificar checkAuth e intervalo authInterval (linha ~24-27)
 * - Para alterar WhatsApp: modificar handleWhatsAppClick (linha ~35)
 * 
 * @author Sistema de Manutenção - Lopes Club
 * @version 2.0
 * @lastModified 2025-09-09
 */

"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { UtilsService, AuthService } from "@/services";

export default function Header() {
  // ==========================================
  // LOGS DE DEBUG (Remover em produção)
  // ==========================================
  console.log('🔵 Header component loaded!');
  
  // ==========================================
  // HOOKS E ESTADOS
  // ==========================================
  const pathname = usePathname(); // Para detectar rota atual

  // Estados do componente
  const [isMenuOpen, setIsMenuOpen] = useState(false);        // Controla menu mobile (aberto/fechado)
  const [isScrolled, setIsScrolled] = useState(false);        // Controla aparência do header no scroll
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação do usuário

  // ==========================================
  // EFEITOS E EVENT LISTENERS
  // ==========================================
  useEffect(() => {
    /**
     * HANDLER DO SCROLL
     * Altera aparência do header baseado na posição do scroll
     * VALOR: 50px - quando o usuário rola mais de 50px, o header ganha fundo escuro
     * MANUTENÇÃO: Altere o valor 50 para modificar quando o efeito acontece
     */
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    /**
     * VERIFICAÇÃO DE AUTENTICAÇÃO
     * Verifica se o usuário está autenticado usando AuthService
     * MANUTENÇÃO: Modificar AuthService.isAuthenticated() se necessário
     */
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };

    // ==========================================
    // REGISTRAR EVENT LISTENERS
    // ==========================================
    window.addEventListener('scroll', handleScroll);
    checkAuth(); // Verificação inicial

    /**
     * INTERVALO DE VERIFICAÇÃO DE AUTENTICAÇÃO
     * Verifica autenticação a cada 1 segundo
     * MANUTENÇÃO: Altere 1000ms se quiser verificação mais/menos frequente
     * NOTA: Considere usar Context API ou Redux para melhor performance
     */
    const authInterval = setInterval(checkAuth, 1000);

    // ==========================================
    // CLEANUP - IMPORTANTE PARA EVITAR MEMORY LEAKS
    // ==========================================
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(authInterval);
    };
  }, []); // Array vazio = executa apenas no mount/unmount

  // ==========================================
  // HANDLERS DE EVENTOS
  // ==========================================
  
  /**
   * HANDLER DO WHATSAPP
   * Abre WhatsApp com mensagem pré-definida
   * MANUTENÇÃO: Modificar UtilsService.abrirWhatsApp() para alterar comportamento
   * DEBUG: Console log para verificar cliques (remover em produção)
   */
  const handleWhatsAppClick = () => {
    console.log('🟢 WhatsApp button clicked!'); // DEBUG: remover em produção
    UtilsService.abrirWhatsApp();
  };

  /**
   * HANDLER DO LOGOUT
   * Realiza logout do usuário e redireciona para home
   * FLUXO: AuthService.logout() → setIsAuthenticated(false) → redirecionar
   * MANUTENÇÃO: Modificar redirecionamento se necessário
   * DEBUG: Console log para verificar cliques (remover em produção)
   */
  const handleLogout = () => {
    console.log('🟢 Logout button clicked!'); // DEBUG: remover em produção
    AuthService.logout();
    setIsAuthenticated(false);
    window.location.href = '/'; // MANUTENÇÃO: Usar router.push() se necessário
  };

  // ==========================================
  // CONDIÇÃO DE RENDERIZAÇÃO
  // ==========================================
  /**
   * OCULTAÇÃO EM ROTAS ADMIN
   * O header não é renderizado em páginas que começam com /admin
   * IMPORTANTE: Esta verificação deve vir DEPOIS de todos os hooks
   * MANUTENÇÃO: Adicionar outras rotas se necessário (ex: /dashboard, /panel)
   */
  if (pathname && pathname.startsWith('/admin')) return null;
  
  // ==========================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ==========================================
  return (
    /**
     * HEADER PRINCIPAL
     * Classes dinâmicas baseadas no estado isScrolled:
     * - Transparente quando no topo (bg-transparent)
     * - Fundo escuro quando scrolled (bg-black/90 backdrop-blur-sm)
     * 
     * ESTILOS:
     * - fixed: Fica fixo no topo durante scroll
     * - z-50: Z-index alto para ficar sobre outros elementos
     * - transition-all: Animação suave nas mudanças
     * 
     * MANUTENÇÃO:
     * - Alterar cores: modificar classes bg-black/90 e bg-transparent
     * - Alterar animação: modificar duration-30 
     * - Alterar z-index: modificar z-50 se houver conflitos
     */
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-30 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-sm'  // Estado scrolled: fundo escuro com blur
        : 'bg-transparent'                // Estado inicial: transparente
    }`}>
      
      {/* ==========================================
          NAVEGAÇÃO PRINCIPAL
          ========================================== */}
      <nav className={`max-w-6xl mx-auto px-6 transition-all duration-400 ${
        isScrolled ? 'py-1' : 'py-4'  // Padding menor quando scrolled para compactar header
      }`}>
        
        {/* ==========================================
            MENU DESKTOP (HORIZONTAL)
            Visível apenas em telas grandes (lg:flex)
            ========================================== */}
        <div className="flex items-center justify-center">
          <div className="hidden lg:flex items-center gap-16 text-white">
            
            {/* LINKS DE NAVEGAÇÃO - LADO ESQUERDO */}
            <Link href="#inicio" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              INÍCIO
            </Link>
            <Link href="#servicos" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              SERVIÇOS
            </Link>
            
            {/* ==========================================
                LOGO CENTRAL
                Logo responsivo que diminui quando scrolled
                ========================================== */}
            <div className="mx-8">
              <Image
                src="/assets/lopesclubicon.png"
                alt="Lopes Club"
                width={100}
                height={100}
                className={`object-contain transition-all duration-400 ${
                  isScrolled ? 'w-16 h-16' : 'w-25 h-25'  // Logo menor quando scrolled
                }`}
                // MANUTENÇÃO: Alterar src se logo mudar de local/nome
                // MANUTENÇÃO: Alterar tamanhos w-16/h-16 e w-25/h-25 se necessário
              />
            </div>
            
            {/* LINKS DE NAVEGAÇÃO - LADO DIREITO */}
            <Link href="#galeria" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              GALERIA
            </Link>
            <Link href="#contato" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              CONTATO
            </Link>
            
            {/* ==========================================
                BOTÃO WHATSAPP DESKTOP
                ========================================== */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              // MANUTENÇÃO: Alterar cores green-600/700 se necessário
              // MANUTENÇÃO: onClick chama handleWhatsAppClick definido acima
            >
              {/* ÍCONE DO WHATSAPP - SVG inline para melhor performance */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
              </svg>
              WhatsApp
            </button>

            {/* ==========================================
                BOTÃO LOGIN/LOGOUT DESKTOP
                Renderização condicional baseada em isAuthenticated
                ========================================== */}
            {isAuthenticated ? (
              // USUÁRIO LOGADO: Mostrar botão de logout
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                // MANUTENÇÃO: Alterar cores red-600/700 se necessário
              >
                Sair
              </button>
            ) : (
              // USUÁRIO NÃO LOGADO: Mostrar botão de login
              <Link
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                // MANUTENÇÃO: Alterar href="#" para rota de login real
                // MANUTENÇÃO: Alterar cores blue-600/700 se necessário
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
        
        {/* ==========================================
            BOTÃO MENU HAMBURGER (MOBILE)
            Visível apenas em telas pequenas (lg:hidden)
            ========================================== */}
        <button 
          className="lg:hidden fixed top-6 left-6 p-2 text-white hover:text-blue-400 transition-colors z-[999]"
          style={{ pointerEvents: 'auto', cursor: 'pointer' }} // Styles inline para garantir clicabilidade
          onClick={() => {
            console.log('🟢 Hamburger menu clicked!', !isMenuOpen); // DEBUG: remover em produção
            setIsMenuOpen(!isMenuOpen); // Toggle do estado do menu mobile
          }}
          // MANUTENÇÃO:
          // - z-[999]: Z-index alto para ficar sobre outros elementos
          // - Posição fixed top-6 left-6: Canto superior esquerdo
          // - onClick toggle isMenuOpen entre true/false
        >
          {/* ÍCONE HAMBURGER/X - Muda baseado no estado isMenuOpen */}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              // Menu aberto: mostrar X para fechar
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Menu fechado: mostrar linhas hamburger
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* ==========================================
          MENU MOBILE (OVERLAY)
          Renderização condicional - só aparece quando isMenuOpen = true
          ========================================== */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md">
          {/* CONTAINER DOS ITENS DO MENU */}
          <div className="px-6 py-8 space-y-6 text-center">
            
            {/* ==========================================
                LINKS DE NAVEGAÇÃO MOBILE
                Cada link fecha o menu quando clicado (onClick)
                ========================================== */}
            <Link 
              href="#inicio" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)} // Fecha menu ao clicar
            >
              INÍCIO
            </Link>
            <Link 
              href="#servicos" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)} // Fecha menu ao clicar
            >
              SERVIÇOS
            </Link>
            <Link 
              href="#galeria" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)} // Fecha menu ao clicar
            >
              GALERIA
            </Link>
            <Link 
              href="#contato" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)} // Fecha menu ao clicar
            >
              CONTATO
            </Link>
            
            {/* ==========================================
                BOTÃO WHATSAPP MOBILE
                ========================================== */}
            <button
              onClick={() => {
                handleWhatsAppClick(); // Abre WhatsApp
                setIsMenuOpen(false);  // Fecha menu
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              // MANUTENÇÃO: w-full = largura total, justify-center = centralizar conteúdo
            >
              {/* ÍCONE WHATSAPP MOBILE - Mesmo SVG do desktop */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
              </svg>
              WhatsApp
            </button>

            {/* ==========================================
                BOTÃO LOGIN/LOGOUT MOBILE
                Renderização condicional baseada em isAuthenticated
                ========================================== */}
            {isAuthenticated ? (
              // USUÁRIO LOGADO: Botão de logout mobile
              <button
                onClick={() => {
                  handleLogout();       // Faz logout
                  setIsMenuOpen(false); // Fecha menu
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                // MANUTENÇÃO: w-full = largura total para mobile
              >
                Sair
              </button>
            ) : (
              // USUÁRIO NÃO LOGADO: Link de login mobile
              <Link
                href="#"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                onClick={() => setIsMenuOpen(false)} // Fecha menu ao clicar
                // MANUTENÇÃO: 
                // - href="#" deve ser alterado para rota real de login
                // - block w-full = display block com largura total
                // - text-center = centralizar texto
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}