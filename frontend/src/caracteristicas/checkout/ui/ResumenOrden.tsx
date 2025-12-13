/**
 * ResumenOrden - Resumen Sticky de la Orden
 * Muestra el detalle de productos y totales
 */

'use client';

import Image from 'next/image';
import { useCarrito } from '@/caracteristicas/carrito-compras';
import { Separator } from '@/compartido/ui';
import { formatCurrency } from '@/compartido/lib/formatters';
import { Package } from 'lucide-react';
import { ReactNode } from 'react';

interface ResumenOrdenProps {
  children?: ReactNode;
}

export function ResumenOrden({ children }: ResumenOrdenProps) {
  const { items, subtotal, impuestos, envio, total, cantidadTotal } =
    useCarrito();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="rounded-full bg-zinc-100 p-3 mb-3">
            <Package className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">
            Carrito vacío
          </h3>
          <p className="text-sm text-zinc-600">
            Agrega productos para continuar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      {/* Header limpio */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Resumen
        </h2>
        <span className="text-xs text-slate-500">
          {cantidadTotal} {cantidadTotal === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Lista de productos compacta */}
      <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.productoId} className="flex gap-2">
            {/* Imagen pequeña */}
            <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-zinc-100">
              <Image
                src={item.imagenPrincipal}
                alt={item.nombre}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-zinc-900 line-clamp-1">
                {item.nombre}
              </h3>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-zinc-500">
                  x{item.cantidad}
                </span>
                <span className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(item.precio * item.cantidad)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      {/* Desglose de costos compacto */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Subtotal</span>
          <span className="text-zinc-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-500">IVA (12%)</span>
          <span className="text-zinc-900">{formatCurrency(impuestos)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Envío</span>
          {envio === 0 ? (
            <span className="text-green-600 font-medium">GRATIS</span>
          ) : (
            <span className="text-zinc-900">{formatCurrency(envio)}</span>
          )}
        </div>
      </div>

      <Separator className="my-3" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">Total</span>
        <span className="text-lg font-bold text-slate-900">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Mensaje de envío gratis */}
      {envio === 0 && subtotal >= 500 && (
        <p className="text-xs text-emerald-600 mt-2">
          Envío gratis incluido
        </p>
      )}

      {/* Slot para botón de pago y acciones */}
      {children && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}
