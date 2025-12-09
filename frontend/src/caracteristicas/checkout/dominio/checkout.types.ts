/**
 * Domain Types - Checkout
 * Definición de tipos e interfaces del dominio de checkout
 */

import { z } from 'zod';

/**
 * Métodos de pago disponibles en Guatemala
 */
export enum MetodoPago {
  TARJETA_GT = 'tarjeta_gt',
  BILLETERA_FRI = 'billetera_fri',
  CONTRA_ENTREGA = 'contra_entrega',
  TARJETA_INTERNACIONAL = 'tarjeta_internacional',
  PAYPAL = 'paypal',
  RECURRENTE = 'recurrente',
}

/**
 * Departamentos de Guatemala
 */
export const DEPARTAMENTOS_GT = [
  'Guatemala',
  'Alta Verapaz',
  'Baja Verapaz',
  'Chimaltenango',
  'Chiquimula',
  'El Progreso',
  'Escuintla',
  'Huehuetenango',
  'Izabal',
  'Jalapa',
  'Jutiapa',
  'Petén',
  'Quetzaltenango',
  'Quiché',
  'Retalhuleu',
  'Sacatepéquez',
  'San Marcos',
  'Santa Rosa',
  'Sololá',
  'Suchitepéquez',
  'Totonicapán',
  'Zacapa',
] as const;

/**
 * Schema de validación para el formulario de checkout
 */
export const checkoutFormSchema = z.object({
  // Datos personales
  nombreCompleto: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),

  telefono: z
    .string()
    .regex(/^[0-9]{8}$/, 'El teléfono debe tener 8 dígitos'),

  email: z
    .string()
    .email('Email inválido')
    .optional(),

  // Dirección de envío
  direccion: z
    .string()
    .min(10, 'La dirección debe ser más específica')
    .max(200, 'La dirección es demasiado larga'),

  departamento: z
    .string()
    .min(1, 'Selecciona un departamento'),

  municipio: z
    .string()
    .min(1, 'El municipio es requerido')
    .max(100, 'El municipio es demasiado largo'),

  zonaOColonia: z
    .string()
    .min(1, 'Especifica la zona o colonia')
    .max(100, 'La zona/colonia es demasiado larga'),

  referencia: z
    .string()
    .max(200, 'La referencia es demasiado larga')
    .optional(),

  // Método de pago
  metodoPago: z.nativeEnum(MetodoPago, {
    required_error: 'Selecciona un método de pago',
  }),

  // Notas adicionales (opcional)
  notas: z
    .string()
    .max(500, 'Las notas son demasiado largas')
    .optional(),
});

/**
 * Tipo inferido del schema
 */
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Estado del proceso de checkout
 */
export interface EstadoCheckout {
  paso: 'formulario' | 'procesando' | 'completado' | 'error';
  ordenId?: string;
  error?: string;
}
