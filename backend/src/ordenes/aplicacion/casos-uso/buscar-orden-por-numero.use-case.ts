/**
 * USE CASE - Buscar Orden por Número
 *
 * Permite buscar una orden específica por su número de orden
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import {
  Orden,
  ItemOrden,
  DireccionEnvio,
  Cliente,
  EstadoOrden,
} from '@/ordenes/dominio/entidades/orden.entidad';

@Injectable()
export class BuscarOrdenPorNumeroUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(numeroOrden: string): Promise<Orden> {
    const ordenEncontrada = await this.prisma.orden.findUnique({
      where: { numeroOrden },
      include: {
        items: true,
      },
    });

    if (!ordenEncontrada) {
      throw new NotFoundException(
        `Orden con número ${numeroOrden} no encontrada`,
      );
    }

    // Mapear a entidad de dominio
    const cliente = new Cliente(
      ordenEncontrada.nombreCompleto,
      ordenEncontrada.telefono,
      ordenEncontrada.email ?? undefined,
    );

    const direccionEnvio = new DireccionEnvio(
      ordenEncontrada.direccion,
      ordenEncontrada.departamento,
      ordenEncontrada.municipio,
      ordenEncontrada.zonaOColonia,
      ordenEncontrada.referencia ?? undefined,
    );

    const itemsOrden = ordenEncontrada.items.map(
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
      ordenEncontrada.id,
      ordenEncontrada.numeroOrden,
      cliente,
      direccionEnvio,
      itemsOrden,
      ordenEncontrada.metodoPago as any,
      Number(ordenEncontrada.subtotal),
      Number(ordenEncontrada.impuestos),
      Number(ordenEncontrada.envio),
      Number(ordenEncontrada.total),
      ordenEncontrada.estado as EstadoOrden,
      ordenEncontrada.notas,
      ordenEncontrada.fechaCreacion,
      ordenEncontrada.fechaActualizacion,
    );
  }
}
