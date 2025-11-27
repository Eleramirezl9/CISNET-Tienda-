/**
 * Productos Service - Capa de Infraestructura
 * Server Actions para comunicación con el backend
 */

'use server';

import { apiClient, ApiError } from '@/compartido/lib/api-client';
import {
  Producto,
  PaginacionProductos,
  FiltrosProducto,
  ProductoSchema,
} from '../dominio/producto.types';

/**
 * Obtiene todos los productos con filtros opcionales
 */
export async function obtenerProductos(
  filtros: FiltrosProducto = {}
): Promise<PaginacionProductos> {
  try {
    const params: Record<string, string | number | boolean> = {};

    if (filtros.categoriaId) params.categoriaId = filtros.categoriaId;
    if (filtros.precioMin) params.precioMin = filtros.precioMin;
    if (filtros.precioMax) params.precioMax = filtros.precioMax;
    if (filtros.busqueda) params.busqueda = filtros.busqueda;
    if (filtros.destacados !== undefined) params.destacados = filtros.destacados;
    if (filtros.disponibles !== undefined) params.disponibles = filtros.disponibles;
    if (filtros.ordenar) params.ordenar = filtros.ordenar;
    if (filtros.pagina) params.pagina = filtros.pagina;
    if (filtros.limite) params.limite = filtros.limite;

    const data = await apiClient.get<PaginacionProductos>('/productos', { params });
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Error al obtener productos:', error.data);
      throw new Error('No se pudieron cargar los productos');
    }
    throw error;
  }
}

/**
 * Obtiene un producto por su slug
 */
export async function obtenerProductoPorSlug(slug: string): Promise<Producto> {
  try {
    const data = await apiClient.get<Producto>(`/productos/slug/${slug}`);
    
    // Validar la respuesta con Zod
    const productoValidado = ProductoSchema.parse(data);
    
    return productoValidado;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error('Error al obtener el producto');
    }
    throw error;
  }
}

/**
 * Obtiene un producto por su ID
 */
export async function obtenerProductoPorId(id: string): Promise<Producto> {
  try {
    const data = await apiClient.get<Producto>(`/productos/${id}`);
    
    const productoValidado = ProductoSchema.parse(data);
    
    return productoValidado;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error('Error al obtener el producto');
    }
    throw error;
  }
}

/**
 * Obtiene productos destacados
 */
export async function obtenerProductosDestacados(limite = 8): Promise<Producto[]> {
  try {
    const data = await obtenerProductos({
      destacados: true,
      disponibles: true,
      limite,
      ordenar: 'reciente',
    });
    
    return data.productos;
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    throw new Error('No se pudieron cargar los productos destacados');
  }
}

/**
 * Busca productos por término de búsqueda
 */
export async function buscarProductos(
  busqueda: string,
  pagina = 1,
  limite = 20
): Promise<PaginacionProductos> {
  try {
    const data = await obtenerProductos({
      busqueda,
      disponibles: true,
      pagina,
      limite,
    });
    
    return data;
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw new Error('Error en la búsqueda de productos');
  }
}
