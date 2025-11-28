'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';

export default function PerfilPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCargando, logout } = useAuth();
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push('/login?returnUrl=/perfil');
    } else if (estaAutenticado) {
      setCargandoPerfil(false);
    }
  }, [estaAutenticado, estaCargando, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (estaCargando || cargandoPerfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mi Perfil</h1>
          <p className="text-slate-600">Gestiona tu información personal</p>
        </div>

        {/* Tarjeta de perfil */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner superior */}
          <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900"></div>

          {/* Contenido del perfil */}
          <div className="px-8 pb-8">
            {/* Avatar y nombre */}
            <div className="flex flex-col items-center -mt-16 mb-8">
              <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {usuario.nombre.charAt(0).toUpperCase()}
                    {usuario.apellido.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Indicador de estado online */}
                <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-white shadow-md"></div>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                {usuario.nombre} {usuario.apellido}
              </h2>
              <p className="text-slate-600 mt-1">{usuario.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    usuario.rol === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-blue-100 text-blue-800 border-blue-300'
                  }`}
                >
                  {usuario.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  En línea
                </span>
              </div>
            </div>

            {/* Información detallada */}
            <div className="space-y-6">
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Información de la cuenta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Nombre
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-900">{usuario.nombre}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Apellido
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-900">{usuario.apellido}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Correo electrónico
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-900">{usuario.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      ID de usuario
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-900 text-sm font-mono">{usuario.id}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Estado
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          usuario.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                >
                  Volver al inicio
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>¿Necesitas actualizar tu información?</p>
          <button className="text-slate-900 font-medium hover:underline mt-1">
            Contacta con soporte
          </button>
        </div>
      </div>
    </div>
  );
}
