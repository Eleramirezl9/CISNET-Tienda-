'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';
import { useState, useEffect, useRef } from 'react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, estaAutenticado, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const esAdmin = usuario?.rol === 'ADMIN';

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuUsuarioAbierto(false);
      }
    };

    if (menuUsuarioAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuUsuarioAbierto]);

  // Obtener iniciales del usuario
  const obtenerIniciales = () => {
    const inicial1 = usuario?.nombre?.charAt(0).toUpperCase() || '';
    const inicial2 = usuario?.apellido?.charAt(0).toUpperCase() || '';
    return inicial1 + inicial2 || 'U';
  };

  // Color del badge según el rol
  const colorBadgeRol = esAdmin
    ? 'bg-purple-100 text-purple-800 border-purple-300'
    : 'bg-blue-100 text-blue-800 border-blue-300';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-base">C</span>
                </div>
                <span className="text-lg font-semibold text-slate-900 tracking-tight">CISNET</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/productos'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Productos
              </Link>
              <Link
                href="/servicios"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/servicios'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Servicios
              </Link>
              <Link
                href="/carrito"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/carrito'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Carrito
              </Link>
              <Link
                href="/quienes-somos"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/quienes-somos'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Quiénes Somos
              </Link>
              <Link
                href="/asociados"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/asociados'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Asociados
              </Link>
              <Link
                href="/soporte"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/soporte'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                Soporte
              </Link>
              {esAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname?.startsWith('/admin')
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-purple-500 hover:border-purple-300 hover:text-purple-700'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Menú de usuario */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            {/* Botón de Pagos */}
            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pagos
            </button>

            {estaAutenticado ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                  className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  {/* Avatar con indicador de estado */}
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold text-sm">
                      {obtenerIniciales()}
                    </div>
                    {/* Indicador de estado online */}
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>

                  {/* Badge de rol compacto */}
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${colorBadgeRol}`}>
                    {esAdmin ? 'Admin' : 'Cliente'}
                  </span>

                  {/* Icono de dropdown */}
                  <svg
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      menuUsuarioAbierto ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {menuUsuarioAbierto && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white border border-slate-200 z-20 overflow-hidden">
                    {/* Cabecera del menú con info del usuario */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {obtenerIniciales()}
                          </div>
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {usuario?.nombre} {usuario?.apellido}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{usuario?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setMenuUsuarioAbierto(false)}
                      >
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Mi perfil</span>
                      </Link>

                      {esAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => setMenuUsuarioAbierto(false)}
                        >
                          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Panel Admin</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-2"></div>

                      <button
                        onClick={() => {
                          setMenuUsuarioAbierto(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-medium"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Menú móvil */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {menuAbierto ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Panel móvil */}
      {menuAbierto && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/productos'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Productos
            </Link>
            <Link
              href="/servicios"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/servicios'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Servicios
            </Link>
            <Link
              href="/carrito"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/carrito'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Carrito
            </Link>
            <Link
              href="/quienes-somos"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/quienes-somos'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Quiénes Somos
            </Link>
            <Link
              href="/asociados"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/asociados'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Asociados
            </Link>
            <Link
              href="/soporte"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/soporte'
                  ? 'bg-slate-50 border-slate-500 text-slate-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              Soporte
            </Link>
            {esAdmin && (
              <Link
                href="/admin"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname?.startsWith('/admin')
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'border-transparent text-purple-500 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
          {estaAutenticado ? (
            <div className="pt-4 pb-3 border-t border-slate-200">
              {/* Cabecera del usuario en móvil */}
              <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {obtenerIniciales()}
                    </div>
                    {/* Indicador de estado online */}
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold text-slate-900 truncate">
                        {usuario?.nombre} {usuario?.apellido}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${colorBadgeRol}`}>
                        {esAdmin ? 'Admin' : 'Cliente'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 truncate">{usuario?.email}</div>
                  </div>
                </div>
              </div>

              {/* Opciones de menú */}
              <div className="mt-3 space-y-1 px-2">
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mi perfil</span>
                </Link>
                {esAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-purple-700 hover:bg-purple-50 transition-colors"
                  >
                    <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Panel Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-base font-medium text-red-700 hover:bg-red-50 transition-colors"
                >
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-slate-200 space-y-1">
              <Link
                href="/login"
                className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
