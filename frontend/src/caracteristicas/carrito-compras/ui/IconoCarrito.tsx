/**
 * IconoCarrito - Shopping Cart Icon with Badge
 * Ícono de carrito con contador de items y trigger del Sheet
 */

'use client';

import { useState } from 'react';
import { useCarrito } from '../aplicacion/useCarrito';
import { CarritoSheet } from './CarritoSheet';
import { ShoppingBag } from 'lucide-react';

export function IconoCarrito() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const { cantidadTotal } = useCarrito();

  return (
    <>
      <button
        onClick={() => setCarritoAbierto(true)}
        className="relative rounded-lg p-2.5 hover:bg-zinc-100 transition-colors group"
        aria-label="Abrir carrito de compras"
      >
        <ShoppingBag className="h-6 w-6 text-zinc-700 group-hover:text-zinc-900 transition-colors" />

        {/* Badge con cantidad */}
        {cantidadTotal > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white ring-2 ring-white">
            {cantidadTotal > 9 ? '9+' : cantidadTotal}
          </span>
        )}
      </button>

      <CarritoSheet
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
      />
    </>
  );
}
