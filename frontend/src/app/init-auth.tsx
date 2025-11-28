'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/compartido/hooks/use-auth';

/**
 * Componente que inicializa la sesión desde localStorage
 * Se ejecuta una sola vez al cargar la app
 */
export function InitAuth({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().inicializarDesdeStorage();
  }, []);

  return <>{children}</>;
}
