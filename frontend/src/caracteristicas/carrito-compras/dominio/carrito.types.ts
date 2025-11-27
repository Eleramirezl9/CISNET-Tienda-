/**
 * Domain Types - Carrito de Compras
 * Definición de tipos e interfaces del dominio de carrito
 */

import { z } from 'zod';

/**
 * Item del carrito
 */
export const ItemCarritoSchema = z.object({
  productoId: z.string().uuid(),
  nombre: z.string(),
  slug: z.string(),
  precio: z.number().positive(),
  cantidad: z.number().int().positive(),
  imagenPrincipal: z.string().url(),
  stock: z.number().int().nonnegative(),
});

export type ItemCarrito = z.infer<typeof ItemCarritoSchema>;

/**
 * Estado del carrito completo
 */
export interface EstadoCarrito {
  items: ItemCarrito[];
  subtotal: number;
  impuestos: number;
  envio: number;
  total: number;
  cantidadTotal: number;
}

/**
 * Acciones del carrito
 */
export interface AccionesCarrito {
  agregarItem: (productoId: string, nombre: string, slug: string, precio: number, imagen: string, stock: number) => void;
  removerItem: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  calcularTotales: () => void;
}
