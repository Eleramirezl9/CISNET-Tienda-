import Link from 'next/link';

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-20 border-b border-zinc-100">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">Inicio</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-900 font-medium">Servicios</span>
        </nav>
        
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-4">
          Nuestros Servicios
        </h1>
        <p className="text-lg text-zinc-600 font-light max-w-2xl">
          Soluciones profesionales diseñadas para impulsar tu negocio.
        </p>
      </div>

      {/* Coming Soon */}
      <div className="max-w-7xl mx-auto px-8 py-32 text-center">
        <div className="inline-block">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">
            Próximamente
          </h2>
          <p className="text-zinc-600 font-light mb-8">
            Estamos preparando una experiencia excepcional para ti.
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
