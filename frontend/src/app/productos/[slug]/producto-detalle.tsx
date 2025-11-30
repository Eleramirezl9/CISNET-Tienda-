/**
 * ProductoDetalle - Client Component
 * Vista detallada del producto con galería de imágenes
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCarrito } from '@/caracteristicas/carrito-compras';
import { formatCurrency } from '@/compartido/lib/formatters';
import type { Producto } from '@/caracteristicas/catalogo-productos';
import { ShoppingCart, Check, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductoDetalleProps {
  producto: Producto;
}

export function ProductoDetalle({ producto }: ProductoDetalleProps) {
  const { agregarItem } = useCarrito();
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [agregado, setAgregado] = useState(false);

  // Crear array de imágenes (principal + galería si existe)
  const imagenes = producto.imagenes && producto.imagenes.length > 0
    ? [producto.imagenPrincipal, ...producto.imagenes]
    : [producto.imagenPrincipal];

  const tieneDescuento = producto.precioAnterior && producto.precioAnterior > producto.precio;
  const porcentajeDescuento = tieneDescuento
    ? Math.round(((producto.precioAnterior! - producto.precio) / producto.precioAnterior!) * 100)
    : 0;

  const sinStock = producto.stock <= 0;

  const handleAgregarCarrito = () => {
    agregarItem(
      producto.id,
      producto.nombre,
      producto.slug,
      producto.precio,
      producto.imagenPrincipal,
      producto.stock
    );
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Botón de volver */}
      <Link
        href="/productos"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Galería de Imágenes */}
        <div className="space-y-4">
          {/* Imagen principal */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={imagenes[imagenSeleccionada]}
              alt={`${producto.nombre} - Imagen ${imagenSeleccionada + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {tieneDescuento && !sinStock && (
              <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1 px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-lg">
                -{porcentajeDescuento}% OFF
              </div>
            )}
            {sinStock && (
              <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1 px-4 py-2 bg-zinc-600 text-white text-sm font-bold rounded-lg">
                Agotado
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {imagenes.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {imagenes.map((imagen, index) => (
                <button
                  key={index}
                  onClick={() => setImagenSeleccionada(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-zinc-100 transition-all ${
                    imagenSeleccionada === index
                      ? 'ring-2 ring-zinc-900 ring-offset-2'
                      : 'hover:opacity-75'
                  }`}
                >
                  <Image
                    src={imagen}
                    alt={`${producto.nombre} - Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del Producto */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              {producto.categoria}
            </p>
            <h1 className="text-4xl font-bold text-zinc-900 leading-tight mb-4">
              {producto.nombre}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-600 font-medium">5.0 (124 reseñas)</span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-zinc-900">
                {formatCurrency(producto.precio)}
              </span>
              {tieneDescuento && (
                <span className="text-xl font-medium text-zinc-400 line-through">
                  {formatCurrency(producto.precioAnterior!)}
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="border-t border-zinc-100 pt-8">
            <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4">
              Descripción
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed">
              {producto.descripcion}
            </p>
          </div>

          {/* Características */}
          {producto.caracteristicas && Object.keys(producto.caracteristicas).length > 0 && (
            <div className="border-t border-zinc-100 pt-8">
              <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4">
                Características
              </h2>
              <ul className="space-y-3">
                {Object.entries(producto.caracteristicas).map(([key, value]) => (
                  <li key={key} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-zinc-900">{key}:</span>{' '}
                      <span className="text-zinc-600">{value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Etiquetas */}
          {producto.etiquetas && producto.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {producto.etiquetas.map((etiqueta) => (
                <span
                  key={etiqueta}
                  className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg"
                >
                  {etiqueta}
                </span>
              ))}
            </div>
          )}

          {/* Stock */}
          {!sinStock && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-zinc-900">
                {producto.stock > 10 ? 'En stock' : `Solo ${producto.stock} disponibles`}
              </span>
            </div>
          )}

          {/* Botón de agregar al carrito */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleAgregarCarrito}
              disabled={sinStock}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-4 px-6 text-base font-semibold transition-all duration-200 ${
                sinStock
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : agregado
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-lg active:scale-95'
              }`}
            >
              {sinStock ? (
                'Sin stock'
              ) : agregado ? (
                <>
                  <Check className="w-5 h-5" />
                  Agregado al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>

          {/* Beneficios */}
          <div className="border-t border-zinc-100 pt-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-lg">
                <Truck className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm mb-1">
                  Envío gratis
                </h3>
                <p className="text-sm text-zinc-600">
                  En pedidos superiores a $100.000
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-lg">
                <Shield className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm mb-1">
                  Garantía de calidad
                </h3>
                <p className="text-sm text-zinc-600">
                  30 días de garantía en todos los productos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
