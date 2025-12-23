'use client';

import { useState, useRef } from 'react';

/**
 * CISNET - Efectos Interactivos de Energía
 *
 * Efectos únicos:
 * - Interacción con mouse (hover)
 * - Explosiones de partículas al hacer click
 * - Anillos orbitales reactivos
 * - Partículas que siguen el cursor
 */

interface Explosion {
  id: number;
  x: number;
  y: number;
}

export function CisnetHeroAnimated() {
  const [mousePos, setMousePos] = useState({ x: 300, y: 350 });
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const explosionIdRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 700;
    setMousePos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 600;
    const y = ((touch.clientY - rect.top) / rect.height) * 700;
    setMousePos({ x, y });
  };

  const createExplosion = (x: number, y: number) => {
    const newExplosion = {
      id: explosionIdRef.current++,
      x,
      y
    };

    setExplosions(prev => [...prev, newExplosion]);

    // Remover explosión después de la animación
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
    }, 2000);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 700;
    createExplosion(x, y);
  };

  const handleTouch = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 600;
    const y = ((touch.clientY - rect.top) / rect.height) * 700;
    createExplosion(x, y);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <style>{`
        /* Fragmentación y reconstrucción - Efecto principal */
        @keyframes fragmentAndRebuild {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
          15% {
            opacity: 0.8;
            transform: scale(1.05);
          }
          20% {
            opacity: 0;
            transform: scale(0.3) translateY(-100px);
            filter: blur(20px);
          }
          50% {
            opacity: 0;
            transform: scale(0.1) translateY(-150px) rotate(180deg);
            filter: blur(30px);
          }
          65% {
            opacity: 0.3;
            transform: scale(0.5) translateY(50px) rotate(0deg);
            filter: blur(15px);
          }
          80% {
            opacity: 0.7;
            transform: scale(0.95) translateY(0);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        /* Explosión de partículas */
        @keyframes particleExplosion {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          20% {
            opacity: 1;
            transform: translate(var(--tx), var(--ty)) scale(1.5);
          }
          50% {
            opacity: 0.8;
            transform: translate(calc(var(--tx) * 2), calc(var(--ty) * 2)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
        }

        /* Fragmentación de partes individuales */
        @keyframes fragmentPart {
          0%, 100% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          20% {
            opacity: 0.5;
            transform: translateX(var(--fx)) translateY(var(--fy)) rotate(var(--fr));
          }
          50% {
            opacity: 0.2;
            transform: translateX(calc(var(--fx) * 1.5)) translateY(calc(var(--fy) * 1.5)) rotate(calc(var(--fr) * 2));
          }
          80% {
            opacity: 0.7;
            transform: translateX(calc(var(--fx) * 0.3)) translateY(calc(var(--fy) * 0.3)) rotate(calc(var(--fr) * 0.5));
          }
        }

        /* Anillos de energía explosiva */
        @keyframes energyWave {
          0% {
            opacity: 0;
            transform: scale(0.5);
            stroke-width: 0;
          }
          30% {
            opacity: 0.8;
            stroke-width: 4;
          }
          60% {
            opacity: 0.5;
            transform: scale(2.5);
            stroke-width: 2;
          }
          100% {
            opacity: 0;
            transform: scale(4);
            stroke-width: 0;
          }
        }

        /* Orbital rings */
        @keyframes orbitSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbitReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        /* Eye glow */
        @keyframes eyeGlow {
          0%, 100% {
            opacity: 0.4;
            filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.5));
          }
          50% {
            opacity: 0.9;
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.8));
          }
        }

        /* Pulse effect */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        /* Light trail */
        @keyframes lightTrail {
          0% { opacity: 0; stroke-dashoffset: 0; }
          30% { opacity: 0.8; }
          60% { opacity: 0.6; stroke-dashoffset: -100; }
          100% { opacity: 0; stroke-dashoffset: -200; }
        }

        /* Explosión interactiva al hacer click */
        @keyframes clickExplosion {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          10% {
            opacity: 1;
          }
          30% {
            opacity: 0.8;
            transform: translate(var(--tx), var(--ty)) scale(2);
          }
          60% {
            opacity: 0.4;
            transform: translate(calc(var(--tx) * 2.5), calc(var(--ty) * 2.5)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--tx) * 3), calc(var(--ty) * 3)) scale(0.5);
          }
        }

        /* Onda expansiva del click */
        @keyframes clickWave {
          0% {
            opacity: 0;
            transform: scale(0);
            stroke-width: 8;
          }
          20% {
            opacity: 1;
            stroke-width: 6;
          }
          50% {
            opacity: 0.6;
            transform: scale(3);
            stroke-width: 3;
          }
          100% {
            opacity: 0;
            transform: scale(6);
            stroke-width: 0;
          }
        }

        /* Aplicar animaciones */
        .swan-body {
          animation: fragmentAndRebuild 12s ease-in-out infinite;
        }

        .body-part {
          animation: fragmentPart 12s ease-in-out infinite;
        }

        .energy-wave {
          animation: energyWave 12s ease-out infinite;
        }

        .explosion-particle {
          animation: particleExplosion 12s ease-out infinite;
        }

        .orbit-ring-1 {
          animation: orbitSlow 40s linear infinite;
          transform-origin: center;
        }

        .orbit-ring-2 {
          animation: orbitReverse 50s linear infinite;
          transform-origin: center;
        }

        .orbit-ring-3 {
          animation: orbitSlow 60s linear infinite;
          transform-origin: center;
        }

        #eye-glow {
          animation: eyeGlow 5s ease-in-out infinite;
        }

        .light-trail {
          animation: lightTrail 6s ease-in-out infinite;
        }

        .energy-particle {
          animation: pulse 3s ease-in-out infinite;
        }

        .click-explosion-particle {
          animation: clickExplosion 2s ease-out forwards;
        }

        .click-wave {
          animation: clickWave 2s ease-out forwards;
        }

        /* Delays escalonados para partes */
        #head { animation-delay: 0s; }
        #neck { animation-delay: 0.1s; }
        #body { animation-delay: 0.2s; }
        #wing-left { animation-delay: 0.15s; }
        #wing-right { animation-delay: 0.15s; }

        /* Interactividad con cursor */
        svg {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        svg:hover .orbit-ring-1 {
          animation-duration: 30s;
          opacity: 0.8;
        }

        svg:hover .orbit-ring-2 {
          animation-duration: 35s;
          opacity: 0.7;
        }

        svg:hover .orbit-ring-3 {
          animation-duration: 45s;
          opacity: 0.5;
        }

        svg:hover .energy-particle {
          animation-duration: 2s;
          r: 4;
        }

        /* Optimizaciones para móvil */
        @media (max-width: 1024px) {
          svg {
            max-width: 100%;
            height: auto;
          }

          /* Reducir número de partículas en móvil para mejor rendimiento */
          .explosion-particle:nth-child(n+9) {
            display: none;
          }

          /* Animaciones más suaves en móvil */
          .orbit-ring-1 {
            animation-duration: 50s !important;
          }

          .orbit-ring-2 {
            animation-duration: 60s !important;
          }

          .orbit-ring-3 {
            animation-duration: 70s !important;
          }

          /* Ocultar indicador de cursor en móvil */
          circle[opacity="0.4"] {
            display: none;
          }
        }

        /* Soporte táctil - efecto de toque */
        @media (hover: none) and (pointer: coarse) {
          svg {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 600 700"
        className="w-full h-full max-w-3xl"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouch}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="25%" stopColor="#bfdbfe" />
            <stop offset="60%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="40%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          <linearGradient id="wingFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#1e40af" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#2563eb" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
          </radialGradient>

          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>

          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="enhancedGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ondas de energía explosiva */}
        <g id="energy-waves">
          <circle
            className="energy-wave"
            cx="300"
            cy="350"
            r="100"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            opacity="0"
          />
          <circle
            className="energy-wave"
            cx="300"
            cy="350"
            r="100"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0"
            style={{ animationDelay: '0.3s' }}
          />
          <circle
            className="energy-wave"
            cx="300"
            cy="350"
            r="100"
            fill="none"
            stroke="#0891b2"
            strokeWidth="1.5"
            opacity="0"
            style={{ animationDelay: '0.6s' }}
          />
        </g>

        {/* Partículas de explosión */}
        <g id="explosion-particles">
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            const tx = Math.cos((angle * Math.PI) / 180) * 150;
            const ty = Math.sin((angle * Math.PI) / 180) * 150;
            return (
              <circle
                key={i}
                className="explosion-particle"
                cx="300"
                cy="350"
                r="4"
                fill="#22d3ee"
                filter="url(#glow)"
                style={{
                  '--tx': `${tx}px`,
                  '--ty': `${ty}px`,
                  animationDelay: `${i * 0.05}s`
                } as React.CSSProperties}
              />
            );
          })}
        </g>

        {/* Anillos orbitales */}
        <g id="energy-rings">
          <g className="orbit-ring-1" opacity="0.6">
            <circle
              cx="300"
              cy="350"
              r="160"
              fill="none"
              stroke="rgba(34, 211, 238, 0.4)"
              strokeWidth="2.5"
              strokeDasharray="25 18"
              filter="url(#glow)"
            />
            <circle
              cx="300"
              cy="350"
              r="160"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="3"
              strokeDasharray="70 330"
              className="light-trail"
            />
          </g>

          <g className="orbit-ring-2" opacity="0.5">
            <circle
              cx="300"
              cy="350"
              r="205"
              fill="none"
              stroke="rgba(6, 182, 212, 0.35)"
              strokeWidth="2"
              strokeDasharray="30 22"
              filter="url(#glow)"
            />
          </g>

          <g className="orbit-ring-3" opacity="0.35">
            <circle
              cx="300"
              cy="350"
              r="250"
              fill="none"
              stroke="rgba(34, 211, 238, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="35 28"
            />
          </g>
        </g>


        {/* Partículas orbitales */}
        <g id="orbital-particles">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            const x = 300 + Math.cos((angle * Math.PI) / 180) * 180;
            const y = 350 + Math.sin((angle * Math.PI) / 180) * 180;
            return (
              <circle
                key={i}
                className="energy-particle"
                cx={x}
                cy={y}
                r="3"
                fill="#22d3ee"
                filter="url(#glow)"
                style={{ animationDelay: `${i * 0.375}s` }}
              />
            );
          })}
        </g>

        {/* Explosiones interactivas al hacer click */}
        {explosions.map((explosion) => (
          <g key={explosion.id}>
            {/* Onda expansiva */}
            <circle
              className="click-wave"
              cx={explosion.x}
              cy={explosion.y}
              r="20"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4"
              opacity="0"
            />
            <circle
              className="click-wave"
              cx={explosion.x}
              cy={explosion.y}
              r="20"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              opacity="0"
              style={{ animationDelay: '0.1s' }}
            />

            {/* Partículas explosivas */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              const tx = Math.cos((angle * Math.PI) / 180) * 80;
              const ty = Math.sin((angle * Math.PI) / 180) * 80;
              return (
                <circle
                  key={i}
                  className="click-explosion-particle"
                  cx={explosion.x}
                  cy={explosion.y}
                  r="5"
                  fill="#22d3ee"
                  filter="url(#glow)"
                  style={{
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    animationDelay: `${i * 0.03}s`
                  } as React.CSSProperties}
                />
              );
            })}
          </g>
        ))}

        {/* Indicador sutil del cursor (punto que sigue el mouse) */}
        <circle
          cx={mousePos.x}
          cy={mousePos.y}
          r="2"
          fill="#22d3ee"
          opacity="0.4"
          filter="url(#glow)"
          style={{
            transition: 'cx 0.1s ease, cy 0.1s ease',
            pointerEvents: 'none'
          }}
        />
      </svg>
    </div>
  );
}
