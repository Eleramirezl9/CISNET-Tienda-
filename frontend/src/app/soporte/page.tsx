import Link from 'next/link';

export default function SoportePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-20 border-b border-zinc-100">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">Inicio</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-900 font-medium">Soporte</span>
        </nav>
        
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-4">
          Centro de Soporte
        </h1>
        <p className="text-lg text-zinc-600 font-light max-w-2xl">
          Estamos aquí para ayudarte. Consulta nuestras preguntas frecuentes o contacta con nuestro equipo.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-32">
        <div className="grid md:grid-cols-2 gap-16">
          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  ¿Cómo contacto al soporte?
                </h3>
                <p className="text-zinc-600 font-light">
                  Puedes contactarnos a través del formulario de contacto o por correo electrónico.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  ¿Cuál es el tiempo de respuesta?
                </h3>
                <p className="text-zinc-600 font-light">
                  Nuestro equipo responde en un máximo de 24 horas.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 tracking-tight">
              Contacta con Nosotros
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-zinc-600 mb-1">Email</p>
                <p className="text-zinc-900 font-medium">soporte@cisnet.com</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-zinc-600 mb-1">Horario</p>
                <p className="text-zinc-900 font-medium">24/7 Disponible</p>
              </div>

              <button className="mt-6 w-full px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
