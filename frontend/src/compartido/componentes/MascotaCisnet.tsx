'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MascotaCisnetProps {
  mensaje?: string;
  posicion?: 'fija' | 'flotante';
  mostrarSaludo?: boolean;
}

const MENSAJES_AYUDA = [
  '¡Hola! Soy Cisney, tu asistente virtual.',
  '¿Necesitas ayuda? ¡Estoy aquí para ti!',
  '¿Tienes alguna pregunta? ¡Pregúntame!',
  '¡Explora nuestros productos y servicios!',
  '¿Buscas algo específico? Te puedo guiar.',
];

const MENSAJES_CONTEXTO: Record<string, string> = {
  '/': '¡Bienvenido a CISNET! Explora nuestras soluciones tecnológicas.',
  '/productos': '¡Descubre nuestra variedad de productos tecnológicos!',
  '/servicios': 'Ofrecemos servicios de desarrollo, hosting y más.',
  '/asociados': '¡Conoce a nuestros colaboradores premium!',
  '/quienes-somos': '¡Conoce nuestra historia y equipo!',
  '/carrito': '¿Listo para finalizar tu compra? ¡Te ayudo!',
};

export function MascotaCisnet({
  mensaje,
  posicion = 'fija',
  mostrarSaludo = true,
}: MascotaCisnetProps) {
  const [visible, setVisible] = useState(false);
  const [mensajeActual, setMensajeActual] = useState('');
  const [mostrarBurbuja, setMostrarBurbuja] = useState(false);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    // Aparecer después de un delay
    const timerVisible = setTimeout(() => setVisible(true), 1500);

    return () => clearTimeout(timerVisible);
  }, []);

  useEffect(() => {
    if (!visible || !mostrarSaludo) return;

    // Mostrar saludo inicial
    const timerSaludo = setTimeout(() => {
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      const mensajeContexto = MENSAJES_CONTEXTO[path] || MENSAJES_AYUDA[0];
      setMensajeActual(mensaje || mensajeContexto);
      setMostrarBurbuja(true);

      // Ocultar burbuja después de 5 segundos
      setTimeout(() => setMostrarBurbuja(false), 5000);
    }, 2000);

    return () => clearTimeout(timerSaludo);
  }, [visible, mostrarSaludo, mensaje]);

  const handleClick = () => {
    setAnimando(true);
    setTimeout(() => setAnimando(false), 600);

    // Mostrar un mensaje aleatorio
    const nuevoMensaje = MENSAJES_AYUDA[Math.floor(Math.random() * MENSAJES_AYUDA.length)];
    setMensajeActual(nuevoMensaje);
    setMostrarBurbuja(true);

    setTimeout(() => setMostrarBurbuja(false), 4000);
  };

  const handleMouseEnter = () => {
    if (!mostrarBurbuja) {
      setMensajeActual('¿En qué puedo ayudarte?');
      setMostrarBurbuja(true);
    }
  };

  const handleMouseLeave = () => {
    if (mostrarBurbuja && mensajeActual === '¿En qué puedo ayudarte?') {
      setMostrarBurbuja(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`
        ${posicion === 'fija' ? 'fixed bottom-6 right-6 z-50' : 'relative'}
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      {/* Burbuja de mensaje */}
      <div
        className={`
          absolute bottom-full right-0 mb-4
          transition-all duration-300 ease-out
          ${mostrarBurbuja ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
        `}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-zinc-100 p-4 max-w-[280px]">
          {/* Flecha */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-zinc-100 transform rotate-45" />

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 mb-1">Cisney</p>
              <p className="text-sm text-zinc-600 leading-relaxed">{mensajeActual}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mascota */}
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          group relative w-20 h-20 md:w-24 md:h-24
          transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-cyan-400/30 rounded-full
          ${animando ? 'animate-bounce' : ''}
        `}
        aria-label="Asistente virtual Cisney"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Imagen de la mascota */}
        <div className="relative w-full h-full p-1">
          <Image
            src="/mascota-cisnet.png"
            alt="Cisney - Mascota de CISNET"
            fill
            className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 80px, 96px"
            priority
          />
        </div>

        {/* Indicador de disponible */}
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </span>
      </button>

      {/* Tooltip sutil */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-xs text-zinc-500 whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          Click para hablar
        </span>
      </div>
    </div>
  );
}

// Versión inline para usar dentro de secciones
export function MascotaInline({ className = '' }: { className?: string }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center gap-4 ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Glow */}
        <div
          className={`
            absolute inset-0 rounded-full
            bg-gradient-to-br from-cyan-400/30 to-blue-500/30
            blur-lg transition-opacity duration-500
            ${hovering ? 'opacity-100' : 'opacity-50'}
          `}
        />

        {/* Imagen */}
        <Image
          src="/mascota-cisnet.png"
          alt="Cisney"
          fill
          className={`
            object-contain drop-shadow-lg
            transition-transform duration-500
            ${hovering ? 'scale-110' : 'scale-100'}
          `}
          sizes="80px"
        />
      </div>
    </div>
  );
}
