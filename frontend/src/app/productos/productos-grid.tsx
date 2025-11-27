/**
 * Grid de Productos - Client Component
 * Diseño minimalista premium con micro-interacciones
 */

'use client';

import { ProductoCard } from '@/caracteristicas/catalogo-productos';
import { useCarrito } from '@/caracteristicas/carrito-compras';
import type { Producto } from '@/caracteristicas/catalogo-productos';

interface ProductosGridProps {
  productos: Producto[];
}

export function ProductosGrid({ productos }: ProductosGridProps) {
  const { agregarItem } = useCarrito();

  const handleAgregarCarrito = (producto: Producto) => {
    agregarItem(
      producto.id,
      producto.nombre,
      producto.slug,
      producto.precio,
      producto.imagenPrincipal,
      producto.stock
    );
    
    // Feedback visual (opcional: usar toast notification)
    console.log('Producto agregado:', producto.nombre);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onAgregarCarrito={handleAgregarCarrito}
        />
      ))}
    </div>
  );
}
