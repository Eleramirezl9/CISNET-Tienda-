'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimacionEntrada } from '@/compartido/componentes/AnimacionEntrada';
import { TarjetaAsociado } from './TarjetaAsociado';
import { FormularioSolicitud } from './FormularioSolicitud';
import { SkeletonAsociadosGrid } from './SkeletonAsociado';
import { asociadosServicio } from '../servicios/asociados.servicio';
import type { Asociado } from '../tipos/asociado.tipos';

const BENEFICIOS = [
  {
    icono: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    titulo: 'Beneficios Exclusivos',
    descripcion: 'Accede a descuentos especiales, promociones anticipadas y precios preferenciales en todos nuestros productos.',
  },
  {
    icono: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    titulo: 'Red de Contactos',
    descripcion: 'Únete a una comunidad de profesionales y expande tu red de contactos en el sector tecnológico.',
  },
  {
    icono: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    titulo: 'Soporte Prioritario',
    descripcion: 'Recibe atención preferencial de nuestro equipo de soporte técnico con tiempos de respuesta reducidos.',
  },
  {
    icono: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
    titulo: 'Capacitaciones',
    descripcion: 'Acceso a webinars, talleres y certificaciones exclusivas para potenciar tus habilidades.',
  },
];

export function AsociadosContent() {
  const [asociados, setAsociados] = useState<Asociado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarAsociados = async () => {
      try {
        const data = await asociadosServicio.listarActivos();
        setAsociados(data);
      } catch {
        setError('No se pudieron cargar los asociados');
      } finally {
        setCargando(false);
      }
    };

    cargarAsociados();
  }, []);

  const asociadosDestacados = asociados.filter((a) => a.destacado);
  const otrosAsociados = asociados.filter((a) => !a.destacado);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <AnimacionEntrada tipo="fade-in">
            <nav className="flex items-center gap-2 text-sm mb-12">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                Inicio
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-white font-medium">Asociados</span>
            </nav>
          </AnimacionEntrada>

          <AnimacionEntrada delay={100}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Nuestros Asociados
              </h1>
            </div>
          </AnimacionEntrada>

          <AnimacionEntrada delay={200}>
            <p className="text-xl text-zinc-300 font-light max-w-3xl leading-relaxed">
              Conoce a los profesionales y empresas que forman parte de nuestra red de colaboradores. Juntos construimos soluciones tecnológicas excepcionales.
            </p>
          </AnimacionEntrada>

          <AnimacionEntrada delay={300}>
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#asociados"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-all duration-300"
              >
                Ver Asociados
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a
                href="#unirse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Quiero ser Asociado
              </a>
            </div>
          </AnimacionEntrada>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-8">
          <AnimacionEntrada>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-zinc-900">{asociados.length}+</div>
                <div className="text-sm text-zinc-500 mt-1">Asociados Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-zinc-900">8</div>
                <div className="text-sm text-zinc-500 mt-1">Países</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-zinc-900">50+</div>
                <div className="text-sm text-zinc-500 mt-1">Proyectos Conjuntos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-zinc-900">10</div>
                <div className="text-sm text-zinc-500 mt-1">Años de Experiencia</div>
              </div>
            </div>
          </AnimacionEntrada>
        </div>
      </section>

      {/* Asociados Destacados */}
      {asociadosDestacados.length > 0 && (
        <section id="asociados" className="max-w-7xl mx-auto px-8 py-24">
          <AnimacionEntrada>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200/60 shadow-sm mb-6">
                <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-sm font-semibold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                  Colaboradores Premium
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Asociados Destacados
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Profesionales y empresas que han demostrado excelencia en su colaboración con nosotros
              </p>
            </div>
          </AnimacionEntrada>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {asociadosDestacados.map((asociado, index) => (
              <AnimacionEntrada key={asociado.id} delay={index * 100}>
                <TarjetaAsociado asociado={asociado} />
              </AnimacionEntrada>
            ))}
          </div>
        </section>
      )}

      {/* Todos los Asociados */}
      <section
        id={asociadosDestacados.length === 0 ? 'asociados' : undefined}
        className="bg-zinc-50 py-24"
      >
        <div className="max-w-7xl mx-auto px-8">
          <AnimacionEntrada>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-zinc-200 shadow-sm mb-6">
                <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm font-semibold text-zinc-700">
                  Nuestra Comunidad
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                {asociadosDestacados.length > 0 ? 'Todos Nuestros Asociados' : 'Nuestros Asociados'}
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Una comunidad de expertos comprometidos con la innovación y la excelencia
              </p>
            </div>
          </AnimacionEntrada>

          {cargando ? (
            <SkeletonAsociadosGrid />
          ) : error ? (
            <AnimacionEntrada>
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="text-zinc-600">{error}</p>
              </div>
            </AnimacionEntrada>
          ) : otrosAsociados.length === 0 && asociadosDestacados.length === 0 ? (
            <AnimacionEntrada>
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Próximamente</h3>
                <p className="text-zinc-600 max-w-md mx-auto">
                  Estamos construyendo nuestra red de asociados. ¡Sé uno de los primeros en unirte!
                </p>
              </div>
            </AnimacionEntrada>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otrosAsociados.map((asociado, index) => (
                <AnimacionEntrada key={asociado.id} delay={index * 50}>
                  <TarjetaAsociado asociado={asociado} />
                </AnimacionEntrada>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <AnimacionEntrada>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/60 shadow-sm mb-6">
              <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Ventajas Exclusivas
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Beneficios de ser Asociado
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Descubre las ventajas exclusivas que obtienes al formar parte de nuestra red
            </p>
          </div>
        </AnimacionEntrada>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFICIOS.map((beneficio, index) => (
            <AnimacionEntrada key={beneficio.titulo} delay={index * 100}>
              <div className="group p-8 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-500">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 mb-6">
                  {beneficio.icono}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{beneficio.titulo}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{beneficio.descripcion}</p>
              </div>
            </AnimacionEntrada>
          ))}
        </div>
      </section>

      {/* Formulario de Solicitud */}
      <section id="unirse" className="bg-zinc-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimacionEntrada tipo="slide-right">
              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-sm mb-6">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  <span className="text-sm font-semibold text-white">
                    Únete a Nosotros
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  ¿Quieres ser parte de nuestra red?
                </h2>
                <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                  Si eres un profesional o empresa del sector tecnológico y te gustaría colaborar con nosotros, completa el formulario y nos pondremos en contacto contigo.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Proceso Simple</h4>
                      <p className="text-zinc-400 text-sm">Completa el formulario y te contactaremos en 24-48 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Sin Compromiso</h4>
                      <p className="text-zinc-400 text-sm">Evaluamos cada solicitud de forma personalizada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Beneficios Inmediatos</h4>
                      <p className="text-zinc-400 text-sm">Acceso a todas las ventajas desde el primer día</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimacionEntrada>

            <AnimacionEntrada tipo="slide-left" delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Solicitud de Asociación</h3>
                <FormularioSolicitud />
              </div>
            </AnimacionEntrada>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <AnimacionEntrada>
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-white rounded-3xl p-12 md:p-16 text-center border border-zinc-200">
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                ¿Tienes preguntas sobre el programa?
              </h2>
              <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
                Nuestro equipo está listo para resolver todas tus dudas sobre cómo ser parte de nuestra red de asociados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Contáctanos
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/quienes-somos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-xl font-semibold border border-zinc-200 hover:bg-zinc-50 transition-all duration-300"
                >
                  Conoce más sobre nosotros
                </Link>
              </div>
            </div>
          </div>
        </AnimacionEntrada>
      </section>
    </main>
  );
}
