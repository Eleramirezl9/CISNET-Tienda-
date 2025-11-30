/**
 * ADAPTER - Repositorio Prisma (Implementación)
 * 
 * Esta es la implementación concreta del repositorio usando Prisma
 * Es un ADAPTER que conecta el dominio con la base de datos
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import { Precio } from '@/productos/dominio/value-objects/precio.vo';
import {
  IProductoRepositorio,
  FiltrosProducto,
  ResultadoPaginado,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';

@Injectable()
export class ProductoRepositorioPrisma implements IProductoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(producto: Producto): Promise<Producto> {
    const data = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      slug: producto.slug,
      precio: producto.precio.valor,
      precioAnterior: producto.precioAnterior?.valor ?? null,
      stock: producto.stock,
      imagenPrincipal: producto.imagenPrincipal,
      imagenes: producto.imagenes,
      categoriaId: producto.categoriaId,
      categoria: producto.categoria,
      etiquetas: producto.etiquetas,
      caracteristicas: producto.caracteristicas,
      activo: producto.activo,
      destacado: producto.destacado,
      fechaCreacion: producto.fechaCreacion,
      fechaActualizacion: producto.fechaActualizacion,
    };

    const productoGuardado = await this.prisma.producto.upsert({
      where: { id: producto.id },
      update: data,
      create: data,
    });

    return this.mapearAEntidad(productoGuardado);
  }

  async buscarPorId(id: string): Promise<Producto | null> {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
    });

    return producto ? this.mapearAEntidad(producto) : null;
  }

  async buscarPorSlug(slug: string): Promise<Producto | null> {
    const producto = await this.prisma.producto.findUnique({
      where: { slug },
    });

    return producto ? this.mapearAEntidad(producto) : null;
  }

  async buscarTodos(
    filtros?: FiltrosProducto,
  ): Promise<ResultadoPaginado<Producto>> {
    const {
      categoriaId,
      precioMin,
      precioMax,
      etiquetas,
      busqueda,
      destacados,
      disponibles,
      ordenar = 'reciente',
      pagina = 1,
      limite = 20,
    } = filtros || {};

    // Construir el WHERE de Prisma
    const where: any = {};

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (precioMin !== undefined || precioMax !== undefined) {
      where.precio = {};
      if (precioMin !== undefined) where.precio.gte = precioMin;
      if (precioMax !== undefined) where.precio.lte = precioMax;
    }

    if (etiquetas && etiquetas.length > 0) {
      where.etiquetas = {
        hasSome: etiquetas,
      };
    }

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
        { etiquetas: { hasSome: [busqueda] } },
      ];
    }

    if (destacados !== undefined) {
      where.destacado = destacados;
    }

    if (disponibles !== undefined) {
      where.activo = disponibles;
      if (disponibles) {
        where.stock = { gt: 0 };
      }
    }

    // Construir el ORDER BY
    let orderBy: any = {};
    switch (ordenar) {
      case 'precio-asc':
        orderBy = { precio: 'asc' };
        break;
      case 'precio-desc':
        orderBy = { precio: 'desc' };
        break;
      case 'nombre':
        orderBy = { nombre: 'asc' };
        break;
      case 'reciente':
      default:
        orderBy = { fechaCreacion: 'desc' };
        break;
    }

    // Calcular paginación
    const skip = (pagina - 1) * limite;

    // Ejecutar queries
    const [productos, total] = await Promise.all([
      this.prisma.producto.findMany({
        where,
        orderBy,
        skip,
        take: limite,
      }),
      this.prisma.producto.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    // Mapear productos con manejo de errores
    const items = productos
      .map((p) => {
        try {
          return this.mapearAEntidad(p);
        } catch (error) {
          // Loggear solo errores críticos, no en producción
          if (process.env.NODE_ENV !== 'production') {
            console.error(`Error mapeando producto ${p.id}:`, error.message);
          }
          return null;
        }
      })
      .filter((p) => p !== null) as Producto[];

    return {
      items,
      total: items.length, // Actualizar total con productos mapeados exitosamente
      pagina,
      limite,
      totalPaginas: Math.ceil(items.length / limite),
    };
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.producto.delete({
      where: { id },
    });
  }

  async existeSlug(slug: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.prisma.producto.count({ where });
    return count > 0;
  }

  async buscarPorCategoria(
    categoriaId: string,
    limite = 10,
  ): Promise<Producto[]> {
    const productos = await this.prisma.producto.findMany({
      where: {
        categoriaId,
        activo: true,
        stock: { gt: 0 },
      },
      take: limite,
      orderBy: { fechaCreacion: 'desc' },
    });

    return productos.map((p) => this.mapearAEntidad(p));
  }

  async buscarDestacados(limite = 8): Promise<Producto[]> {
    const productos = await this.prisma.producto.findMany({
      where: {
        destacado: true,
        activo: true,
        stock: { gt: 0 },
      },
      take: limite,
      orderBy: { fechaCreacion: 'desc' },
    });

    return productos.map((p) => this.mapearAEntidad(p));
  }

  async actualizarStockMasivo(
    actualizaciones: Array<{ id: string; cantidad: number }>,
  ): Promise<void> {
    // Usar transacción para garantizar atomicidad
    await this.prisma.$transaction(
      actualizaciones.map((act) =>
        this.prisma.producto.update({
          where: { id: act.id },
          data: {
            stock: { increment: act.cantidad },
            fechaActualizacion: new Date(),
          },
        }),
      ),
    );
  }

  /**
   * Mapear de Prisma a Entidad de Dominio
   */
  private mapearAEntidad(data: any): Producto {
    // Convertir Decimal de Prisma a number
    const precio = typeof data.precio === 'object' && data.precio !== null
      ? Number(data.precio.toString())
      : data.precio;

    const precioAnterior = data.precioAnterior
      ? typeof data.precioAnterior === 'object' && data.precioAnterior !== null
        ? Number(data.precioAnterior.toString())
        : data.precioAnterior
      : null;

    return new Producto(
      data.id,
      data.nombre,
      data.descripcion,
      data.slug,
      Precio.desde(precio),
      precioAnterior ? Precio.desde(precioAnterior) : null,
      data.stock,
      data.imagenPrincipal,
      data.imagenes,
      data.categoriaId,
      data.categoria,
      data.etiquetas,
      data.caracteristicas,
      data.activo,
      data.destacado,
      data.fechaCreacion,
      data.fechaActualizacion,
    );
  }
}
