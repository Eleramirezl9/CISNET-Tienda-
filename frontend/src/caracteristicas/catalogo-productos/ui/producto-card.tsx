/**
 * ProductoCard - Componente UI
 * Tarjeta de producto con imagen, título, precio y acciones
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Producto } from '../dominio/producto.types';
import { formatCurrency } from '@/compartido/lib/formatters';
import { cn } from '@/compartido/lib/cn';

interface ProductoCardProps {
  producto: Producto;
  className?: string;
  onAgregarCarrito?: (producto: Producto) => void;
}

export function ProductoCard({ producto, className, onAgregarCarrito }: ProductoCardProps) {
  const tieneDescuento = producto.precioAnterior && producto.precioAnterior > producto.precio;
  const porcentajeDescuento = tieneDescuento
    ? Math.round(((producto.precioAnterior! - producto.precio) / producto.precioAnterior!) * 100)
    : 0;

  const sinStock = producto.stock <= 0;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg',
        sinStock && 'opacity-60',
        className
      )}
    >
      {/* Badge de descuento */}
      {tieneDescuento && !sinStock && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
          -{porcentajeDescuento}%
        </div>
      )}

      {/* Badge sin stock */}
      {sinStock && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-gray-800 px-2 py-1 text-xs font-bold text-white">
          Agotado
        </div>
      )}

      {/* Imagen del producto */}
      <Link href={`/productos/${producto.slug}`} className="relative aspect-square overflow-hidden">
        <Image
          src={producto.imagenPrincipal}
          alt={producto.nombre}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        {/* Categoría */}
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
          {producto.categoria}
        </p>

        {/* Título */}
        <Link href={`/productos/${producto.slug}`}>
          <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors">
            {producto.nombre}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="mb-3 flex-1 text-sm text-gray-600 line-clamp-2">
          {producto.descripcion}
        </p>

        {/* Precios */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(producto.precio)}
          </span>
          {tieneDescuento && (
            <span className="text-sm font-medium text-gray-500 line-through">
              {formatCurrency(producto.precioAnterior!)}
            </span>
          )}
        </div>

        {/* Botón de acción */}
        <button
          onClick={() => onAgregarCarrito?.(producto)}
          disabled={sinStock}
          className={cn(
            'w-full rounded-md py-2 px-4 text-sm font-semibold transition-colors',
            sinStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
          )}
        >
          {sinStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>

        {/* Stock disponible */}
        {!sinStock && producto.stock < 5 && (
          <p className="mt-2 text-xs text-amber-600 font-medium">
            ¡Solo quedan {producto.stock} unidades!
          </p>
        )}
      </div>
    </article>
  );
}
