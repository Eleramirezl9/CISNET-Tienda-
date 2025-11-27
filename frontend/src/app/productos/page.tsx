/**
 * Página de Catálogo de Productos
 * Diseño minimalista premium con espacio en blanco generoso
 */

import { Suspense } from 'react';
import { ProductosGrid } from './productos-grid';
import Link from 'next/link';
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
    <main className="min-h-screen bg-white">
      {/* Navegación de migas de pan */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <nav className="flex items-center gap-2 text-sm mb-12">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">Inicio</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-900 font-medium">Productos</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 pb-16 border-b border-zinc-100">
        <div>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-lg text-zinc-600 font-light max-w-2xl">
            Descubre nuestra cuidada selección de software y herramientas profesionales para potenciar tu productividad.
          </p>
        </div>

        {/* Filtros simples */}
        <div className="mt-12 flex items-center gap-4 flex-wrap">
          <button className="px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
            Todos los Productos
          </button>
          <button className="px-4 py-2.5 border border-zinc-200 text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
            Más Vendidos
          </button>
          <button className="px-4 py-2.5 border border-zinc-200 text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
            Ofertas
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductosGrid productos={productosEjemplo} />
        </Suspense>
      </div>

      {/* CTA de Contacto */}
      <section className="bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-zinc-600 font-light mb-8 max-w-2xl mx-auto">
            Nuestro equipo está listo para ayudarte a encontrar exactamente lo que necesitas.
          </p>
          <button className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors">
            Contactar Soporte
          </button>
        </div>
      </section>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
        >
          <div className="aspect-square bg-zinc-100 rounded-lg mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-zinc-100 rounded w-3/4" />
            <div className="h-4 bg-zinc-100 rounded w-1/2" />
            <div className="h-6 bg-zinc-100 rounded w-1/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
