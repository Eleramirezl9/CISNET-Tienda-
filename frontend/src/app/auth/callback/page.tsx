'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Guardar el token en el store
      setToken(token);

      // Redirigir al inicio
      router.push('/');
    } else {
      // Si no hay token, redirigir al login con error
      router.push('/login?error=oauth_failed');
    }
  }, [searchParams, setToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
        <p className="mt-4 text-zinc-600">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Cargando...</p>
        </div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
