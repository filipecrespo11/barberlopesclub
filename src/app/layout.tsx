import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Barbearia Lopes Club",
  description: "Barbearia moderna com os melhores profissionais. Agende seu horário!",
  keywords: "barbearia, corte de cabelo, barba, Lopes Club",
  authors: [{ name: "Lopes Club" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">      
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased font-sans">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
