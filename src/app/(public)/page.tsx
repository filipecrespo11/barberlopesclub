import Link from "next/link";
import "../globals.css";

export default function Home() {
  return (
    <>

      <div className="p-8">
        <p className="text-testeverde text-2xl font-bold">
          Se estiver VERDE, o Tailwind config está sendo aplicado.
        </p>
      </div>
     

      <p className="text-testeVerde text-xl font-bold">Teste cor verde</p>
      {/* Header Absolute */}
      <nav className="absolute top-0 left-0 w-full z-50">
        <div className="text-white flex items-center justify-center">
          <ul className="flex space-x-22 -mt-15 ">
            <li className="navText"><a href="#local">LOCAL</a></li>
            <li className="navText"><a href="#serviços">SERVIÇOS</a></li>
          </ul>

          <div className="logo">
            <img src="/assets/lopesclubicon.png" alt="Logo" className="h-80 w-auto" />
          </div>

          <ul className="flex space-x-22 -mt-15">
            <li className="navText"><a href="#galeria">GALERIA</a></li>
            <li className="navText"><a href="#contatos">CONTATOS</a></li>
          </ul>
        </div>
      </nav>
      <main>
        {/* Hero Section */}
        <section className="relative h-screen bg-cover bg-center" style={{
          backgroundImage: 'url(/assets/backgroundhero.jpg)',
          backgroundPosition: 'center 5%'
        }}>
          <div className="mt-30 absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-8">QUALIDADE E EXPERIÊNCIA</h1>
              <Link
                href="#agendamento"
                className="bg-blue-600/80 px-6 py-4 rounded text-black transition-all duration-350 ease-in-out hover:bg-blue-700 hover:px-7 hover:py-4.5 font-bold"
              >
                AGENDAR HORÁRIO
              </Link>
            </div>
          </div>
        </section>
      </main >
    </>
  );
}