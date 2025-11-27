import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navegación Premium */}
      <nav className="border-b border-zinc-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-base">C</span>
              </div>
              <span className="text-lg font-semibold text-zinc-900 tracking-tight">CISNET</span>
            </Link>

            {/* Navegación Central */}
            <div className="hidden lg:flex items-center gap-12">
              <Link href="/" className="text-sm text-zinc-900 font-500 hover:text-zinc-700 transition-colors duration-200">
                Inicio
              </Link>
              <Link href="/productos" className="text-sm text-zinc-600 font-500 hover:text-zinc-900 transition-colors duration-200">
                Productos
              </Link>
              <Link href="/servicios" className="text-sm text-zinc-600 font-500 hover:text-zinc-900 transition-colors duration-200">
                Servicios
              </Link>
              <Link href="/carrito" className="text-sm text-zinc-600 font-500 hover:text-zinc-900 transition-colors duration-200">
                Carrito
              </Link>
              <Link href="/quienes-somos" className="text-sm text-zinc-600 font-500 hover:text-zinc-900 transition-colors duration-200">
                Quiénes Somos
              </Link>
              <Link href="/asociados" className="text-sm text-zinc-600 font-500 hover:text-zinc-900 transition-colors duration-200">
                Asociados
              </Link>
              <Link href="/soporte" className="text-sm text-zinc-600 font-500 hover:text-zinc-900 transition-colors duration-200">
                Soporte
              </Link>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors duration-200 font-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pagos
              </button>
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all duration-200 hover:shadow-md"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Minimalista */}
      <main className="flex-1">
        <section className="relative bg-white pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="max-w-3xl">
              {/* Badge sutil */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 mb-12">
                <div className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse"></div>
                <span className="text-xs font-medium text-zinc-700 tracking-wide uppercase">Bienvenido a CISNET</span>
              </div>

              {/* Título Principal - Tipografía fuerte */}
              <h1 className="text-7xl font-bold text-zinc-900 leading-tight mb-8 tracking-tight">
                Software profesional para profesionales
              </h1>

              {/* Subtítulo - Gris suave */}
              <p className="text-lg text-zinc-600 mb-16 leading-relaxed max-w-2xl font-light">
                Descubre herramientas de desarrollo cuidadosamente seleccionadas. Potencia tu productividad, creatividad y resultados con software de la más alta calidad.
              </p>

              {/* CTA con espacio generoso */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/productos"
                  className="group px-8 py-4 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  <span className="flex items-center gap-3">
                    Ver Catálogo
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>

                <button className="px-8 py-4 border border-zinc-200 text-zinc-900 rounded-lg font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200">
                  Conocer Más
                </button>
              </div>
            </div>
          </div>

          {/* Decorativo sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-zinc-100 to-transparent rounded-full opacity-20 blur-3xl -z-10"></div>
        </section>

        {/* Features Grid - Espacio en blanco generoso */}
        <section id="features" className="py-32 bg-white border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-8">
            {/* Encabezado de sección */}
            <div className="max-w-2xl mb-24">
              <h2 className="text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
                ¿Por qué elegir CISNET?
              </h2>
              <p className="text-lg text-zinc-600 font-light">
                Soluciones precisas para profesionales que exigen lo mejor.
              </p>
            </div>

            {/* Grid con gap generoso */}
            <div className="grid md:grid-cols-3 gap-16">
              {/* Feature 1 */}
              <div className="group">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-200 transition-colors duration-300">
                  <svg className="w-7 h-7 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-4 tracking-tight">
                  Velocidad Lightning
                </h3>
                <p className="text-zinc-600 leading-relaxed font-light">
                  Descargas optimizadas, actualizaciones instantáneas y rendimiento sin compromisos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-200 transition-colors duration-300">
                  <svg className="w-7 h-7 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-4 tracking-tight">
                  Seguridad Garantizada
                </h3>
                <p className="text-zinc-600 leading-relaxed font-light">
                  Software verificado, libre de malware y con certificaciones de seguridad internacionales.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-200 transition-colors duration-300">
                  <svg className="w-7 h-7 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-4 tracking-tight">
                  Precios Competitivos
                </h3>
                <p className="text-zinc-600 leading-relaxed font-light">
                  El mejor valor del mercado con transparencia total, sin costos ocultos.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-100 mt-32 pt-32">
              <div className="grid md:grid-cols-2 gap-16">
                {/* Info 1 */}
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                    Soporte Premium
                  </h3>
                  <p className="text-zinc-600 leading-relaxed font-light">
                    Equipo dedicado disponible 24/7 para ayudarte con cualquier duda o problema.
                  </p>
                </div>

                {/* Info 2 */}
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                    Actualizaciones Automáticas
                  </h3>
                  <p className="text-zinc-600 leading-relaxed font-light">
                    Mantén tu software siempre actualizado sin esfuerzo, sin interrupciones en tu trabajo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final - Limpio y elegante */}
        <section className="py-32 bg-white border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="text-5xl font-bold text-zinc-900 mb-8 tracking-tight max-w-3xl mx-auto">
              ¿Listo para potenciar tu productividad?
            </h2>
            <p className="text-lg text-zinc-600 mb-16 max-w-2xl mx-auto font-light">
              Únete a miles de profesionales que confían en CISNET para impulsar su trabajo.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/productos"
                className="px-8 py-4 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Explorar Catálogo
              </Link>
              <button className="px-8 py-4 border border-zinc-200 text-zinc-900 rounded-lg font-medium hover:bg-zinc-50 transition-all duration-200">
                Contactar Soporte
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            {/* Branding */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-sm font-semibold text-zinc-900">CISNET</span>
              </div>
              <p className="text-xs text-zinc-600 font-light">
                Software profesional para profesionales.
              </p>
            </div>

            {/* Productos */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-6">Productos</h4>
              <ul className="space-y-3">
                <li><Link href="/productos" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Catálogo</Link></li>
                <li><Link href="/productos/novedades" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Novedades</Link></li>
                <li><Link href="/productos/ofertas" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Ofertas</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-6">Empresa</h4>
              <ul className="space-y-3">
                <li><Link href="/quienes-somos" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Quiénes Somos</Link></li>
                <li><Link href="/blog" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Blog</Link></li>
                <li><Link href="/carrera" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Carrera</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terminos" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Términos</Link></li>
                <li><Link href="/privacidad" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Privacidad</Link></li>
                <li><Link href="/contacto" className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-light">Contacto</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-600 font-light">© 2025 CISNET. Todos los derechos reservados.</p>
              <div className="flex items-center gap-6">
                <button className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20v-7.21H5.33V9.25h2.96V7.02c0-2.92 1.78-4.51 4.39-4.51 1.25 0 2.33.09 2.63.13v3.05h-1.81c-1.42 0-1.69.67-1.69 1.66v2.18h3.37l-.44 3.54h-2.93V20h-3.46z"/>
                  </svg>
                </button>
                <button className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z"/>
                  </svg>
                </button>
                <button className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
