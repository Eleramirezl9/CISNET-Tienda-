/**
 * BotonAgregarCarrito - Reusable Add to Cart Button
 * Botón reutilizable con feedback visual y apertura automática del carrito
 */

'use client';

import { useState } from 'react';
import { useCarrito } from '../aplicacion/useCarrito';
import { Button } from '@/compartido/ui';
import { ShoppingCart, Check } from 'lucide-react';
import type { Producto } from '@/caracteristicas/catalogo-productos';

interface BotonAgregarCarritoProps {
  producto: Producto;
  onCarritoAbierto?: () => void;
  className?: string;
  variante?: 'default' | 'outline' | 'ghost';
  tamano?: 'default' | 'sm' | 'lg';
  textoCompleto?: boolean;
}

export function BotonAgregarCarrito({
  producto,
  onCarritoAbierto,
  className,
  variante = 'default',
  tamano = 'default',
  textoCompleto = true,
}: BotonAgregarCarritoProps) {
  const { agregarItem } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  const sinStock = producto.stock <= 0;

  const manejarClick = () => {
    if (sinStock) return;

    // Agregar al carrito
    agregarItem(
      producto.id,
      producto.nombre,
      producto.slug,
      producto.precio,
      producto.imagenPrincipal,
      producto.stock
    );

    // Feedback visual
    setAgregado(true);

    // Abrir el carrito después de un breve delay
    setTimeout(() => {
      onCarritoAbierto?.();
    }, 300);

    // Reset del estado después de 2 segundos
    setTimeout(() => {
      setAgregado(false);
    }, 2000);
  };

  return (
    <Button
      onClick={manejarClick}
      disabled={sinStock}
      variant={variante}
      size={tamano}
      className={className}
    >
      {sinStock ? (
        textoCompleto ? (
          'Sin stock'
        ) : (
          'Agotado'
        )
      ) : agregado ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          {textoCompleto && 'Agregado'}
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {textoCompleto ? 'Agregar al carrito' : 'Agregar'}
        </>
      )}
    </Button>
  );
}
