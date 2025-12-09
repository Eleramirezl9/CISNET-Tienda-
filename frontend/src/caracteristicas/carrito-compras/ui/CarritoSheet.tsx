/**
 * CarritoSheet - Slide-Over Cart Component
 * Panel lateral premium con micro-interacciones y diseño minimalista
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCarrito } from '../aplicacion/useCarrito';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  ScrollArea,
  Separator,
  Button,
} from '@/compartido/ui';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/compartido/lib/formatters';

interface CarritoSheetProps {
  abierto: boolean;
  onCerrar: () => void;
}

export function CarritoSheet({ abierto, onCerrar }: CarritoSheetProps) {
  const router = useRouter();
  const {
    items,
    cantidadTotal,
    subtotal,
    impuestos,
    envio,
    total,
    actualizarCantidad,
    removerItem,
  } = useCarrito();

  const [itemEliminandose, setItemEliminandose] = useState<string | null>(null);

  const manejarEliminar = (productoId: string) => {
    setItemEliminandose(productoId);
    setTimeout(() => {
      removerItem(productoId);
      setItemEliminandose(null);
    }, 200);
  };

  const manejarProcederAlPago = () => {
    // TODO: Verificar autenticación cuando se implemente el módulo de auth
    // const { usuario } = useAuth();
    // if (!usuario) {
    //   router.push('/auth/login?redirect=/checkout');
    // } else {
    //   router.push('/checkout');
    // }

    // Por ahora, redirigir directo al checkout
    onCerrar();
    router.push('/checkout');
  };

  const carritoVacio = items.length === 0;

  return (
    <Sheet open={abierto} onOpenChange={onCerrar}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg bg-white">
        {/* Header */}
        <SheetHeader className="border-b border-zinc-100 pb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-900 p-2.5">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-bold text-zinc-900">
                Tu Carrito
              </SheetTitle>
              <SheetDescription className="sr-only">
                Panel lateral del carrito de compras con {cantidadTotal}{' '}
                {cantidadTotal === 1 ? 'producto' : 'productos'}
              </SheetDescription>
              <p className="text-sm text-zinc-600 font-light mt-0.5">
                {cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Body - Lista de productos */}
        <div className="flex-1 overflow-hidden py-6">
          {carritoVacio ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-6">
              <div className="rounded-full bg-zinc-100 p-6 mb-6">
                <ShoppingBag className="h-12 w-12 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-sm text-zinc-600 font-light mb-8 max-w-sm">
                Agrega productos a tu carrito para continuar con tu compra
              </p>
              <Button
                onClick={() => {
                  onCerrar();
                  router.push('/productos');
                }}
                className="w-full sm:w-auto"
              >
                Ver Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <div
                    key={item.productoId}
                    className={`group relative rounded-lg border border-zinc-100 p-4 transition-all duration-200 ${
                      itemEliminandose === item.productoId
                        ? 'scale-95 opacity-0'
                        : 'scale-100 opacity-100'
                    }`}
                  >
                    {/* Item Content */}
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <Link
                        href={`/productos/${item.slug}`}
                        onClick={onCerrar}
                        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100"
                      >
                        <Image
                          src={item.imagenPrincipal}
                          alt={item.nombre}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="80px"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/productos/${item.slug}`}
                          onClick={onCerrar}
                          className="font-semibold text-zinc-900 hover:text-zinc-700 transition-colors line-clamp-2 mb-1"
                        >
                          {item.nombre}
                        </Link>
                        <p className="text-sm font-medium text-zinc-900 mb-3">
                          {formatCurrency(item.precio)}
                        </p>

                        {/* Controles de cantidad */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                actualizarCantidad(item.productoId, item.cantidad - 1)
                              }
                              disabled={item.cantidad <= 1}
                              className="rounded-md border border-zinc-200 p-1.5 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5 text-zinc-600" />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-semibold text-zinc-900">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() =>
                                actualizarCantidad(item.productoId, item.cantidad + 1)
                              }
                              disabled={item.cantidad >= item.stock}
                              className="rounded-md border border-zinc-200 p-1.5 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5 text-zinc-600" />
                            </button>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => manejarEliminar(item.productoId)}
                            className="rounded-md p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Advertencia de stock bajo */}
                        {item.cantidad >= item.stock && (
                          <p className="text-xs text-amber-600 font-medium mt-2">
                            Stock máximo alcanzado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer - Totales y botón de pago */}
        {!carritoVacio && (
          <SheetFooter className="border-t border-zinc-100 pt-6">
            <div className="w-full space-y-4">
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

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-zinc-900">Total</span>
                  <span className="text-2xl font-bold text-zinc-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Mensaje de envío gratis */}
              {envio === 0 && subtotal >= 500 && (
                <div className="rounded-lg bg-green-50 border border-green-100 p-3">
                  <p className="text-sm font-medium text-green-800 text-center">
                    ✓ ¡Has calificado para envío gratis!
                  </p>
                </div>
              )}

              {/* Botón de checkout */}
              <Button
                onClick={manejarProcederAlPago}
                size="lg"
                className="w-full text-base font-semibold"
              >
                Proceder al Pago
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Link continuar comprando */}
              <button
                onClick={() => {
                  onCerrar();
                  router.push('/productos');
                }}
                className="w-full text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
