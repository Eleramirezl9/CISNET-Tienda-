/**
 * USE CASE - Listar Órdenes
 *
 * Permite listar todas las órdenes con paginación
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import {
  Orden,
  ItemOrden,
  DireccionEnvio,
  Cliente,
  EstadoOrden,
} from '@/ordenes/dominio/entidades/orden.entidad';

export interface ResultadoListarOrdenes {
  ordenes: Orden[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

@Injectable()
export class ListarOrdenesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(
    pagina: number = 1,
    limite: number = 20,
  ): Promise<ResultadoListarOrdenes> {
    const skip = (pagina - 1) * limite;

    const [ordenes, total] = await this.prisma.$transaction([
      this.prisma.orden.findMany({
        skip,
        take: limite,
        orderBy: {
          fechaCreacion: 'desc',
        },
        include: {
          items: true,
        },
      }),
      this.prisma.orden.count(),
    ]);

    const ordenesMapeadas = ordenes.map((ordenEncontrada) => {
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
    });

    return {
      ordenes: ordenesMapeadas,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
