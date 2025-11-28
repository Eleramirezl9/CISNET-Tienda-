'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';
import Link from 'next/link';

interface EstadisticaCard {
  titulo: string;
  valor: string | number;
  icono: string;
  color: string;
  cambio?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!estaCargando) {
      if (!estaAutenticado) {
        router.push('/login?returnUrl=/admin');
      } else if (usuario?.rol !== 'ADMIN') {
        router.push('/');
      } else {
        setCargando(false);
      }
    }
  }, [estaAutenticado, estaCargando, usuario, router]);

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const estadisticas: EstadisticaCard[] = [
    {
      titulo: 'Total Usuarios',
      valor: '2',
      icono: '👥',
      color: 'from-blue-500 to-blue-600',
      cambio: '+2 nuevos',
    },
    {
      titulo: 'Productos',
      valor: '0',
      icono: '📦',
      color: 'from-green-500 to-green-600',
      cambio: 'Sin cambios',
    },
    {
      titulo: 'Pedidos',
      valor: '0',
      icono: '🛒',
      color: 'from-purple-500 to-purple-600',
      cambio: 'Sin pedidos',
    },
    {
      titulo: 'Ingresos',
      valor: '$0',
      icono: '💰',
      color: 'from-yellow-500 to-yellow-600',
      cambio: '$0 hoy',
    },
  ];

  const accionesRapidas = [
    {
      titulo: 'Gestionar Productos',
      descripcion: 'Crear, editar y eliminar productos',
      icono: '📦',
      href: '/admin/productos',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      titulo: 'Gestionar Usuarios',
      descripcion: 'Ver y administrar usuarios',
      icono: '👥',
      href: '/admin/usuarios',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      titulo: 'Ver Pedidos',
      descripcion: 'Administrar pedidos y ventas',
      icono: '🛒',
      href: '/admin/pedidos',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      titulo: 'Roles y Permisos',
      descripcion: 'Gestionar roles y permisos',
      icono: '🔐',
      href: '/admin/roles',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900">
                Panel de Administración
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Bienvenido, {usuario?.nombre} {usuario?.apellido}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/perfil"
                className="ml-3 inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Mi Perfil
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Resumen General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {estadisticas.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`bg-gradient-to-r ${stat.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{stat.icono}</div>
                    <div className="text-right">
                      <p className="text-white text-opacity-90 text-sm font-medium">
                        {stat.titulo}
                      </p>
                      <p className="text-white text-3xl font-bold mt-1">
                        {stat.valor}
                      </p>
                    </div>
                  </div>
                </div>
                {stat.cambio && (
                  <div className="bg-white px-4 py-3">
                    <p className="text-sm text-slate-600">{stat.cambio}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accionesRapidas.map((accion, index) => (
              <Link
                key={index}
                href={accion.href}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="text-5xl mb-4">{accion.icono}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {accion.titulo}
                  </h3>
                  <p className="text-sm text-slate-600">{accion.descripcion}</p>
                </div>
                <div className={`${accion.color} h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">
                    {usuario?.nombre?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-slate-900">
                  Sistema inicializado
                </p>
                <p className="text-sm text-slate-500">
                  Usuario admin creado exitosamente
                </p>
              </div>
              <div className="text-sm text-slate-400">Ahora</div>
            </div>

            <div className="text-center py-8 text-slate-400">
              <p>No hay más actividad reciente</p>
              <p className="text-sm mt-2">
                Las acciones del sistema aparecerán aquí
              </p>
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Versión</p>
              <p className="text-lg font-semibold text-slate-900">1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Estado</p>
              <p className="text-lg font-semibold text-green-600">Operacional</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Modo</p>
              <p className="text-lg font-semibold text-slate-900">Desarrollo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
