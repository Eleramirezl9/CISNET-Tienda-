/**
 * INTERFACE REPOSITORIO - Producto (PORT)
 * 
 * Define el contrato que debe cumplir cualquier implementación de repositorio
 * Esta es la capa de abstracción entre el dominio y la infraestructura
 */

import { Producto } from '../entidades/producto.entidad';

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

export interface ResultadoPaginado<T> {
  items: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export const PRODUCTO_REPOSITORIO = 'PRODUCTO_REPOSITORIO';

export interface IProductoRepositorio {
  /**
   * Guardar un producto (crear o actualizar)
   */
  guardar(producto: Producto): Promise<Producto>;

  /**
   * Buscar producto por ID
   */
  buscarPorId(id: string): Promise<Producto | null>;

  /**
   * Buscar producto por slug
   */
  buscarPorSlug(slug: string): Promise<Producto | null>;

  /**
   * Buscar todos los productos con filtros opcionales
   */
  buscarTodos(filtros?: FiltrosProducto): Promise<ResultadoPaginado<Producto>>;

  /**
   * Eliminar un producto
   */
  eliminar(id: string): Promise<void>;

  /**
   * Verificar si existe un producto con un slug
   */
  existeSlug(slug: string, excludeId?: string): Promise<boolean>;

  /**
   * Buscar productos por categoría
   */
  buscarPorCategoria(categoriaId: string, limite?: number): Promise<Producto[]>;

  /**
   * Buscar productos destacados
   */
  buscarDestacados(limite?: number): Promise<Producto[]>;

  /**
   * Actualizar stock de múltiples productos (transaccional)
   */
  actualizarStockMasivo(actualizaciones: Array<{ id: string; cantidad: number }>): Promise<void>;
}
