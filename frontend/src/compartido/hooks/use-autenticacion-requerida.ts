/**
 * Hook para requerir autenticación
 * Redirige a login si no está autenticado
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

interface OpcionesUsoAutenticacionRequerida {
  redirigirA?: string;
  permitirNoAutenticado?: boolean;
}

/**
 * Hook que requiere autenticación
 * Si no está autenticado, redirige a login con returnUrl
 */
export function useAutenticacionRequerida(
  opciones: OpcionesUsoAutenticacionRequerida = {}
) {
  const router = useRouter();
  const { estaAutenticado } = useAuth();
  const { redirigirA = '/login', permitirNoAutenticado = false } = opciones;

  useEffect(() => {
    // Si necesita autenticación y no está autenticado
    if (!permitirNoAutenticado && !estaAutenticado) {
      // Obtener la URL actual para redirigir después del login
      const urlActual = typeof window !== 'undefined' 
        ? window.location.pathname + window.location.search 
        : '/carrito';

      router.push(`${redirigirA}?returnUrl=${encodeURIComponent(urlActual)}`);
    }
  }, [estaAutenticado, router, redirigirA, permitirNoAutenticado]);

  return { estaAutenticado };
}
