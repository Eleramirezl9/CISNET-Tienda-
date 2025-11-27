/**
 * Página de Catálogo de Productos
 */

import { Suspense } from 'react';
import { ProductosGrid } from './productos-grid';
import type { Producto } from '@/caracteristicas/catalogo-productos';

// Datos de ejemplo (mock) - Reemplazar con obtenerProductos() del service
const productosEjemplo: Producto[] = [
  {
    id: '1',
    nombre: 'Laptop Dell XPS 15',
    descripcion: 'Laptop de alto rendimiento con procesador Intel i7 y 16GB RAM',
    slug: 'laptop-dell-xps-15',
    precio: 12500,
    precioAnterior: 15000,
    stock: 5,
    imagenPrincipal: 'https://res.cloudinary.com/demo/image/upload/laptop.jpg',
    imagenes: [],
    categoriaId: 'cat-1',
    categoria: 'Computadoras',
    etiquetas: ['laptop', 'dell', 'gaming'],
    caracteristicas: {
      procesador: 'Intel i7',
      ram: '16GB',
      almacenamiento: '512GB SSD',
    },
    activo: true,
    destacado: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Mouse Logitech MX Master 3',
    descripcion: 'Mouse ergonómico profesional con conectividad Bluetooth',
    slug: 'mouse-logitech-mx-master-3',
    precio: 850,
    precioAnterior: null,
    stock: 15,
    imagenPrincipal: 'https://res.cloudinary.com/demo/image/upload/mouse.jpg',
    imagenes: [],
    categoriaId: 'cat-2',
    categoria: 'Accesorios',
    etiquetas: ['mouse', 'logitech', 'wireless'],
    caracteristicas: {
      conectividad: 'Bluetooth',
      bateria: '70 días',
    },
    activo: true,
    destacado: false,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: '3',
    nombre: 'Teclado Mecánico Corsair K95',
    descripcion: 'Teclado mecánico RGB con switches Cherry MX',
    slug: 'teclado-mecanico-corsair-k95',
    precio: 1200,
    precioAnterior: 1400,
    stock: 0,
    imagenPrincipal: 'https://res.cloudinary.com/demo/image/upload/keyboard.jpg',
    imagenes: [],
    categoriaId: 'cat-2',
    categoria: 'Accesorios',
    etiquetas: ['teclado', 'mecánico', 'gaming'],
    caracteristicas: {
      switches: 'Cherry MX Red',
      iluminacion: 'RGB',
    },
    activo: true,
    destacado: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
];

export default function ProductosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
          <p className="mt-2 text-gray-600">
            Explora nuestra selección de productos tecnológicos
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductosGrid productos={productosEjemplo} />
        </Suspense>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
