/**
 * Servicio de API para el módulo de Asociados
 */

import { apiClient } from '@/compartido/lib/api-client';
import type {
  Asociado,
  SolicitudAsociado,
  CrearAsociadoDto,
  ActualizarAsociadoDto,
  CrearSolicitudDto,
  ActualizarSolicitudDto,
  EstadisticasAsociados,
  EstadoSolicitud,
} from '../tipos/asociado.tipos';

const BASE_URL = '/asociados';

export const asociadosServicio = {
  // ========== PÚBLICOS ==========
  async listarActivos(): Promise<Asociado[]> {
    return apiClient.get<Asociado[]>(BASE_URL);
  },

  async obtenerAsociado(id: string): Promise<Asociado> {
    return apiClient.get<Asociado>(`${BASE_URL}/${id}`);
  },

  async crearSolicitud(dto: CrearSolicitudDto): Promise<SolicitudAsociado> {
    return apiClient.post<SolicitudAsociado>(`${BASE_URL}/solicitudes`, dto);
  },

  // ========== ADMIN - ASOCIADOS ==========
  async listarTodos(): Promise<Asociado[]> {
    return apiClient.get<Asociado[]>(`${BASE_URL}/admin/todos`);
  },

  async obtenerEstadisticas(): Promise<EstadisticasAsociados> {
    return apiClient.get<EstadisticasAsociados>(`${BASE_URL}/admin/estadisticas`);
  },

  async crearAsociado(dto: CrearAsociadoDto, foto?: File): Promise<Asociado> {
    if (foto) {
      const formData = new FormData();
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      formData.append('foto', foto);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}${BASE_URL}/admin`,
        {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error crear asociado:', response.status, errorData);
        throw new Error(errorData?.message || 'Error al crear asociado');
      }

      return response.json();
    }

    return apiClient.post<Asociado>(`${BASE_URL}/admin`, dto);
  },

  async actualizarAsociado(
    id: string,
    dto: ActualizarAsociadoDto,
    foto?: File
  ): Promise<Asociado> {
    // Limpiar campos vacíos
    const dtoLimpio: ActualizarAsociadoDto = {};
    if (dto.nombre) dtoLimpio.nombre = dto.nombre;
    if (dto.cargo) dtoLimpio.cargo = dto.cargo;
    if (dto.empresa) dtoLimpio.empresa = dto.empresa;
    if (dto.descripcion) dtoLimpio.descripcion = dto.descripcion;
    if (dto.linkedin) dtoLimpio.linkedin = dto.linkedin;
    if (dto.twitter) dtoLimpio.twitter = dto.twitter;
    if (dto.sitioWeb) dtoLimpio.sitioWeb = dto.sitioWeb;
    if (dto.orden !== undefined) dtoLimpio.orden = dto.orden;
    if (dto.activo !== undefined) dtoLimpio.activo = dto.activo;
    if (dto.destacado !== undefined) dtoLimpio.destacado = dto.destacado;

    // Si no hay foto, usar apiClient directamente
    if (!foto) {
      return apiClient.put<Asociado>(`${BASE_URL}/admin/${id}`, dtoLimpio);
    }

    // Con foto, usar FormData con refresh token handling
    const formData = new FormData();
    Object.entries(dtoLimpio).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    formData.append('foto', foto);

    const makeRequest = async (token: string | null) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}${BASE_URL}/admin/${id}`,
        {
          method: 'PUT',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
          credentials: 'include',
        }
      );
      return response;
    };

    let token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    let response = await makeRequest(token);

    // Si es 401, intentar refrescar el token
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          token = data.accessToken;
          if (token && typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
          }
          // Reintentar con nuevo token
          response = await makeRequest(token);
        }
      } catch {
        // Si falla el refresh, redirigir a login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error actualizar asociado:', response.status, errorData);
      throw new Error(errorData?.message || 'Error al actualizar asociado');
    }

    return response.json();
  },

  async eliminarAsociado(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/admin/${id}`);
  },

  // ========== ADMIN - SOLICITUDES ==========
  async listarSolicitudes(estado?: EstadoSolicitud): Promise<SolicitudAsociado[]> {
    const params = estado ? { estado } : undefined;
    return apiClient.get<SolicitudAsociado[]>(`${BASE_URL}/admin/solicitudes`, { params });
  },

  async obtenerSolicitud(id: string): Promise<SolicitudAsociado> {
    return apiClient.get<SolicitudAsociado>(`${BASE_URL}/admin/solicitudes/${id}`);
  },

  async actualizarSolicitud(
    id: string,
    dto: ActualizarSolicitudDto
  ): Promise<SolicitudAsociado> {
    return apiClient.put<SolicitudAsociado>(`${BASE_URL}/admin/solicitudes/${id}`, dto);
  },

  async marcarSolicitudLeida(id: string): Promise<SolicitudAsociado> {
    return apiClient.put<SolicitudAsociado>(`${BASE_URL}/admin/solicitudes/${id}/marcar-leida`);
  },

  async contarSolicitudesNoLeidas(): Promise<{ cantidad: number }> {
    return apiClient.get<{ cantidad: number }>(`${BASE_URL}/admin/solicitudes/no-leidas`);
  },
};
