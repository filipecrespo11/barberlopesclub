import Link from "next/link"; 
import "../globals.css";

export default function Home() {
  return (
    <>

      <main className="font-sans">
        {/* Hero Section */}
        <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/assets/backgroundhero.jpg)' }}>
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">QUALIDADE E EXPERIÊNCIA</h1>
              <Link href="#servicos" className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700 transition">VER SERVIÇOS</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}