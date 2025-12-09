/**
 * DTO - Response de Orden
 *
 * Estructura de respuesta para consultas de órdenes
 */

import { Orden, ItemOrden } from '@/ordenes/dominio/entidades/orden.entidad';

export class ItemOrdenResponseDto {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;

  static fromDomain(item: ItemOrden): ItemOrdenResponseDto {
    return {
      productoId: item.productoId,
      nombreProducto: item.nombreProducto,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal,
    };
  }
}

export class OrdenResponseDto {
  id: string;
  numeroOrden: string;
  estado: string;
  metodoPago: string;

  // Cliente
  nombreCompleto: string;
  telefono: string;
  email?: string;

  // Dirección
  direccion: string;
  departamento: string;
  municipio: string;
  zonaOColonia: string;
  referencia?: string;

  // Items
  items: ItemOrdenResponseDto[];

  // Totales
  subtotal: number;
  impuestos: number;
  envio: number;
  total: number;

  // Notas
  notas?: string;

  // Fechas
  fechaCreacion: Date;
  fechaActualizacion: Date;

  static fromDomain(orden: Orden): OrdenResponseDto {
    return {
      id: orden.id,
      numeroOrden: orden.numeroOrden,
      estado: orden.estado,
      metodoPago: orden.metodoPago,
      nombreCompleto: orden.cliente.nombreCompleto,
      telefono: orden.cliente.telefono,
      email: orden.cliente.email,
      direccion: orden.direccionEnvio.direccion,
      departamento: orden.direccionEnvio.departamento,
      municipio: orden.direccionEnvio.municipio,
      zonaOColonia: orden.direccionEnvio.zonaOColonia,
      referencia: orden.direccionEnvio.referencia,
      items: orden.items.map((item) => ItemOrdenResponseDto.fromDomain(item)),
      subtotal: orden.subtotal,
      impuestos: orden.impuestos,
      envio: orden.envio,
      total: orden.total,
      notas: orden.notas ?? undefined,
      fechaCreacion: orden.fechaCreacion,
      fechaActualizacion: orden.fechaActualizacion,
    };
  }
}
