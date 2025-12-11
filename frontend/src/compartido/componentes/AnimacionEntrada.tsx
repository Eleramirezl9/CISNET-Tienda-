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
  const elementoRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setEstaVisible(true);
            }, delay);
          } else {
            setEstaVisible(true);
          }
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  const animaciones = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-in': 'opacity-0',
    'scale': 'scale-95 opacity-0',
    'slide-left': 'translate-x-8 opacity-0',
    'slide-right': '-translate-x-8 opacity-0',
  };

  return (
    <div
      ref={elementoRef}
      className={`transition-all duration-700 ease-out ${
        estaVisible
          ? 'translate-y-0 translate-x-0 opacity-100 scale-100'
          : animaciones[tipo]
      } ${className}`}
    >
      {children}
    </div>
  );
}
