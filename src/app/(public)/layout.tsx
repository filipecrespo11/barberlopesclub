import type { Metadata } from "next";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Barbearia Lopes Club",
  description: "site de barbearia com agendamento de horário",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        {/* metas, favicon, título, etc */}
      </head>
      <body
        className={`antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>

    </html>
  );
}
