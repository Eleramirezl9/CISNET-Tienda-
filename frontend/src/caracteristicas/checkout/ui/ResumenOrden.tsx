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

export function ResumenOrden() {
  const { items, subtotal, impuestos, envio, total, cantidadTotal } =
    useCarrito();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200 p-8">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="rounded-full bg-zinc-100 p-4 mb-4">
            <Package className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
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
    <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-1">
          Resumen de Orden
        </h2>
        <p className="text-sm text-zinc-600">
          {cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Lista de productos */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.productoId} className="flex gap-3">
            {/* Imagen */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
              <Image
                src={item.imagenPrincipal}
                alt={item.nombre}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-zinc-900 line-clamp-2 mb-1">
                {item.nombre}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  Cantidad: {item.cantidad}
                </span>
                <span className="text-sm font-semibold text-zinc-900">
                  {formatCurrency(item.precio * item.cantidad)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Desglose de costos */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">Subtotal</span>
          <span className="font-medium text-zinc-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-600">IVA (12%)</span>
          <span className="font-medium text-zinc-900">
            {formatCurrency(impuestos)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-600">Envío</span>
          <span className="font-medium text-zinc-900">
            {envio === 0 ? (
              <span className="text-green-600 font-semibold">GRATIS</span>
            ) : (
              formatCurrency(envio)
            )}
          </span>
        </div>

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-bold text-zinc-900">Total</span>
          <span className="text-2xl font-bold text-zinc-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Mensaje de envío gratis */}
      {envio === 0 && subtotal >= 500 && (
        <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-3">
          <p className="text-sm font-medium text-green-800 text-center">
            ✓ ¡Envío gratis aplicado!
          </p>
        </div>
      )}

      {/* Nota de seguridad */}
      <div className="mt-6 pt-6 border-t border-zinc-100">
        <p className="text-xs text-zinc-500 text-center">
          Tus datos están protegidos con encriptación SSL
        </p>
      </div>
    </div>
  );
}
