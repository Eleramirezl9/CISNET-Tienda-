/**
 * USE CASE - Crear Orden
 *
 * Caso de uso para crear una nueva orden de compra (guest checkout)
 * Sigue arquitectura hexagonal: usa repositorios en lugar de acceso directo a BD
 */

import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Orden,
  ItemOrden,
  DireccionEnvio,
  Cliente,
  EstadoOrden,
  MetodoPago,
} from '@/ordenes/dominio/entidades/orden.entidad';
import { CrearOrdenDto } from '../dto/crear-orden.dto';
import {
  OrdenRepositorio,
  ORDEN_REPOSITORIO,
} from '@/ordenes/dominio/repositorios/orden.repositorio';
import {
  ProductoRepositorio,
  PRODUCTO_REPOSITORIO,
  ProductoInfo,
} from '@/ordenes/dominio/repositorios/producto.repositorio';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';

@Injectable()
export class CrearOrdenUseCase {
  constructor(
    @Inject(ORDEN_REPOSITORIO)
    private readonly ordenRepositorio: OrdenRepositorio,
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: ProductoRepositorio,
    private readonly prisma: PrismaService, // Solo para transacciones y generar número de orden
  ) {}

  async ejecutar(dto: CrearOrdenDto): Promise<Orden> {
    // 1. Validar productos y obtener información
    const productosMap = await this.validarYObtenerProductos(dto.items);

    // 2. Crear Value Objects
    const cliente = new Cliente(
      dto.nombreCompleto,
      dto.telefono,
      dto.email,
    );

    const direccionEnvio = new DireccionEnvio(
      dto.direccion,
      dto.departamento,
      dto.municipio,
      dto.zonaOColonia,
      dto.referencia,
    );

    // 3. Crear items de la orden con nombres de productos
    const itemsOrden = this.crearItemsOrden(dto.items, productosMap);

    // 4. Generar número de orden único
    const numeroOrden = await this.generarNumeroOrden();

    // 5. Crear entidad de dominio
    const orden = new Orden(
      uuidv4(),
      numeroOrden,
      cliente,
      direccionEnvio,
      itemsOrden,
      dto.metodoPago,
      Number(dto.subtotal),
      Number(dto.impuestos),
      Number(dto.envio),
      Number(dto.total),
      EstadoOrden.PENDIENTE,
      dto.notas ?? null,
      new Date(),
      new Date(),
    );

    // 6. Persistir orden y reducir stock en una transacción
    const ordenGuardada = await this.guardarOrdenYReducirStock(orden, dto.items);

    return ordenGuardada;
  }

  /**
   * Validar que todos los productos existan, estén activos y tengan stock
   * @returns Map con información de productos
   */
  private async validarYObtenerProductos(
    items: CrearOrdenDto['items'],
  ): Promise<Map<string, ProductoInfo>> {
    // Obtener IDs únicos
    const productosIds = [...new Set(items.map((item) => item.productoId))];

    // Validar existencia de todos los productos
    const productosMap = await this.productoRepositorio.validarProductosDisponibles(
      productosIds,
    );

    // Validar disponibilidad y precios
    for (const item of items) {
      const producto = productosMap.get(item.productoId);

      if (!producto) {
        throw new BadRequestException(
          `Producto con ID ${item.productoId} no encontrado`,
        );
      }

      // Validar que esté activo
      if (!producto.activo) {
        throw new BadRequestException(
          `El producto "${producto.nombre}" no está disponible`,
        );
      }

      // Validar stock suficiente
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${item.cantidad}`,
        );
      }

      // Validar que el precio no haya cambiado significativamente
      const diferenciaPrecio = Math.abs(producto.precio - item.precio);
      const porcentajeDiferencia = (diferenciaPrecio / producto.precio) * 100;

      if (porcentajeDiferencia > 5) {
        // Permitir 5% de diferencia por redondeo
        throw new BadRequestException(
          `El precio de "${producto.nombre}" ha cambiado. Precio actual: Q${producto.precio.toFixed(2)}`,
        );
      }
    }

    return productosMap;
  }

  /**
   * Crear items de orden con información de productos
   */
  private crearItemsOrden(
    itemsDto: CrearOrdenDto['items'],
    productosMap: Map<string, ProductoInfo>,
  ): ItemOrden[] {
    return itemsDto.map((itemDto) => {
      const producto = productosMap.get(itemDto.productoId);

      if (!producto) {
        throw new BadRequestException(
          `Producto con ID ${itemDto.productoId} no encontrado`,
        );
      }

      const subtotal = itemDto.cantidad * itemDto.precio;

      return new ItemOrden(
        itemDto.productoId,
        producto.nombre,
        itemDto.cantidad,
        itemDto.precio,
        subtotal,
      );
    });
  }

  /**
   * Generar número de orden único
   * Formato: ORD-YYYY-NNNNN
   */
  private async generarNumeroOrden(): Promise<string> {
    const año = new Date().getFullYear();
    const ultimaOrden = await this.prisma.orden.findFirst({
      where: {
        numeroOrden: {
          startsWith: `ORD-${año}-`,
        },
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });

    let numero = 1;

    if (ultimaOrden) {
      // Extraer el número de la última orden: ORD-2024-00001 -> 00001
      const partes = ultimaOrden.numeroOrden.split('-');
      const ultimoNumero = parseInt(partes[2], 10);
      numero = ultimoNumero + 1;
    }

    // Formatear con ceros a la izquierda (5 dígitos)
    const numeroFormateado = numero.toString().padStart(5, '0');

    return `ORD-${año}-${numeroFormateado}`;
  }

  /**
   * Guardar orden y reducir stock en una transacción atómica
   * Si falla alguna operación, toda la transacción se revierte
   */
  private async guardarOrdenYReducirStock(
    orden: Orden,
    items: CrearOrdenDto['items'],
  ): Promise<Orden> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Guardar la orden usando el repositorio con contexto de transacción
      const ordenCreada = await tx.orden.create({
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

      // 2. Reducir stock de cada producto usando el repositorio
      for (const item of items) {
        await this.productoRepositorio.reducirStock(
          item.productoId,
          item.cantidad,
          tx, // Pasar contexto de transacción
        );
      }

      // 3. Mapear resultado a entidad de dominio
      return this.mapearOrdenPrismaAEntidad(ordenCreada);
    });
  }

  /**
   * Convierte un valor Decimal de Prisma o number a number
   */
  private toNumber(value: number | { toNumber(): number }): number {
    return typeof value === 'number' ? value : value.toNumber();
  }

  /**
   * Mapear modelo de Prisma a entidad de dominio
   */
  private mapearOrdenPrismaAEntidad(ordenPrisma: {
    id: string;
    numeroOrden: string;
    nombreCompleto: string;
    telefono: string;
    email: string | null;
    direccion: string;
    departamento: string;
    municipio: string;
    zonaOColonia: string;
    referencia: string | null;
    estado: string;
    metodoPago: string;
    subtotal: number | { toNumber(): number };
    impuestos: number | { toNumber(): number };
    envio: number | { toNumber(): number };
    total: number | { toNumber(): number };
    notas: string | null;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    items: {
      productoId: string;
      nombreProducto: string;
      cantidad: number;
      precioUnitario: number | { toNumber(): number };
      subtotal: number | { toNumber(): number };
    }[];
  }): Orden {
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

    const itemsOrden = ordenPrisma.items.map(
      (item) =>
        new ItemOrden(
          item.productoId,
          item.nombreProducto,
          item.cantidad,
          this.toNumber(item.precioUnitario),
          this.toNumber(item.subtotal),
        ),
    );

    return new Orden(
      ordenPrisma.id,
      ordenPrisma.numeroOrden,
      cliente,
      direccionEnvio,
      itemsOrden,
      ordenPrisma.metodoPago as MetodoPago,
      this.toNumber(ordenPrisma.subtotal),
      this.toNumber(ordenPrisma.impuestos),
      this.toNumber(ordenPrisma.envio),
      this.toNumber(ordenPrisma.total),
      ordenPrisma.estado as EstadoOrden,
      ordenPrisma.notas,
      ordenPrisma.fechaCreacion,
      ordenPrisma.fechaActualizacion,
    );
  }
}
