/**
 * Implementación Prisma de los repositorios de Asociados
 * Capa de infraestructura
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../compartido/infraestructura/prisma/prisma.service';
import {
  IAsociadoRepositorio,
  ISolicitudAsociadoRepositorio,
} from '../../dominio/repositorios/asociado.repositorio';
import {
  Asociado,
  SolicitudAsociado,
  CrearAsociadoParams,
  ActualizarAsociadoParams,
  CrearSolicitudParams,
  ActualizarSolicitudParams,
  EstadoSolicitud,
} from '../../dominio/entidades/asociado.entidad';

@Injectable()
export class AsociadoRepositorioPrisma implements IAsociadoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async crear(params: CrearAsociadoParams): Promise<Asociado> {
    return this.prisma.asociado.create({
      data: params,
    });
  }

  async actualizar(id: string, params: ActualizarAsociadoParams): Promise<Asociado> {
    return this.prisma.asociado.update({
      where: { id },
      data: params,
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.asociado.delete({
      where: { id },
    });
  }

  async buscarPorId(id: string): Promise<Asociado | null> {
    return this.prisma.asociado.findUnique({
      where: { id },
    });
  }

  async listarActivos(): Promise<Asociado[]> {
    return this.prisma.asociado.findMany({
      where: { activo: true },
      orderBy: [{ destacado: 'desc' }, { orden: 'asc' }, { nombre: 'asc' }],
    });
  }

  async listarTodos(): Promise<Asociado[]> {
    return this.prisma.asociado.findMany({
      orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    });
  }

  async contarActivos(): Promise<number> {
    return this.prisma.asociado.count({
      where: { activo: true },
    });
  }
}

@Injectable()
export class SolicitudAsociadoRepositorioPrisma implements ISolicitudAsociadoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async crear(params: CrearSolicitudParams): Promise<SolicitudAsociado> {
    const resultado = await this.prisma.solicitudAsociado.create({
      data: params,
    });
    return this.mapearSolicitud(resultado);
  }

  async actualizar(
    id: string,
    params: ActualizarSolicitudParams,
  ): Promise<SolicitudAsociado> {
    const resultado = await this.prisma.solicitudAsociado.update({
      where: { id },
      data: params,
    });
    return this.mapearSolicitud(resultado);
  }

  async buscarPorId(id: string): Promise<SolicitudAsociado | null> {
    const resultado = await this.prisma.solicitudAsociado.findUnique({
      where: { id },
    });
    return resultado ? this.mapearSolicitud(resultado) : null;
  }

  async listarTodas(): Promise<SolicitudAsociado[]> {
    const resultados = await this.prisma.solicitudAsociado.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });
    return resultados.map(this.mapearSolicitud);
  }

  async listarPorEstado(estado: EstadoSolicitud): Promise<SolicitudAsociado[]> {
    const resultados = await this.prisma.solicitudAsociado.findMany({
      where: { estado },
      orderBy: { fechaCreacion: 'desc' },
    });
    return resultados.map(this.mapearSolicitud);
  }

  async contarNoLeidas(): Promise<number> {
    return this.prisma.solicitudAsociado.count({
      where: { leida: false },
    });
  }

  async contarPendientes(): Promise<number> {
    return this.prisma.solicitudAsociado.count({
      where: { estado: 'pendiente' },
    });
  }

  async marcarComoLeida(id: string): Promise<SolicitudAsociado> {
    const resultado = await this.prisma.solicitudAsociado.update({
      where: { id },
      data: { leida: true },
    });
    return this.mapearSolicitud(resultado);
  }

  private mapearSolicitud(solicitud: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    empresa: string | null;
    cargo: string | null;
    mensaje: string;
    estado: string;
    notasAdmin: string | null;
    leida: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
  }): SolicitudAsociado {
    return {
      ...solicitud,
      estado: solicitud.estado as EstadoSolicitud,
    };
  }
}
