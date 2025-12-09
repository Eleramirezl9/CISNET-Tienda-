/**
 * Página de Confirmación de Pedido
 * Confirmación visual después de completar el checkout
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home, Package, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/compartido/ui';
import { obtenerOrden, type OrdenDetalle } from '@/caracteristicas/checkout/acciones/obtener-orden.action';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const numeroOrden = searchParams.get('orden');
  const [orden, setOrden] = useState<OrdenDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarOrden() {
      if (!numeroOrden) {
        setError('Número de orden no proporcionado');
        setLoading(false);
        return;
      }

      const resultado = await obtenerOrden(numeroOrden);

      if (resultado.success && resultado.data) {
        setOrden(resultado.data);
      } else {
        setError(resultado.error || 'Error al cargar la orden');
      }

      setLoading(false);
    }

    cargarOrden();
  }, [numeroOrden]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mx-auto mb-4" />
          <p className="text-zinc-600">Cargando detalles de tu pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-zinc-200 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            Error al cargar el pedido
          </h1>
          <p className="text-zinc-600 mb-8">{error || 'Orden no encontrada'}</p>
          <Link href="/">
            <Button size="lg" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearPrecio = (precio: number) => {
    return `Q${precio.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg border border-zinc-200 p-8">
        {/* Icono de éxito */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-zinc-600 mb-4">
            Tu pedido ha sido recibido y está siendo procesado
          </p>
          <div className="inline-block bg-zinc-100 rounded-lg px-4 py-2">
            <p className="text-sm text-zinc-600 mb-1">Número de orden</p>
            <p className="text-xl font-bold text-zinc-900">{orden.numeroOrden}</p>
          </div>
        </div>

        {/* Detalles del Pedido */}
        <div className="mb-8">
          <h2 className="font-semibold text-zinc-900 mb-4">Detalles del Pedido</h2>

          {/* Productos */}
          <div className="border border-zinc-200 rounded-lg divide-y divide-zinc-200 mb-4">
            {orden.items.map((item) => (
              <div key={item.productoId} className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{item.nombreProducto}</p>
                  <p className="text-sm text-zinc-600">
                    Cantidad: {item.cantidad} × {formatearPrecio(item.precioUnitario)}
                  </p>
                </div>
                <p className="font-semibold text-zinc-900">
                  {formatearPrecio(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>{formatearPrecio(orden.subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Impuestos</span>
              <span>{formatearPrecio(orden.impuestos)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Envío</span>
              <span>{formatearPrecio(orden.envio)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-zinc-900 pt-2 border-t border-zinc-200">
              <span>Total</span>
              <span>{formatearPrecio(orden.total)}</span>
            </div>
          </div>
        </div>

        {/* Información de Envío */}
        <div className="mb-8">
          <h2 className="font-semibold text-zinc-900 mb-4">Información de Envío</h2>
          <div className="bg-zinc-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="text-zinc-900 font-medium">{orden.nombreCompleto}</p>
            <p className="text-zinc-600">{orden.telefono}</p>
            {orden.email && <p className="text-zinc-600">{orden.email}</p>}
            <p className="text-zinc-600">
              {orden.direccion}, {orden.zonaOColonia}
            </p>
            <p className="text-zinc-600">
              {orden.municipio}, {orden.departamento}
            </p>
            {orden.referencia && (
              <p className="text-zinc-600 italic">Referencia: {orden.referencia}</p>
            )}
          </div>
        </div>

        {/* ¿Qué sigue? */}
        <div className="bg-zinc-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-zinc-900 mb-4">¿Qué sigue?</h2>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li className="flex items-start gap-3">
              <Package className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
              <span>
                Recibirás una llamada para confirmar tu pedido en las próximas 2 horas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Package className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
              <span>
                Tu pedido será preparado y despachado dentro de 24-48 horas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Package className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
              <span>
                Recibirás tu pedido en la dirección proporcionada
              </span>
            </li>
          </ul>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-zinc-500 mb-6">
          <p>Fecha del pedido: {formatearFecha(orden.fechaCreacion)}</p>
          <p>Método de pago: {orden.metodoPago.replace(/_/g, ' ')}</p>
          <p>Estado: {orden.estado}</p>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button size="lg" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
          <Link href="/productos" className="block">
            <Button size="lg" variant="outline" className="w-full">
              Seguir Comprando
            </Button>
          </Link>
        </div>

        {/* Nota de contacto */}
        <p className="text-xs text-zinc-500 mt-6 text-center">
          Si tienes alguna pregunta, contáctanos al {orden.telefono}
        </p>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mx-auto mb-4" />
            <p className="text-zinc-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
