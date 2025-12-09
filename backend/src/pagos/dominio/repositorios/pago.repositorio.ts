/**
 * PUERTO - Repositorio de Pagos
 *
 * Define el contrato (interface) para persistir pagos
 */

import { Pago } from '../entidades/pago.entidad';

export interface PagoRepositorio {
  /**
   * Guardar un nuevo pago
   */
  guardar(pago: Pago): Promise<Pago>;

  /**
   * Buscar pago por ID
   */
  buscarPorId(id: string): Promise<Pago | null>;

  /**
   * Buscar pago por número de orden
   */
  buscarPorNumeroOrden(numeroOrden: string): Promise<Pago | null>;

  /**
   * Buscar pago por ID de transacción externa
   */
  buscarPorTransaccionId(transaccionId: string): Promise<Pago | null>;

  /**
   * Actualizar estado del pago
   */
  actualizar(pago: Pago): Promise<Pago>;

  /**
   * Listar pagos con filtros opcionales
   */
  listar(filtros: {
    estado?: string;
    metodoPago?: string;
    desde?: Date;
    hasta?: Date;
    pagina: number;
    limite: number;
  }): Promise<{
    pagos: Pago[];
    total: number;
  }>;
}

export const PAGO_REPOSITORIO = Symbol('PagoRepositorio');
