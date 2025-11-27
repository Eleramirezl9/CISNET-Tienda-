import Link from 'next/link';

export default function QuienesSomosPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-20 border-b border-zinc-100">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">Inicio</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-900 font-medium">Quiénes Somos</span>
        </nav>
        
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-4">
          Quiénes Somos
        </h1>
        <p className="text-lg text-zinc-600 font-light max-w-2xl">
          Descubre la historia y la misión detrás de CISNET.
        </p>
      </div>

      {/* Coming Soon */}
      <div className="max-w-7xl mx-auto px-8 py-32">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">
            Nuestra Historia
          </h2>
          <p className="text-zinc-600 font-light leading-relaxed mb-8">
            CISNET nace con la visión de proporcionar software de calidad profesional a precios competitivos. Creemos en la excelencia, la transparencia y el servicio al cliente.
          </p>
          
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
