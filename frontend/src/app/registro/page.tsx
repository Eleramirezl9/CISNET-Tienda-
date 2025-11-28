'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/compartido/hooks/use-auth';

export default function RegistroPage() {
  const router = useRouter();
  const { registrar, estaCargando, error, limpiarError, estaAutenticado } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    confirmarPassword: '',
  });

  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (estaAutenticado) {
      router.push('/');
    }
  }, [estaAutenticado, router]);

  /**
   * Validar formulario
   */
  const validar = (): boolean => {
    const errores: Record<string, string> = {};

    if (!formData.email.trim()) {
      errores.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errores.email = 'Correo inválido';
    }

    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      errores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido.trim()) {
      errores.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length < 2) {
      errores.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.password.trim()) {
      errores.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errores.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(formData.password)) {
      errores.password = 'La contraseña debe contener al menos una mayúscula';
    } else if (!/[0-9]/.test(formData.password)) {
      errores.password = 'La contraseña debe contener al menos un número';
    }

    if (!formData.confirmarPassword.trim()) {
      errores.confirmarPassword = 'Confirmar contraseña es requerido';
    } else if (formData.password !== formData.confirmarPassword) {
      errores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  /**
   * Manejar cambios en el formulario
   */
  const manejarCambio = (campo: keyof typeof formData, valor: string) => {
    setFormData({ ...formData, [campo]: valor });
    if (erroresValidacion[campo]) {
      setErroresValidacion({ ...erroresValidacion, [campo]: '' });
    }
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
      const { confirmarPassword, ...datosRegistro } = formData;
      await registrar(datosRegistro);
      // La redirección se maneja en el useEffect de arriba
    } catch (error) {
      // El error ya está en el estado del store
      console.error('Register error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-8 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
            Crear Cuenta
          </h1>
          <p className="text-zinc-600 font-light">
            Únete a CISNET hoy mismo
          </p>
        </div>

        {/* Mensaje de error general */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@ejemplo.com"
              value={formData.email}
              onChange={(e) => manejarCambio('email', e.target.value)}
              disabled={estaCargando}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed text-sm"
            />
            {erroresValidacion.email && (
              <p className="mt-1 text-xs text-red-600">{erroresValidacion.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Juan"
                value={formData.nombre}
                onChange={(e) => manejarCambio('nombre', e.target.value)}
                disabled={estaCargando}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed text-sm"
              />
              {erroresValidacion.nombre && (
                <p className="mt-1 text-xs text-red-600">{erroresValidacion.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={(e) => manejarCambio('apellido', e.target.value)}
                disabled={estaCargando}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed text-sm"
              />
              {erroresValidacion.apellido && (
                <p className="mt-1 text-xs text-red-600">{erroresValidacion.apellido}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => manejarCambio('password', e.target.value)}
              disabled={estaCargando}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed text-sm"
            />
            {erroresValidacion.password && (
              <p className="mt-1 text-xs text-red-600">{erroresValidacion.password}</p>
            )}
            <p className="mt-2 text-xs text-zinc-500">
              Mínimo 8 caracteres, una mayúscula y un número
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmarPassword}
              onChange={(e) => manejarCambio('confirmarPassword', e.target.value)}
              disabled={estaCargando}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50 disabled:cursor-not-allowed text-sm"
            />
            {erroresValidacion.confirmarPassword && (
              <p className="mt-1 text-xs text-red-600">{erroresValidacion.confirmarPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={estaCargando}
            className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed mt-6"
          >
            {estaCargando ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-600 font-light text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-zinc-900 font-medium hover:underline">
              Iniciar sesión
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
