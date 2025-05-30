export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100">
      
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#local">LOCAL</a></li>
          <li><a href="#serviços">SERVIÇOS</a></li>
        </ul>
        <div className="logo font-bold text-xl">Meu Logo</div>
        <ul className="flex space-x-4">
          <li><a href="#galeria">GALERIA</a></li>
          <li><a href="#contatos">CONTATOS</a></li>
        </ul>
      </nav>
    </div>
  );
}