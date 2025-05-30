export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-8 border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Seu Nome ou Empresa. Todos os direitos reservados.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="/privacidade" className="hover:underline">Privacidade</a>
          <a href="/termos" className="hover:underline">Termos</a>
          <a href="/contato" className="hover:underline">Contato</a>
        </div>
      </div>
    </footer>
  );
}