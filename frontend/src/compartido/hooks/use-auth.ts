/**
 * Hook de Autenticación con Zustand
 * Maneja el estado global de usuario, tokens y sesión
 */

import { create } from 'zustand';
import { apiClient, ApiError } from '@/compartido/lib/api-client';

/**
 * Interfaces de tipos
 */
interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'CLIENTE';
  activo: boolean;
}

interface SolicitudRegistro {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
}

interface SolicitudLogin {
  email: string;
  password: string;
}

interface RespuestaAutenticacion {
  accessToken: string;
  usuario: Usuario;
}

interface EstadoAutenticacion {
  // Estado
  usuario: Usuario | null;
  estaAutenticado: boolean;
  estaCargando: boolean;
  error: string | null;

  // Acciones
  registrar: (datos: SolicitudRegistro) => Promise<void>;
  login: (datos: SolicitudLogin) => Promise<void>;
  logout: () => Promise<void>;
  refrescarSesion: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
  limpiarError: () => void;
  inicializarDesdeStorage: () => void;
}

/**
 * Store de autenticación con Zustand
 */
export const useAuthStore = create<EstadoAutenticacion>((set, get) => ({
  // Estado inicial
  usuario: null,
  estaAutenticado: false,
  estaCargando: false,
  error: null,

  /**
   * Registrar nuevo usuario
   */
  registrar: async (datos: SolicitudRegistro) => {
    set({ estaCargando: true, error: null });

    try {
      const respuesta = await apiClient.post<RespuestaAutenticacion>(
        '/auth/register',
        datos
      );

      // Guardar token y usuario
      localStorage.setItem('accessToken', respuesta.accessToken);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

      set({
        usuario: respuesta.usuario,
        estaAutenticado: true,
        estaCargando: false,
      });
    } catch (error: unknown) {
      let mensaje = 'Error desconocido';
      
      if (error instanceof ApiError) {
        if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
          mensaje = String((error.data as Record<string, unknown>).message);
        } else {
          mensaje = error.statusText;
        }
      } else if (error instanceof Error) {
        mensaje = error.message;
      }

      set({
        error: mensaje,
        estaCargando: false,
      });

      throw error;
    }
  },

  /**
   * Iniciar sesión
   */
  login: async (datos: SolicitudLogin) => {
    set({ estaCargando: true, error: null });

    try {
      const respuesta = await apiClient.post<RespuestaAutenticacion>(
        '/auth/login',
        datos
      );

      // Guardar token y usuario
      localStorage.setItem('accessToken', respuesta.accessToken);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

      set({
        usuario: respuesta.usuario,
        estaAutenticado: true,
        estaCargando: false,
      });
    } catch (error: unknown) {
      let mensaje = 'Error desconocido';
      
      if (error instanceof ApiError) {
        if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
          mensaje = String((error.data as Record<string, unknown>).message);
        } else {
          mensaje = error.statusText;
        }
      } else if (error instanceof Error) {
        mensaje = error.message;
      }

      set({
        error: String(mensaje),
        estaCargando: false,
      });

      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    set({ estaCargando: true, error: null });

    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      // Continuar incluso si falla el logout en servidor
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuario');

      set({
        usuario: null,
        estaAutenticado: false,
        estaCargando: false,
      });
    }
  },

  /**
   * Refrescar sesión (obtener nuevo token)
   */
  refrescarSesion: async () => {
    try {
      const respuesta = await apiClient.post<RespuestaAutenticacion>(
        '/auth/refresh',
        {}
      );

      localStorage.setItem('accessToken', respuesta.accessToken);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

      set({
        usuario: respuesta.usuario,
        estaAutenticado: true,
      });
    } catch (error) {
      // Si falla, limpiar sesión
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuario');

      set({
        usuario: null,
        estaAutenticado: false,
        error: 'Sesión expirada. Por favor inicia sesión nuevamente.',
      });

      throw error;
    }
  },

  /**
   * Establecer token desde OAuth (usado en callback de OAuth)
   */
  setToken: async (token: string) => {
    set({ estaCargando: true, error: null });

    try {
      // Guardar token
      localStorage.setItem('accessToken', token);

      // Obtener datos del usuario desde el perfil
      const usuario = await apiClient.get<Usuario>('/auth/profile');

      localStorage.setItem('usuario', JSON.stringify(usuario));

      set({
        usuario,
        estaAutenticado: true,
        estaCargando: false,
      });
    } catch (error: unknown) {
      let mensaje = 'Error al obtener datos del usuario';

      if (error instanceof ApiError) {
        if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
          mensaje = String((error.data as Record<string, unknown>).message);
        } else {
          mensaje = error.statusText;
        }
      } else if (error instanceof Error) {
        mensaje = error.message;
      }

      set({
        error: mensaje,
        estaCargando: false,
      });

      throw error;
    }
  },

  /**
   * Limpiar mensaje de error
   */
  limpiarError: () => {
    set({ error: null });
  },

  /**
   * Inicializar desde localStorage (al cargar la app)
   */
  inicializarDesdeStorage: () => {
    if (typeof window === 'undefined') return;

    const usuarioStr = localStorage.getItem('usuario');
    const token = localStorage.getItem('accessToken');

    if (usuarioStr && token) {
      try {
        const usuario = JSON.parse(usuarioStr);
        set({
          usuario,
          estaAutenticado: true,
        });
      } catch (error) {
        console.error('Error parsing usuario from storage:', error);
        localStorage.removeItem('usuario');
        localStorage.removeItem('accessToken');
      }
    }
  },
}));

/**
 * Hook para usar autenticación
 * IMPORTANTE: Llamar a inicializarDesdeStorage en un useEffect del layout
 */
export const useAuth = () => {
  return useAuthStore();
};

export type { Usuario, SolicitudRegistro, SolicitudLogin, RespuestaAutenticacion };
