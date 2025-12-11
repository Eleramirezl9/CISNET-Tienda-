/**
 * Entidades de dominio para el módulo de Asociados
 * Capa pura sin dependencias de frameworks
 */

export type EstadoSolicitud = 'pendiente' | 'revisando' | 'aprobada' | 'rechazada';

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
  fechaIngreso: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

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
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CrearAsociadoParams {
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

export interface ActualizarAsociadoParams {
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

export interface CrearSolicitudParams {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  cargo?: string;
  mensaje: string;
}

export interface ActualizarSolicitudParams {
  estado?: EstadoSolicitud;
  notasAdmin?: string;
  leida?: boolean;
}
