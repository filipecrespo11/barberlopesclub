// ==========================================
// LAYOUT ROOT DA APLICAÇÃO
// ==========================================
// Arquivo: src/app/layout.tsx
// Versão: 1.0
// Última atualização: 2024-01-15
// Autor: Barber Lopes Club Dev Team
// Descrição: Layout principal da aplicação Next.js 14
// ==========================================

/**
 * ROOT LAYOUT - BARBER LOPES CLUB
 * ===============================
 * 
 * Layout principal da aplicação Next.js que define:
 * - Estrutura HTML básica
 * - Metadados SEO otimizados
 * - Configuração de viewport responsivo
 * - Componentes globais (Header/Footer)
 * - Estilos globais e fontes
 * 
 * ARQUITETURA:
 * ===========
 * - Header: Navegação e autenticação
 * - Main: Conteúdo dinâmico das páginas
 * - Footer: Informações institucionais
 * 
 * SEO E PERFORMANCE:
 * =================
 * - Metadados otimizados para busca
 * - Viewport responsivo configurado
 * - Favicon SVG para melhor qualidade
 * - Fonte antialiased para melhor legibilidade
 * 
 * MANUTENÇÃO:
 * ===========
 * - Atualizar metadados conforme mudanças na marca
 * - Verificar compatibilidade com novas versões do Next.js
 * - Manter estrutura semântica HTML5
 * - Testar acessibilidade e performance
 */

import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";

// ==========================================
// METADADOS SEO OTIMIZADOS
// ==========================================
// Configuração completa para melhor indexação nos buscadores
export const metadata: Metadata = {
  title: "Barbearia Lopes Club",
  description: "Barbearia moderna com os melhores profissionais. Agende seu horário!",
  keywords: "barbearia, corte de cabelo, barba, Lopes Club",
  authors: [{ name: "Lopes Club" }],
};

// ==========================================
// CONFIGURAÇÃO DE VIEWPORT RESPONSIVO
// ==========================================
// Otimização para dispositivos móveis e desktop
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// ==========================================
// COMPONENTE LAYOUT PRINCIPAL
// ==========================================
/**
 * ESTRUTURA GLOBAL DA APLICAÇÃO
 * ============================
 * 
 * Define a estrutura HTML base que será aplicada em todas
 * as páginas da aplicação, incluindo componentes fixos
 * como header e footer.
 * 
 * @param children - Conteúdo dinâmico de cada página
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">      
      <head>
        {/* Favicon otimizado em SVG para melhor qualidade */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased font-sans">
        {/* Navegação global */}
        <Header />
        
        {/* Conteúdo dinâmico das páginas */}
        <main>
          {children}
        </main>
        
        {/* Informações institucionais */}
        <Footer />
      </body>
    </html>
  );
}
