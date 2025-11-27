/**
 * Domain Types - Catálogo de Productos
 * Definición de tipos e interfaces puras del dominio de productos
 */

import { z } from 'zod';

/**
 * Schema de validación para Producto usando Zod
 */
export const ProductoSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  slug: z.string().min(1, 'El slug es requerido'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  precioAnterior: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  imagenPrincipal: z.string().url('Debe ser una URL válida'),
  imagenes: z.array(z.string().url()).default([]),
  categoriaId: z.string().uuid(),
  categoria: z.string(),
  etiquetas: z.array(z.string()).default([]),
  caracteristicas: z.record(z.string()).default({}),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  fechaCreacion: z.string().datetime(),
  fechaActualizacion: z.string().datetime(),
});

/**
 * Tipo inferido del schema
 */
export type Producto = z.infer<typeof ProductoSchema>;

/**
 * DTO para creación de producto
 */
export const CrearProductoSchema = ProductoSchema.omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});

export type CrearProductoDto = z.infer<typeof CrearProductoSchema>;

/**
 * DTO para actualización de producto
 */
export const ActualizarProductoSchema = CrearProductoSchema.partial();

export type ActualizarProductoDto = z.infer<typeof ActualizarProductoSchema>;

/**
 * Filtros para búsqueda de productos
 */
export interface FiltrosProducto {
  categoriaId?: string;
  precioMin?: number;
  precioMax?: number;
  etiquetas?: string[];
  busqueda?: string;
  destacados?: boolean;
  disponibles?: boolean;
  ordenar?: 'precio-asc' | 'precio-desc' | 'reciente' | 'nombre';
  pagina?: number;
  limite?: number;
}

/**
 * Respuesta paginada de productos
 */
export interface PaginacionProductos {
  productos: Producto[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}
