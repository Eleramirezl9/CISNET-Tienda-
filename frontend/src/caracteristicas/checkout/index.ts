/**
 * Barril de exportación pública - Checkout
 */

// Dominio
export * from './dominio/checkout.types';

// UI
export { PaymentMethodSelector } from './ui/PaymentMethodSelector';
export { ResumenOrden } from './ui/ResumenOrden';

// Acciones
export { placeOrder } from './acciones/crear-orden.action';
export type { ResultadoPlaceOrder } from './acciones/crear-orden.action';
export { obtenerOrden } from './acciones/obtener-orden.action';
export type { OrdenDetalle, ResultadoObtenerOrden } from './acciones/obtener-orden.action';
export { actualizarEstadoOrden } from './acciones/actualizar-estado-orden.action';
export type { EstadoOrden } from './acciones/actualizar-estado-orden.action';
