'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/compartido/hooks/use-auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, estaCargando, error, limpiarError, estaAutenticado } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (estaAutenticado) {
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    }
  }, [estaAutenticado, router, searchParams]);

  /**
   * Validar formulario
   */
  const validar = (): boolean => {
    const errores: Record<string, string> = {};

    if (!email.trim()) {
      errores.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.email = 'Correo inválido';
    }

    if (!password.trim()) {
      errores.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  /**
   * Manejar envío del formulario
   */
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    limpiarError();

    if (!validar()) {
      return;
    }

    try {
      await login({ email, password });
      // La redirección se maneja en el useEffect de arriba
    } catch (error) {
      // El error ya está en el estado del store
      console.error('Login error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-zinc-600 font-light">
            Accede a tu cuenta de CISNET
          </p>
        </div>

        {/* Mensaje de error general */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erroresValidacion.email) {
                  setErroresValidacion({ ...erroresValidacion, email: '' });
                }
              }}
              disabled={estaCargando}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed"
            />
            {erroresValidacion.email && (
              <p className="mt-1 text-sm text-red-600">{erroresValidacion.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (erroresValidacion.password) {
                  setErroresValidacion({ ...erroresValidacion, password: '' });
                }
              }}
              disabled={estaCargando}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed"
            />
            {erroresValidacion.password && (
              <p className="mt-1 text-sm text-red-600">{erroresValidacion.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={estaCargando}
            className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            {estaCargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-600 font-light">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-zinc-900 font-medium hover:underline">
              Crear una
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Cargando...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
