/**
 * Página de Detalle de Producto
 * Diseño minimalista premium con galería de imágenes
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductoDetalle } from './producto-detalle';
import type { Producto } from '@/caracteristicas/catalogo-productos';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function obtenerProducto(slug: string): Promise<Producto | null> {
  try {
    const response = await fetch(`http://localhost:3001/api/productos/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener producto: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar producto:', error);
    return null;
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const producto = await obtenerProducto(slug);

  if (!producto) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navegación de migas de pan */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Inicio
          </Link>
          <span className="text-zinc-400">/</span>
          <Link href="/productos" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Productos
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-900 font-medium">{producto.nombre}</span>
        </nav>
      </div>

      {/* Contenido del producto */}
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductoDetalle producto={producto} />
      </Suspense>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Skeleton de galería */}
        <div className="space-y-4">
          <div className="aspect-square bg-zinc-100 rounded-lg animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Skeleton de info */}
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-zinc-100 rounded w-3/4" />
          <div className="h-12 bg-zinc-100 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-zinc-100 rounded" />
            <div className="h-4 bg-zinc-100 rounded" />
            <div className="h-4 bg-zinc-100 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
