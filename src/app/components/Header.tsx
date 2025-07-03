"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-30 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-sm'  // Se scrolled: fundo preto transparente
        : 'bg-transparent'
    }`}>      <nav className="max-w-6xl mx-auto px-6 py-2">
        {/* Menu horizontal com logo centralizado */}
        <div className="flex items-center justify-center">
          <div className="hidden lg:flex items-center gap-16 text-white">
            <Link href="#inicio" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              INÍCIO
            </Link>
            <Link href="#servicos" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              SERVIÇOS
            </Link>
            
            {/* Logo central */}
            <div className="mx-8">
              <img
                src="/assets/lopesclubicon.png"
                alt="Lopes Club"
                className="w-25 h-25 object-contain"
              />
            </div>
            
            <Link href="#galeria" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              GALERIA
            </Link>
            <Link href="#contato" className="hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm">
              CONTATO
            </Link>
          </div>
        </div>{/* Mobile menu button */}
        <button 
          className="lg:hidden fixed top-6 right-6 p-2 text-white hover:text-blue-400 transition-colors z-60"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md">
          <div className="px-6 py-8 space-y-6 text-center">
            <Link 
              href="#inicio" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              INÍCIO
            </Link>
            <Link 
              href="#servicos" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              SERVIÇOS
            </Link>
            <Link 
              href="#galeria" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              GALERIA
            </Link>
            <Link 
              href="#contato" 
              className="block text-white hover:text-blue-400 transition-colors font-medium uppercase tracking-wider text-sm py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTATO
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}