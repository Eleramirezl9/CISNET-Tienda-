/**
 * MAPPER - Producto
 * 
 * Convierte entidades de dominio a DTOs de respuesta
 */

import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import { ProductoResponseDto } from '@/productos/aplicacion/dto/producto-response.dto';

export class ProductoMapper {
  static aResponse(producto: Producto): ProductoResponseDto {
    return {
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
      tieneDescuento: producto.tieneDescuento(),
      porcentajeDescuento: producto.calcularPorcentajeDescuento(),
      disponible: producto.estaDisponible(),
    };
  }
}
