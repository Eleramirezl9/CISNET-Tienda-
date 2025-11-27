/**
 * ProductoCard - Componente UI
 * Tarjeta de producto minimalista premium con micro-interacciones
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
        'group relative flex flex-col overflow-hidden bg-white transition-all duration-300',
        sinStock && 'opacity-70',
        className
      )}
    >
      {/* Badge de descuento - Elegante */}
      {tieneDescuento && !sinStock && (
        <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg">
          -{porcentajeDescuento}%
        </div>
      )}

      {/* Badge sin stock - Elegante */}
      {sinStock && (
        <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-600 text-white text-xs font-semibold rounded-lg">
          Agotado
        </div>
      )}

      {/* Imagen del producto - Con efecto sutil */}
      <Link href={`/productos/${producto.slug}`} className="relative aspect-square overflow-hidden mb-8 bg-zinc-100">
        <Image
          src={producto.imagenPrincipal}
          alt={producto.nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay sutil al hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Contenido - Espaciado generoso */}
      <div className="flex flex-1 flex-col">
        {/* Categoría - Uppercase discreto */}
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          {producto.categoria}
        </p>

        {/* Título - Tipografía fuerte */}
        <Link href={`/productos/${producto.slug}`}>
          <h3 className="text-lg font-bold text-zinc-900 leading-snug line-clamp-2 mb-4 group-hover:text-zinc-700 transition-colors duration-200">
            {producto.nombre}
          </h3>
        </Link>

        {/* Descripción - Gris suave */}
        <p className="text-sm text-zinc-600 line-clamp-2 mb-6 flex-1 font-light leading-relaxed">
          {producto.descripcion}
        </p>

        {/* Precios - Alineados a la izquierda */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-2xl font-bold text-zinc-900">
            {formatCurrency(producto.precio)}
          </span>
          {tieneDescuento && (
            <span className="text-sm font-medium text-zinc-400 line-through">
              {formatCurrency(producto.precioAnterior!)}
            </span>
          )}
        </div>

        {/* Botón de acción - Premium */}
        <button
          onClick={() => onAgregarCarrito?.(producto)}
          disabled={sinStock}
          className={cn(
            'w-full rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 active:scale-95',
            sinStock
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-md'
          )}
        >
          {sinStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>

        {/* Stock disponible - Alerta sutil */}
        {!sinStock && producto.stock < 5 && (
          <p className="mt-4 text-xs text-zinc-600 font-medium">
            ⚠️ Solo quedan {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
          </p>
        )}
      </div>
    </article>
  );
}
