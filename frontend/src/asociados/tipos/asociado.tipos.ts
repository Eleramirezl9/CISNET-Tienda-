/**
 * Tipos TypeScript para el módulo de Asociados
 */

export interface Asociado {
  id: string;
  nombre: string;
  cargo: string;
  empresa: string | null;
  descripcion: string | null;
  foto: string | null;
  linkedin: string | null;
  twitter: string | null;
  sitioWeb: string | null;
  orden: number;
  activo: boolean;
  destacado: boolean;
  fechaIngreso: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type EstadoSolicitud = 'pendiente' | 'revisando' | 'aprobada' | 'rechazada';

export interface SolicitudAsociado {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string | null;
  cargo: string | null;
  mensaje: string;
  estado: EstadoSolicitud;
  notasAdmin: string | null;
  leida: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearAsociadoDto {
  nombre: string;
  cargo: string;
  empresa?: string;
  descripcion?: string;
  foto?: string;
  linkedin?: string;
  twitter?: string;
  sitioWeb?: string;
  orden?: number;
  activo?: boolean;
  destacado?: boolean;
}

export interface ActualizarAsociadoDto {
  nombre?: string;
  cargo?: string;
  empresa?: string;
  descripcion?: string;
  foto?: string;
  linkedin?: string;
  twitter?: string;
  sitioWeb?: string;
  orden?: number;
  activo?: boolean;
  destacado?: boolean;
}

export interface CrearSolicitudDto {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  cargo?: string;
  mensaje: string;
}

export interface ActualizarSolicitudDto {
  estado?: EstadoSolicitud;
  notasAdmin?: string;
  leida?: boolean;
}

export interface EstadisticasAsociados {
  totalAsociados: number;
  solicitudesPendientes: number;
}
