/**
 * PUERTO - Repositorio de Productos (para módulo de Órdenes)
 *
 * Define el contrato para acceder a información de productos
 * necesaria para crear órdenes. Este puerto permite al módulo
 * de órdenes consultar productos sin depender directamente del
 * módulo de productos.
 */

export interface ProductoInfo {
  readonly id: string;
  readonly nombre: string;
  readonly precio: number;
  readonly stock: number;
  readonly activo: boolean;
}

export interface ProductoRepositorio {
  /**
   * Buscar producto por ID
   */
  buscarPorId(id: string): Promise<ProductoInfo | null>;

  /**
   * Reducir stock de un producto (dentro de una transacción)
   * @param productoId ID del producto
   * @param cantidad Cantidad a reducir
   * @param transaccion Contexto de transacción (opcional)
   */
  reducirStock(
    productoId: string,
    cantidad: number,
    transaccion?: unknown,
  ): Promise<void>;

  /**
   * Validar que múltiples productos existan y tengan stock
   * @returns Map con ID producto -> ProductoInfo
   */
  validarProductosDisponibles(
    productosIds: string[],
  ): Promise<Map<string, ProductoInfo>>;
}

export const PRODUCTO_REPOSITORIO = Symbol('ProductoRepositorio');
