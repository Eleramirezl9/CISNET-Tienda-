/**
 * Server Action - Crear Orden
 * Maneja la creación de órdenes en el backend
 */

'use server';

import { apiClient, ApiError } from '@/compartido/lib/api-client';
import type { CheckoutFormData } from '../dominio/checkout.types';
import type { ItemCarrito } from '@/caracteristicas/carrito-compras/dominio/carrito.types';

/**
 * DTO para crear orden en el backend
 */
interface CrearOrdenDTO {
  // Datos del cliente
  nombreCompleto: string;
  telefono: string;
  email?: string;

  // Dirección de envío
  direccion: string;
  departamento: string;
  municipio: string;
  zonaOColonia: string;
  referencia?: string;

  // Método de pago
  metodoPago: string;

  // Notas adicionales
  notas?: string;

  // Items del carrito
  items: {
    productoId: string;
    cantidad: number;
    precio: number;
  }[];

  // Totales
  subtotal: number;
  impuestos: number;
  envio: number;
  total: number;
}

/**
 * Respuesta del backend al crear orden
 */
interface OrdenCreada {
  id: string;
  numeroOrden: string;
  estado: string;
  total: number;
  fechaCreacion: string;
  metodoPago: string;
}

/**
 * Resultado de la operación
 */
export interface ResultadoPlaceOrder {
  success: boolean;
  data?: OrdenCreada;
  error?: string;
}

/**
 * Transforma los datos del formulario y carrito al formato DTO del backend
 */
function transformarADTO(
  formData: CheckoutFormData,
  cartItems: ItemCarrito[],
  totales: {
    subtotal: number;
    impuestos: number;
    envio: number;
    total: number;
  }
): CrearOrdenDTO {
  return {
    // Datos del cliente
    nombreCompleto: formData.nombreCompleto,
    telefono: formData.telefono,
    email: formData.email || undefined,

    // Dirección de envío
    direccion: formData.direccion,
    departamento: formData.departamento,
    municipio: formData.municipio,
    zonaOColonia: formData.zonaOColonia,
    referencia: formData.referencia || undefined,

    // Método de pago
    metodoPago: formData.metodoPago,

    // Notas adicionales
    notas: formData.notas || undefined,

    // Items del carrito - solo enviamos lo necesario
    items: cartItems.map((item) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
      precio: item.precio,
    })),

    // Totales
    subtotal: totales.subtotal,
    impuestos: totales.impuestos,
    envio: totales.envio,
    total: totales.total,
  };
}

/**
 * Server Action: Crear orden en el backend
 *
 * @param formData - Datos del formulario de checkout
 * @param cartItems - Items del carrito
 * @param totales - Totales calculados (subtotal, impuestos, envío, total)
 * @returns Resultado de la operación con datos de la orden creada o mensaje de error
 */
export async function placeOrder(
  formData: CheckoutFormData,
  cartItems: ItemCarrito[],
  totales: {
    subtotal: number;
    impuestos: number;
    envio: number;
    total: number;
  }
): Promise<ResultadoPlaceOrder> {
  try {
    // Validación básica
    if (!cartItems || cartItems.length === 0) {
      return {
        success: false,
        error: 'El carrito está vacío',
      };
    }

    if (totales.total <= 0) {
      return {
        success: false,
        error: 'El total de la orden debe ser mayor a 0',
      };
    }

    // Transformar datos al formato DTO del backend
    const ordenDTO = transformarADTO(formData, cartItems, totales);

    // Enviar petición al backend
    const ordenCreada = await apiClient.post<OrdenCreada>(
      '/ordenes',
      ordenDTO
    );

    return {
      success: true,
      data: ordenCreada,
    };
  } catch (error) {
    // Manejo de errores
    if (error instanceof ApiError) {
      // Error de la API (4xx, 5xx)
      const errorMessage =
        error.data && typeof error.data === 'object' && 'message' in error.data
          ? String((error.data as { message: unknown }).message)
          : `Error del servidor: ${error.status} ${error.statusText}`;

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Error de red o desconocido
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error desconocido al procesar el pedido';

    return {
      success: false,
      error: errorMessage,
    };
  }
}
