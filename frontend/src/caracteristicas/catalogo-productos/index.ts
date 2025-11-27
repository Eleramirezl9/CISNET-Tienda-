/**
 * Barril de exportación pública - Catálogo de Productos
 * Solo exportar lo que debe ser público
 */

// Dominio
export * from './dominio/producto.types';

// Infraestructura (Server Actions)
export {
  obtenerProductos,
  obtenerProductoPorSlug,
  obtenerProductoPorId,
  obtenerProductosDestacados,
  buscarProductos,
} from './infraestructura/productos.service';

// UI
export { ProductoCard } from './ui/producto-card';
