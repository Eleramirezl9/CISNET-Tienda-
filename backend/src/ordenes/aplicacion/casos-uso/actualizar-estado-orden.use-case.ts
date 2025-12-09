/**
 * USE CASE - Actualizar Estado de Orden
 *
 * Permite actualizar el estado de una orden existente
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import {
  Orden,
  ItemOrden,
  DireccionEnvio,
  Cliente,
  EstadoOrden,
} from '@/ordenes/dominio/entidades/orden.entidad';
import { ActualizarEstadoOrdenDto } from '../dto/actualizar-estado-orden.dto';

@Injectable()
export class ActualizarEstadoOrdenUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(
    numeroOrden: string,
    dto: ActualizarEstadoOrdenDto,
  ): Promise<Orden> {
    // 1. Buscar la orden
    const ordenExistente = await this.prisma.orden.findUnique({
      where: { numeroOrden },
      include: { items: true },
    });

    if (!ordenExistente) {
      throw new NotFoundException(
        `Orden con número ${numeroOrden} no encontrada`,
      );
    }

    // 2. Validar transición de estado
    this.validarTransicionEstado(
      ordenExistente.estado as EstadoOrden,
      dto.estado,
    );

    // 3. Actualizar estado en base de datos
    const ordenActualizada = await this.prisma.orden.update({
      where: { numeroOrden },
      data: {
        estado: dto.estado,
        notas: dto.notas || ordenExistente.notas,
        fechaActualizacion: new Date(),
      },
      include: { items: true },
    });

    // 4. Mapear a entidad de dominio
    const cliente = new Cliente(
      ordenActualizada.nombreCompleto,
      ordenActualizada.telefono,
      ordenActualizada.email ?? undefined,
    );

    const direccionEnvio = new DireccionEnvio(
      ordenActualizada.direccion,
      ordenActualizada.departamento,
      ordenActualizada.municipio,
      ordenActualizada.zonaOColonia,
      ordenActualizada.referencia ?? undefined,
    );

    const itemsOrden = ordenActualizada.items.map(
      (item: any) =>
        new ItemOrden(
          item.productoId,
          item.nombreProducto,
          item.cantidad,
          Number(item.precioUnitario),
          Number(item.subtotal),
        ),
    );

    return new Orden(
      ordenActualizada.id,
      ordenActualizada.numeroOrden,
      cliente,
      direccionEnvio,
      itemsOrden,
      ordenActualizada.metodoPago as any,
      Number(ordenActualizada.subtotal),
      Number(ordenActualizada.impuestos),
      Number(ordenActualizada.envio),
      Number(ordenActualizada.total),
      ordenActualizada.estado as EstadoOrden,
      ordenActualizada.notas,
      ordenActualizada.fechaCreacion,
      ordenActualizada.fechaActualizacion,
    );
  }

  /**
   * Validar que la transición de estado sea lógica
   */
  private validarTransicionEstado(
    estadoActual: EstadoOrden,
    nuevoEstado: EstadoOrden,
  ): void {
    // Una orden cancelada no puede cambiar de estado
    if (estadoActual === EstadoOrden.CANCELADA) {
      throw new BadRequestException(
        'No se puede cambiar el estado de una orden cancelada',
      );
    }

    // Una orden entregada solo puede ser cancelada (para devoluciones)
    if (
      estadoActual === EstadoOrden.ENTREGADA &&
      nuevoEstado !== EstadoOrden.CANCELADA
    ) {
      throw new BadRequestException(
        'Una orden entregada solo puede ser cancelada',
      );
    }

    // No permitir retrocesos de estado (excepto a cancelada)
    if (nuevoEstado !== EstadoOrden.CANCELADA) {
      const flujoEstados = [
        EstadoOrden.PENDIENTE,
        EstadoOrden.CONFIRMADA,
        EstadoOrden.EN_PROCESO,
        EstadoOrden.ENVIADA,
        EstadoOrden.ENTREGADA,
      ];

      const indiceActual = flujoEstados.indexOf(estadoActual);
      const indiceNuevo = flujoEstados.indexOf(nuevoEstado);

      if (indiceNuevo < indiceActual) {
        throw new BadRequestException(
          `No se puede retroceder de "${estadoActual}" a "${nuevoEstado}"`,
        );
      }
    }
  }
}
