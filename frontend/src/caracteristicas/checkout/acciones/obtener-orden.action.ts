/**
 * SERVER ACTION - Obtener Orden
 *
 * Server Action para obtener los detalles de una orden por su número
 */

'use server';

import { apiClient } from '@/compartido/lib/api-client';

export interface OrdenDetalle {
  id: string;
  numeroOrden: string;
  estado: string;
  metodoPago: string;
  nombreCompleto: string;
  telefono: string;
  email?: string;
  direccion: string;
  departamento: string;
  municipio: string;
  zonaOColonia: string;
  referencia?: string;
  items: {
    productoId: string;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  subtotal: number;
  impuestos: number;
  envio: number;
  total: number;
  notas?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ResultadoObtenerOrden {
  success: boolean;
  data?: OrdenDetalle;
  error?: string;
}

export async function obtenerOrden(
  numeroOrden: string,
): Promise<ResultadoObtenerOrden> {
  try {
    if (!numeroOrden) {
      return {
        success: false,
        error: 'Número de orden no proporcionado',
      };
    }

    const response = await apiClient.get<OrdenDetalle>(
      `/ordenes/${numeroOrden}`,
    );

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error('Error al obtener orden:', error);

    if (error.statusCode === 404) {
      return {
        success: false,
        error: 'Orden no encontrada',
      };
    }

    return {
      success: false,
      error: error.message || 'Error al obtener la orden',
    };
  }
}
