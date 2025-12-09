/**
 * ADAPTER - Repositorio Prisma de Productos (Implementación)
 *
 * Implementación del repositorio de productos para el módulo de órdenes
 * usando Prisma como adaptador de persistencia
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import {
  ProductoRepositorio,
  ProductoInfo,
} from '@/ordenes/dominio/repositorios/producto.repositorio';

@Injectable()
export class ProductoRepositorioPrisma implements ProductoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string): Promise<ProductoInfo | null> {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        precio: true,
        stock: true,
        activo: true,
      },
    });

    if (!producto) {
      return null;
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      stock: producto.stock,
      activo: producto.activo,
    };
  }

  async reducirStock(
    productoId: string,
    cantidad: number,
    transaccion?: unknown,
  ): Promise<void> {
    const tx = (transaccion as any) || this.prisma;

    // Obtener producto actual
    const producto = await tx.producto.findUnique({
      where: { id: productoId },
      select: { stock: true, nombre: true },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }

    // Validar stock suficiente
    if (producto.stock < cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para "${producto.nombre}". Stock actual: ${producto.stock}, solicitado: ${cantidad}`,
      );
    }

    // Reducir stock
    await tx.producto.update({
      where: { id: productoId },
      data: {
        stock: {
          decrement: cantidad,
        },
      },
    });
  }

  async validarProductosDisponibles(
    productosIds: string[],
  ): Promise<Map<string, ProductoInfo>> {
    const productos = await this.prisma.producto.findMany({
      where: {
        id: {
          in: productosIds,
        },
      },
      select: {
        id: true,
        nombre: true,
        precio: true,
        stock: true,
        activo: true,
      },
    });

    // Validar que todos los productos existan
    if (productos.length !== productosIds.length) {
      const productosEncontradosIds = productos.map((p) => p.id);
      const productosFaltantes = productosIds.filter(
        (id) => !productosEncontradosIds.includes(id),
      );
      throw new NotFoundException(
        `Productos no encontrados: ${productosFaltantes.join(', ')}`,
      );
    }

    // Convertir a Map
    const mapa = new Map<string, ProductoInfo>();

    for (const producto of productos) {
      mapa.set(producto.id, {
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        stock: producto.stock,
        activo: producto.activo,
      });
    }

    return mapa;
  }
}
