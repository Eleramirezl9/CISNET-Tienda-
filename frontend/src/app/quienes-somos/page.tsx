import Link from 'next/link';
import type { Metadata } from 'next';
import { AnimacionEntrada } from '@/compartido/componentes/AnimacionEntrada';
import { TarjetaValor } from '@/compartido/componentes/TarjetaValor';
import { ItemLineaTiempo } from '@/compartido/componentes/ItemLineaTiempo';
import { TarjetaEstadistica } from '@/compartido/componentes/TarjetaEstadistica';
import { PAISES_COBERTURA } from '@/compartido/constantes/quienes-somos';

export const metadata: Metadata = {
  title: 'Quiénes Somos - CISNET | Soluciones Tecnológicas Latinoamérica',
  description: 'Líderes en soluciones tecnológicas para Latinoamérica y el Caribe. Conoce nuestra historia, valores y cobertura regional desde México hasta Colombia. Más de 1,000 empresas confían en CISNET.',
  keywords: ['CISNET', 'tecnología Latinoamérica', 'software empresarial', 'soluciones tecnológicas', 'empresa tecnológica Guatemala'],
  openGraph: {
    title: 'Quiénes Somos - CISNET',
    description: 'Líderes en soluciones tecnológicas para Latinoamérica y el Caribe con presencia en 8 países.',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function QuienesSomosPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-zinc-50 to-white">
      {/* Header Hero */}
      <div className="relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-800 via-zinc-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <AnimacionEntrada tipo="fade-in">
            <nav className="flex items-center gap-2 text-sm mb-12">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                Inicio
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-white font-medium">Quiénes Somos</span>
            </nav>
          </AnimacionEntrada>

          <AnimacionEntrada delay={100}>
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Quiénes Somos
              </h1>
            </div>
          </AnimacionEntrada>

          <AnimacionEntrada delay={200}>
            <p className="text-xl text-zinc-300 font-light max-w-3xl leading-relaxed">
              Líderes en soluciones tecnológicas para Latinoamérica y el Caribe
            </p>
          </AnimacionEntrada>
        </div>
      </div>

      {/* Nuestra Historia */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <AnimacionEntrada>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-zinc-100 rounded-full text-sm font-semibold text-zinc-700 mb-6">
                Nuestra Historia
              </div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-6 leading-tight">
                Una década transformando empresas en Latinoamérica
              </h2>
              <div className="space-y-4 text-zinc-600 leading-relaxed">
                <p>
                  CISNET nació en 2014 con una visión clara: democratizar el acceso a tecnología de calidad en toda Latinoamérica y el Caribe. Fundada por un grupo de emprendedores apasionados por la tecnología, hemos crecido desde una pequeña startup hasta convertirnos en una referencia regional en soluciones de software.
                </p>
                <p>
                  Especializados en el mercado de habla hispana, entendemos las necesidades únicas de nuestros clientes y ofrecemos soluciones adaptadas a la realidad latinoamericana.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-linear-to-br from-zinc-100 to-zinc-200 p-8 shadow-2xl">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                  <svg className="w-32 h-32 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </AnimacionEntrada>
      </section>

      {/* Estadísticas */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <AnimacionEntrada>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Nuestro Impacto en Números
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Cobertura desde México hasta Colombia
              </p>
            </div>
          </AnimacionEntrada>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimacionEntrada delay={100}>
              <TarjetaEstadistica
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                }
                valor="8"
                etiqueta="Países"
                descripcion="Presencia activa"
              />
            </AnimacionEntrada>

            <AnimacionEntrada delay={200}>
              <TarjetaEstadistica
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                }
                valor="1,000+"
                etiqueta="Empresas"
                descripcion="Atendidas"
              />
            </AnimacionEntrada>

            <AnimacionEntrada delay={300}>
              <TarjetaEstadistica
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                valor="50,000+"
                etiqueta="Usuarios"
                descripcion="Activos"
              />
            </AnimacionEntrada>

            <AnimacionEntrada delay={400}>
              <TarjetaEstadistica
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
                valor="Español"
                etiqueta="Nativo"
                descripcion="Especialización regional"
              />
            </AnimacionEntrada>
          </div>
        </div>
      </section>

      {/* Línea de Tiempo */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <AnimacionEntrada>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-zinc-100 rounded-full text-sm font-semibold text-zinc-700 mb-6">
              Nuestra Evolución
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Línea de Tiempo
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Más de 10 años construyendo el futuro digital de Latinoamérica
            </p>
          </div>
        </AnimacionEntrada>

        <div className="mt-12">
          <AnimacionEntrada delay={100}>
            <ItemLineaTiempo
              ano="2014"
              titulo="Fundación"
              descripcion="CISNET es fundada en Guatemala con el objetivo de ofrecer software de calidad a empresas latinoamericanas."
              icono={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              }
            />
          </AnimacionEntrada>

          <AnimacionEntrada delay={200}>
            <ItemLineaTiempo
              ano="2016"
              titulo="Expansión Regional"
              descripcion="Expandimos nuestras operaciones a México y Colombia, estableciendo una presencia sólida en Centroamérica."
              icono={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              }
            />
          </AnimacionEntrada>

          <AnimacionEntrada delay={300}>
            <ItemLineaTiempo
              ano="2018"
              titulo="Red de Asociados"
              descripcion="Lanzamos nuestro programa de asociados tecnológicos, conectando con expertos de toda la región."
              icono={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
          </AnimacionEntrada>

          <AnimacionEntrada delay={400}>
            <ItemLineaTiempo
              ano="2020"
              titulo="Transformación Digital"
              descripcion="Aceleramos la digitalización durante la pandemia, ayudando a miles de empresas a adaptarse al mundo digital."
              icono={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              }
            />
          </AnimacionEntrada>

          <AnimacionEntrada delay={500}>
            <ItemLineaTiempo
              ano="2022"
              titulo="Seguridad & Cloud"
              descripcion="Incorporamos soluciones avanzadas de ciberseguridad y computación en la nube."
              icono={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />
          </AnimacionEntrada>

          <AnimacionEntrada delay={600}>
            <ItemLineaTiempo
              ano="2024"
              titulo="Nueva Plataforma"
              descripcion="Lanzamos nuestra plataforma renovada con integración de IA y nuevas funcionalidades avanzadas."
              icono={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
              }
              esUltimo
            />
          </AnimacionEntrada>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <AnimacionEntrada>
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-zinc-100 rounded-full text-sm font-semibold text-zinc-700 mb-6">
                Nuestros Pilares
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Valores que nos Definen
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Principios fundamentales que guían cada decisión y acción en CISNET
              </p>
            </div>
          </AnimacionEntrada>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimacionEntrada delay={100}>
              <TarjetaValor
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
                titulo="Excelencia"
                descripcion="Nos comprometemos a ofrecer productos y servicios de la más alta calidad, superando las expectativas de nuestros clientes."
              />
            </AnimacionEntrada>

            <AnimacionEntrada delay={200}>
              <TarjetaValor
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                titulo="Confianza"
                descripcion="Construimos relaciones duraderas basadas en la transparencia, honestidad y cumplimiento de nuestros compromisos."
              />
            </AnimacionEntrada>

            <AnimacionEntrada delay={300}>
              <TarjetaValor
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                }
                titulo="Innovación"
                descripcion="Estamos constantemente buscando nuevas formas de mejorar y evolucionar, manteniéndonos a la vanguardia tecnológica."
              />
            </AnimacionEntrada>

            <AnimacionEntrada delay={400}>
              <TarjetaValor
                icono={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                }
                titulo="Impacto Regional"
                descripcion="Trabajamos para contribuir al desarrollo tecnológico de Latinoamérica y el Caribe, fortaleciendo la economía digital."
              />
            </AnimacionEntrada>
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="bg-zinc-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-800 via-zinc-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-8">
          <AnimacionEntrada>
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white mb-6">
                Nuestra Presencia
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Cobertura Regional
              </h2>
              <p className="text-zinc-300 max-w-2xl mx-auto">
                Presencia en 8 países desde México hasta Colombia
              </p>
            </div>
          </AnimacionEntrada>

          <AnimacionEntrada delay={100}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {PAISES_COBERTURA.map((item) => (
                  <div
                    key={item.pais}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-white font-medium">{item.pais}</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Soporte en horario local</h3>
                    <p className="text-zinc-400 text-sm">Atención personalizada en tu zona horaria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Precios en moneda local</h3>
                    <p className="text-zinc-400 text-sm">Sin complicaciones de conversión</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Métodos de pago regionales</h3>
                    <p className="text-zinc-400 text-sm">Acepta opciones de pago locales</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Cumplimiento regulatorio local</h3>
                    <p className="text-zinc-400 text-sm">Adaptado a las leyes de cada país</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimacionEntrada>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <AnimacionEntrada>
          <div className="relative overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Listo para unirte a nuestra historia?
              </h2>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                Descubre cómo CISNET puede impulsar el crecimiento de tu empresa con nuestras soluciones tecnológicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explorar Productos
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </AnimacionEntrada>
      </section>
    </main>
  );
}
