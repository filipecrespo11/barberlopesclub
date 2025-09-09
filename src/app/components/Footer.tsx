// ==========================================
// COMPONENTE FOOTER DA APLICAÇÃO
// ==========================================
// Arquivo: src/app/components/Footer.tsx
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Footer institucional com informações de contato e links
// ==========================================

/**
 * FOOTER INSTITUCIONAL - BARBER LOPES CLUB
 * ========================================
 * 
 * Componente footer responsivo com informações institucionais,
 * links de navegação, redes sociais e informações de contato.
 * 
 * SEÇÕES INCLUÍDAS:
 * ================
 * - Logo e descrição da marca
 * - Redes sociais (Instagram, Facebook, WhatsApp)
 * - Links de navegação rápida
 * - Informações de contato (telefone, endereço, email)
 * - Horários de funcionamento
 * - Copyright e informações legais
 * 
 * CARACTERÍSTICAS:
 * ===============
 * - Design responsivo (mobile-first)
 * - Gradiente de fundo elegante
 * - Ícones SVG otimizados
 * - Hover effects e animações suaves
 * - Links externos abrem em nova aba
 * - Acessibilidade com aria-labels
 * 
 * MANUTENÇÃO:
 * ===========
 * - Atualizar links de redes sociais conforme necessário
 * - Verificar números de telefone e WhatsApp
 * - Manter endereços atualizados
 * - Verificar links de navegação
 * - Atualizar horários de funcionamento
 */

import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* ==========================================
              SEÇÃO: LOGO E DESCRIÇÃO DA MARCA
              ========================================== */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/assets/lopesclubicon.png"
                alt="Lopes Club"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>
                <span className="text-2xl font-bold text-yellow-400">LOPES</span>
                <span className="block text-2xl font-bold">CLUB</span>
              </div>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-md">
              Mais que uma barbearia, uma experiência única. 
              Tradição, qualidade e estilo em cada corte.
            </p>
            
            {/* ==========================================
                REDES SOCIAIS COM ÍCONES CUSTOMIZADOS
                ========================================== */}
            <div className="flex space-x-4">
              {/* Instagram */}
              <a 
                href="#" 
                className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* Facebook */}
              <a 
                href="#" 
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/5511999999999" 
                className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ==========================================
              SEÇÃO: SERVIÇOS OFERECIDOS
              ========================================== */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Serviços</h3>
            <div className="space-y-3 text-gray-300">
              <p className="hover:text-white transition-colors cursor-pointer">Corte Masculino</p>
              <p className="hover:text-white transition-colors cursor-pointer">Barba & Bigode</p>
              <p className="hover:text-white transition-colors cursor-pointer">Combo Completo</p>
              <p className="hover:text-white transition-colors cursor-pointer">Corte Infantil</p>
            </div>
          </div>

          {/* ==========================================
              SEÇÃO: INFORMAÇÕES DE CONTATO
              ========================================== */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Contato</h3>
            <div className="space-y-3 text-gray-300">
              {/* Endereço físico */}
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">📍</span>
                <p>30 de Março, 41<br />Lado do Shopping</p>
              </div>
              
              {/* Telefone principal */}
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-lg">📱</span>
                <p>(11) 99999-9999</p>
              </div>
              
              {/* Email de contato */}
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-lg">📧</span>
                <p>contato@lopesclub.com</p>
              </div>
              
              {/* Horários de funcionamento */}
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">🕐</span>
                <div>
                  <p>Seg-Sex: 9h às 20h</p>
                  <p>Sáb: 8h às 18h</p>
                  <p>Dom: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SEÇÃO: COPYRIGHT E LINKS LEGAIS
            ========================================== */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright dinâmico */}
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Lopes Club. Todos os direitos reservados.
            </p>
            
            {/* Links legais */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}