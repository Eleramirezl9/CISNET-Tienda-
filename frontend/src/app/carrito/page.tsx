import Link from 'next/link';

export default function CarritoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-20 border-b border-zinc-100">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">Inicio</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-900 font-medium">Carrito</span>
        </nav>
        
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-4">
          Mi Carrito de Compras
        </h1>
      </div>

      {/* Empty State */}
      <div className="max-w-7xl mx-auto px-8 py-32 text-center">
        <div className="inline-block">
          <svg className="w-16 h-16 text-zinc-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-zinc-600 font-light mb-8">
            Explora nuestro catálogo y agrega productos a tu carrito.
          </p>
          
          <Link
            href="/productos"
            className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </main>
  );
}
