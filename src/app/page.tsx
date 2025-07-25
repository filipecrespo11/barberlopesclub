"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AgendamentoModal from "./components/AgendamentoModal";
import LoginModal from "./components/LoginModal";
import CadastroModal from "./components/CadastroModal";

import type { User } from "./types";

export default function Home() {
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    const userData = localStorage.getItem('user');
    if (userData) {
      // Usuário está logado, mas não precisamos armazenar no estado aqui
      console.log('Usuário logado:', JSON.parse(userData));
    }

    // Listener para abrir modal de login
    const handleOpenLoginModal = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => window.removeEventListener('openLoginModal', handleOpenLoginModal);
  }, []);

  const openAgendamentoModal = () => setIsAgendamentoModalOpen(true);
  const closeAgendamentoModal = () => setIsAgendamentoModalOpen(false);
  
  const closeLoginModal = () => setIsLoginModalOpen(false);
  
  const closeCadastroModal = () => setIsCadastroModalOpen(false);

  const switchToCadastro = () => {
    setIsLoginModalOpen(false);
    setIsCadastroModalOpen(true);
  };

  const switchToLogin = () => {
    setIsCadastroModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const handleLoginSuccess = (userData: User) => {
    // Salvar usuário no localStorage (já feito no modal)
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
    setIsAgendamentoModalOpen(true); // Abrir modal de agendamento após login
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <main className="bg-white text-gray-900">{/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/assets/backgroundhero.jpg"
            alt="Barbearia"
            className="w-full h-full object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 pt-32">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-wide">
              QUALIDADE E EXPERIÊNCIA
            </h1>
            <a
              href="#servicos"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              VER SERVIÇOS
            </a>
          </div>
        </div>
      </section>{/* Services Section */}
      <section id="servicos" className="py-20 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Lado esquerdo - Texto */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                NOSSOS SERVIÇOS
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Mais de uma década de experiência com tradições e tendências.
              </p>
              <p className="text-gray-600 leading-relaxed mb-12">
                Oferecemos uma experiência completa com produtos de qualidade e técnicas modernas para todos os estilos.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 uppercase tracking-wider transition-all duration-300">
                VER GALERIA
              </button>
            </div>
            
            {/* Lado direito - Lista de preços */}
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">CORTE</span>
                </div>
                <span className="text-xl font-bold text-gray-900">30,00</span>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">BARBA</span>
                </div>
                <span className="text-xl font-bold text-gray-900">20,00</span>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">CABELO E BARBA</span>
                </div>
                <span className="text-xl font-bold text-gray-900">45,00</span>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">SOMBRANCELHA</span>
                </div>
                <span className="text-xl font-bold text-gray-900">5,00</span>
              </div>
              
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">PEZINHO</span>
                </div>
                <span className="text-xl font-bold text-gray-900">10,00</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo marca d'água */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <Image 
            src="/assets/lopesclubicon.png" 
            alt="Logo" 
            className="w-64 h-64 object-contain" 
            width={256} 
            height={256}
          />
        </div>
      </section>

      {/* Location Section */}
      <section id="unidade" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Nossa Unidade</h2>
            <p className="text-xl text-gray-600">Localização privilegiada no coração da cidade</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div id="contato">              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <span className="text-blue-600 text-2xl mr-4">📍</span>
                  <div>
                    <p className="font-semibold text-lg">Endereço</p>
                    <p className="text-gray-600">30 de Março, 41 - Lado do Shopping</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 text-2xl mr-4">🕐</span>
                  <div>
                    <p className="font-semibold text-lg">Horário de Funcionamento</p>
                    <p className="text-gray-600">Seg-Sex: 9h às 20h | Sáb: 8h às 18h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 text-2xl mr-4">📞</span>
                  <div>
                    <p className="font-semibold text-lg">Telefone</p>
                    <p className="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
              </div>              <button 
                onClick={openAgendamentoModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 transition-all duration-300 transform hover:scale-105 uppercase tracking-wider"
              >
                AGENDAR PELO WHATSAPP
              </button>
            </div>            <div className="grid grid-cols-1 gap-4">
              <Image
                src="/assets/foto-unidade-1.svg"
                alt="Interior da Unidade"
                className="w-full h-48 object-cover shadow-lg"
                width={400}
                height={192}
              />
              <Image
                src="/assets/foto-unidade-2.svg"
                alt="Ambiente da Barbearia"
                className="w-full h-48 object-cover shadow-lg"
                width={400}
                height={192}
              />
            </div>
          </div>
        </div>      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Galeria de Cortes</h2>
            <p className="text-xl text-gray-600">Alguns dos nossos trabalhos recentes</p>
          </div>          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte1.svg"
                alt="Corte Moderno"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Corte Moderno</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte2.svg"
                alt="Barba Estilizada"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Barba Estilizada</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte3.svg"
                alt="Combo Completo"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Combo Completo</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte4.svg"
                alt="Estilo Clássico"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Estilo Clássico</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte1.svg"
                alt="Degradê Moderno"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Degradê Moderno</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte2.svg"
                alt="Corte Social"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Corte Social</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte3.svg"
                alt="Estilo Executivo"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Estilo Executivo</span>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-lg">
              <Image
                src="/assets/corte4.svg"
                alt="Barba Completa"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Barba Completa</span>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section id="agendamento" className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Agende Online */}
            <div className="bg-black p-16 text-center border-r border-gray-700">
              <h3 className="text-3xl font-bold mb-8 text-white uppercase tracking-wider">
                AGENDE ONLINE
              </h3>              <button
                onClick={openAgendamentoModal}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                AGENDAR AGORA
              </button>
            </div>
            
            {/* Agende WhatsApp */}
            <div className="bg-black p-16 text-center">
              <h3 className="text-3xl font-bold mb-8 text-white uppercase tracking-wider">
                AGENDE WHATSAPP
              </h3>
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20um%20horário"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                📱 WHATSAPP
              </a>
            </div>
          </div>        </div>
      </section>
    </main>

    {/* Modais */}
    <AgendamentoModal 
      isOpen={isAgendamentoModalOpen} 
      onClose={closeAgendamentoModal}
      onLoginRequired={handleLoginRequired}
    />
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={closeLoginModal}
      onSwitchToCadastro={switchToCadastro}
      onLoginSuccess={handleLoginSuccess}
    />
    <CadastroModal 
      isOpen={isCadastroModalOpen} 
      onClose={closeCadastroModal}
      onSwitchToLogin={switchToLogin}
    />
  </>
  );
}
