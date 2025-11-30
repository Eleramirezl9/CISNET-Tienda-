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

        {/* Separador */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-zinc-500">O continuar con</span>
          </div>
        </div>

        {/* Login con Facebook */}
        <a
          href="http://localhost:3001/api/auth/facebook"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-[#1877F2] text-white rounded-lg font-medium hover:bg-[#166FE5] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continuar con Facebook
        </a>

        {/* Login con Google */}
        <a
          href="http://localhost:3001/api/auth/google"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </a>

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
