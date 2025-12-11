/**
 * Caso de Uso: Gestionar Asociados
 * Orquesta la lógica de negocio para asociados y solicitudes
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ASOCIADO_REPOSITORIO,
  SOLICITUD_ASOCIADO_REPOSITORIO,
  IAsociadoRepositorio,
  ISolicitudAsociadoRepositorio,
} from '../../dominio/repositorios/asociado.repositorio';
import {
  Asociado,
  SolicitudAsociado,
  EstadoSolicitud,
} from '../../dominio/entidades/asociado.entidad';
import {
  CrearAsociadoDto,
  ActualizarAsociadoDto,
  CrearSolicitudDto,
  ActualizarSolicitudDto,
} from '../dto/asociado.dto';

@Injectable()
export class GestionarAsociadosCasoUso {
  constructor(
    @Inject(ASOCIADO_REPOSITORIO)
    private readonly asociadoRepo: IAsociadoRepositorio,
    @Inject(SOLICITUD_ASOCIADO_REPOSITORIO)
    private readonly solicitudRepo: ISolicitudAsociadoRepositorio,
  ) {}

  // ========== ASOCIADOS ==========

  async crearAsociado(dto: CrearAsociadoDto): Promise<Asociado> {
    return this.asociadoRepo.crear(dto);
  }

  async actualizarAsociado(id: string, dto: ActualizarAsociadoDto): Promise<Asociado> {
    const existente = await this.asociadoRepo.buscarPorId(id);
    if (!existente) {
      throw new NotFoundException(`Asociado con ID ${id} no encontrado`);
    }
    return this.asociadoRepo.actualizar(id, dto);
  }

  async eliminarAsociado(id: string): Promise<void> {
    const existente = await this.asociadoRepo.buscarPorId(id);
    if (!existente) {
      throw new NotFoundException(`Asociado con ID ${id} no encontrado`);
    }
    await this.asociadoRepo.eliminar(id);
  }

  async obtenerAsociado(id: string): Promise<Asociado> {
    const asociado = await this.asociadoRepo.buscarPorId(id);
    if (!asociado) {
      throw new NotFoundException(`Asociado con ID ${id} no encontrado`);
    }
    return asociado;
  }

  async listarAsociadosActivos(): Promise<Asociado[]> {
    return this.asociadoRepo.listarActivos();
  }

  async listarTodosAsociados(): Promise<Asociado[]> {
    return this.asociadoRepo.listarTodos();
  }

  async obtenerEstadisticas(): Promise<{
    totalAsociados: number;
    solicitudesPendientes: number;
  }> {
    const [totalAsociados, solicitudesPendientes] = await Promise.all([
      this.asociadoRepo.contarActivos(),
      this.solicitudRepo.contarPendientes(),
    ]);
    return { totalAsociados, solicitudesPendientes };
  }

  // ========== SOLICITUDES ==========

  async crearSolicitud(dto: CrearSolicitudDto): Promise<SolicitudAsociado> {
    return this.solicitudRepo.crear(dto);
  }

  async actualizarSolicitud(
    id: string,
    dto: ActualizarSolicitudDto,
  ): Promise<SolicitudAsociado> {
    const existente = await this.solicitudRepo.buscarPorId(id);
    if (!existente) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }
    return this.solicitudRepo.actualizar(id, dto);
  }

  async obtenerSolicitud(id: string): Promise<SolicitudAsociado> {
    const solicitud = await this.solicitudRepo.buscarPorId(id);
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }
    return solicitud;
  }

  async listarSolicitudes(): Promise<SolicitudAsociado[]> {
    return this.solicitudRepo.listarTodas();
  }

  async listarSolicitudesPorEstado(
    estado: EstadoSolicitud,
  ): Promise<SolicitudAsociado[]> {
    return this.solicitudRepo.listarPorEstado(estado);
  }

  async contarSolicitudesNoLeidas(): Promise<number> {
    return this.solicitudRepo.contarNoLeidas();
  }

  async marcarSolicitudComoLeida(id: string): Promise<SolicitudAsociado> {
    const existente = await this.solicitudRepo.buscarPorId(id);
    if (!existente) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }
    return this.solicitudRepo.marcarComoLeida(id);
  }
}
