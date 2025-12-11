/**
 * Interfaces de repositorio para el módulo de Asociados
 * Puertos del dominio - sin dependencias de infraestructura
 */

import {
  Asociado,
  SolicitudAsociado,
  CrearAsociadoParams,
  ActualizarAsociadoParams,
  CrearSolicitudParams,
  ActualizarSolicitudParams,
  EstadoSolicitud,
} from '../entidades/asociado.entidad';

export const ASOCIADO_REPOSITORIO = Symbol('ASOCIADO_REPOSITORIO');
export const SOLICITUD_ASOCIADO_REPOSITORIO = Symbol('SOLICITUD_ASOCIADO_REPOSITORIO');

export interface IAsociadoRepositorio {
  crear(params: CrearAsociadoParams): Promise<Asociado>;
  actualizar(id: string, params: ActualizarAsociadoParams): Promise<Asociado>;
  eliminar(id: string): Promise<void>;
  buscarPorId(id: string): Promise<Asociado | null>;
  listarActivos(): Promise<Asociado[]>;
  listarTodos(): Promise<Asociado[]>;
  contarActivos(): Promise<number>;
}

export interface ISolicitudAsociadoRepositorio {
  crear(params: CrearSolicitudParams): Promise<SolicitudAsociado>;
  actualizar(id: string, params: ActualizarSolicitudParams): Promise<SolicitudAsociado>;
  buscarPorId(id: string): Promise<SolicitudAsociado | null>;
  listarTodas(): Promise<SolicitudAsociado[]>;
  listarPorEstado(estado: EstadoSolicitud): Promise<SolicitudAsociado[]>;
  contarNoLeidas(): Promise<number>;
  contarPendientes(): Promise<number>;
  marcarComoLeida(id: string): Promise<SolicitudAsociado>;
}
