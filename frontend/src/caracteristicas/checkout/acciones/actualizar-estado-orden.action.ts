/**
 * Server Action - Actualizar Estado de Orden
 * Permite a los administradores actualizar el estado de una orden
 */

'use server';

import { apiClient } from '@/compartido/lib/api-client';

export type EstadoOrden =
  | 'pendiente'
  | 'confirmada'
  | 'en_proceso'
  | 'enviada'
  | 'entregada'
  | 'cancelada';

interface ActualizarEstadoInput {
  numeroOrden: string;
  estado: EstadoOrden;
  notas?: string;
}

interface ResultadoActualizacion {
  success: boolean;
  error?: string;
}

export async function actualizarEstadoOrden(
  input: ActualizarEstadoInput,
): Promise<ResultadoActualizacion> {
  try {
    await apiClient.patch(`/ordenes/${input.numeroOrden}/estado`, {
      estado: input.estado,
      notas: input.notas,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error al actualizar estado de orden:', error);

    // Manejar errores específicos
    if (error.statusCode === 404) {
      return {
        success: false,
        error: 'Orden no encontrada',
      };
    }

    if (error.statusCode === 400) {
      return {
        success: false,
        error: error.message || 'Transición de estado inválida',
      };
    }

    return {
      success: false,
      error: error.message || 'Error al actualizar el estado de la orden',
    };
  }
}
