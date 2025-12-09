/**
 * PUERTO - Repositorio de Órdenes
 *
 * Define el contrato (interface) para persistir órdenes
 * No define cómo se implementa (podría ser SQL, NoSQL, etc.)
 */

import { Orden } from '../entidades/orden.entidad';

export interface OrdenRepositorio {
  /**
   * Guardar una nueva orden
   */
  guardar(orden: Orden): Promise<Orden>;

  /**
   * Buscar orden por ID
   */
  buscarPorId(id: string): Promise<Orden | null>;

  /**
   * Buscar orden por número de orden
   */
  buscarPorNumeroOrden(numeroOrden: string): Promise<Orden | null>;

  /**
   * Actualizar orden existente
   */
  actualizar(orden: Orden): Promise<Orden>;

  /**
   * Listar todas las órdenes (con paginación)
   */
  listar(pagina: number, limite: number): Promise<{
    ordenes: Orden[];
    total: number;
  }>;
}

export const ORDEN_REPOSITORIO = Symbol('OrdenRepositorio');
