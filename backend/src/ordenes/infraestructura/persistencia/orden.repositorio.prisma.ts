/**
 * ADAPTER - Repositorio Prisma (Implementación)
 *
 * Esta es la implementación concreta del repositorio usando Prisma
 * Es un ADAPTER que conecta el dominio con la base de datos
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import {
  Orden,
  ItemOrden,
  DireccionEnvio,
  Cliente,
  EstadoOrden,
  MetodoPago,
} from '@/ordenes/dominio/entidades/orden.entidad';
import { OrdenRepositorio } from '@/ordenes/dominio/repositorios/orden.repositorio';

@Injectable()
export class OrdenRepositorioPrisma implements OrdenRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(orden: Orden): Promise<Orden> {
    const ordenGuardada = await this.prisma.orden.create({
      data: {
        id: orden.id,
        numeroOrden: orden.numeroOrden,
        nombreCompleto: orden.cliente.nombreCompleto,
        telefono: orden.cliente.telefono,
        email: orden.cliente.email ?? null,
        direccion: orden.direccionEnvio.direccion,
        departamento: orden.direccionEnvio.departamento,
        municipio: orden.direccionEnvio.municipio,
        zonaOColonia: orden.direccionEnvio.zonaOColonia,
        referencia: orden.direccionEnvio.referencia ?? null,
        estado: orden.estado,
        metodoPago: orden.metodoPago,
        subtotal: orden.subtotal,
        impuestos: orden.impuestos,
        envio: orden.envio,
        total: orden.total,
        notas: orden.notas,
        fechaCreacion: orden.fechaCreacion,
        fechaActualizacion: orden.fechaActualizacion,
        items: {
          create: orden.items.map((item) => ({
            id: crypto.randomUUID(),
            productoId: item.productoId,
            nombreProducto: item.nombreProducto,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapearAEntidad(ordenGuardada);
  }

  async buscarPorId(id: string): Promise<Orden | null> {
    const orden = await this.prisma.orden.findUnique({
      where: { id },
      include: { items: true },
    });

    return orden ? this.mapearAEntidad(orden) : null;
  }

  async buscarPorNumeroOrden(numeroOrden: string): Promise<Orden | null> {
    const orden = await this.prisma.orden.findUnique({
      where: { numeroOrden },
      include: { items: true },
    });

    return orden ? this.mapearAEntidad(orden) : null;
  }

  async actualizar(orden: Orden): Promise<Orden> {
    const ordenActualizada = await this.prisma.orden.update({
      where: { id: orden.id },
      data: {
        estado: orden.estado,
        fechaActualizacion: orden.fechaActualizacion,
      },
      include: { items: true },
    });

    return this.mapearAEntidad(ordenActualizada);
  }

  async listar(
    pagina: number,
    limite: number,
  ): Promise<{ ordenes: Orden[]; total: number }> {
    const skip = (pagina - 1) * limite;

    const [ordenes, total] = await Promise.all([
      this.prisma.orden.findMany({
        skip,
        take: limite,
        include: { items: true },
        orderBy: { fechaCreacion: 'desc' },
      }),
      this.prisma.orden.count(),
    ]);

    return {
      ordenes: ordenes.map((orden) => this.mapearAEntidad(orden)),
      total,
    };
  }

  /**
   * Mapear modelo de Prisma a entidad de dominio
   */
  private mapearAEntidad(ordenPrisma: any): Orden {
    const cliente = new Cliente(
      ordenPrisma.nombreCompleto,
      ordenPrisma.telefono,
      ordenPrisma.email ?? undefined,
    );

    const direccionEnvio = new DireccionEnvio(
      ordenPrisma.direccion,
      ordenPrisma.departamento,
      ordenPrisma.municipio,
      ordenPrisma.zonaOColonia,
      ordenPrisma.referencia ?? undefined,
    );

    const items = ordenPrisma.items.map(
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
      ordenPrisma.id,
      ordenPrisma.numeroOrden,
      cliente,
      direccionEnvio,
      items,
      ordenPrisma.metodoPago as MetodoPago,
      Number(ordenPrisma.subtotal),
      Number(ordenPrisma.impuestos),
      Number(ordenPrisma.envio),
      Number(ordenPrisma.total),
      ordenPrisma.estado as EstadoOrden,
      ordenPrisma.notas,
      ordenPrisma.fechaCreacion,
      ordenPrisma.fechaActualizacion,
    );
  }
}
