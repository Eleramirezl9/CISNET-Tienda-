'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimacionEntradaProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  tipo?: 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right';
}

export function AnimacionEntrada({
  children,
  delay = 0,
  className = '',
  tipo = 'fade-up'
}: AnimacionEntradaProps) {
  const [estaVisible, setEstaVisible] = useState(false);
  const [prefiereMovimientoReducido, setPrefiereMovimientoReducido] = useState(false);
  const elementoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefiereMovimientoReducido(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefiereMovimientoReducido(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefiereMovimientoReducido) {
      setEstaVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setEstaVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementoRef.current) {
      observer.observe(elementoRef.current);
    }

    return () => {
      if (elementoRef.current) {
        observer.unobserve(elementoRef.current);
      }
    };
  }, [delay, prefiereMovimientoReducido]);

  const animaciones = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-in': 'opacity-0',
    'scale': 'scale-95 opacity-0',
    'slide-left': 'translate-x-8 opacity-0',
    'slide-right': '-translate-x-8 opacity-0',
  };

  const duracion = prefiereMovimientoReducido ? 'duration-0' : 'duration-700';

  return (
    <div
      ref={elementoRef}
      className={`transition-all ${duracion} ease-out ${
        estaVisible
          ? 'translate-y-0 translate-x-0 opacity-100 scale-100'
          : animaciones[tipo]
      } ${className}`}
    >
      {children}
    </div>
  );
}
