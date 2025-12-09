/**
 * Página de Rastreo de Orden
 * Permite a los clientes rastrear el estado de su orden
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, CheckCircle, Truck, Home, ArrowLeft, Loader2 } from 'lucide-react';
import { Button, Input, Label } from '@/compartido/ui';
import { obtenerOrden, type OrdenDetalle } from '@/caracteristicas/checkout';

export default function RastrearOrdenPage() {
  const [numeroOrden, setNumeroOrden] = useState('');
  const [orden, setOrden] = useState<OrdenDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  const buscarOrden = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroOrden.trim()) {
      setError('Por favor ingresa un número de orden');
      return;
    }

    setLoading(true);
    setError(null);
    setBuscado(true);

    const resultado = await obtenerOrden(numeroOrden.trim());

    if (resultado.success && resultado.data) {
      setOrden(resultado.data);
      setError(null);
    } else {
      setOrden(null);
      setError(resultado.error || 'Orden no encontrada');
    }

    setLoading(false);
  };

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

  const obtenerEstadoInfo = (estado: string) => {
    const estados: Record<string, { label: string; color: string; icon: any }> = {
      pendiente: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Package,
      },
      confirmada: {
        label: 'Confirmada',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
      },
      en_proceso: {
        label: 'En Proceso',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Package,
      },
      enviada: {
        label: 'Enviada',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        icon: Truck,
      },
      entregada: {
        label: 'Entregada',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
      },
      cancelada: {
        label: 'Cancelada',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: Package,
      },
    };

    return estados[estado] || estados.pendiente;
  };

  const obtenerTimelineEstados = () => {
    const todosLosEstados = [
      { key: 'pendiente', label: 'Pedido Recibido' },
      { key: 'confirmada', label: 'Confirmado' },
      { key: 'en_proceso', label: 'En Preparación' },
      { key: 'enviada', label: 'En Camino' },
      { key: 'entregada', label: 'Entregado' },
    ];

    const estadoActual = orden?.estado || 'pendiente';
    const indiceActual = todosLosEstados.findIndex(e => e.key === estadoActual);

    return todosLosEstados.map((estado, index) => ({
      ...estado,
      completado: index <= indiceActual,
      activo: index === indiceActual,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Rastrear Orden</h1>
          <p className="mt-2 text-zinc-600">
            Ingresa tu número de orden para ver el estado de tu pedido
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8">
          <form onSubmit={buscarOrden} className="space-y-4">
            <div>
              <Label htmlFor="numeroOrden">Número de Orden</Label>
              <div className="mt-2 flex gap-3">
                <Input
                  id="numeroOrden"
                  type="text"
                  placeholder="Ej: ORD-2025-00001"
                  value={numeroOrden}
                  onChange={(e) => setNumeroOrden(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Buscar
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && buscado && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Orden no encontrada</h3>
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Verifica que el número de orden sea correcto. Lo puedes encontrar en el email de confirmación.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {orden && (
          <div className="space-y-6">
            {/* Header de la orden */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">{orden.numeroOrden}</h2>
                  <p className="text-sm text-zinc-600 mt-1">
                    Pedido realizado el {formatearFecha(orden.fechaCreacion)}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg border ${obtenerEstadoInfo(orden.estado).color}`}
                >
                  <span className="font-semibold">
                    {obtenerEstadoInfo(orden.estado).label}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline de estados */}
            {orden.estado !== 'cancelada' && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h3 className="font-semibold text-zinc-900 mb-6">Estado del Pedido</h3>
                <div className="relative">
                  {/* Línea de conexión */}
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-200" />

                  {/* Estados */}
                  <div className="space-y-6">
                    {obtenerTimelineEstados().map((estado, index) => (
                      <div key={estado.key} className="relative flex items-start gap-4">
                        {/* Círculo del estado */}
                        <div
                          className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                            estado.completado
                              ? 'bg-green-100 border-green-600'
                              : 'bg-zinc-100 border-zinc-300'
                          }`}
                        >
                          <CheckCircle
                            className={`w-6 h-6 ${
                              estado.completado ? 'text-green-600' : 'text-zinc-400'
                            }`}
                          />
                        </div>

                        {/* Información del estado */}
                        <div className="flex-1 pt-2">
                          <p
                            className={`font-medium ${
                              estado.completado ? 'text-zinc-900' : 'text-zinc-500'
                            }`}
                          >
                            {estado.label}
                          </p>
                          {estado.activo && (
                            <p className="text-sm text-zinc-600 mt-1">
                              Tu pedido se encuentra en este estado actualmente
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Productos */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Productos</h3>
              <div className="space-y-4">
                {orden.items.map((item) => (
                  <div
                    key={item.productoId}
                    className="flex justify-between items-center py-3 border-b border-zinc-200 last:border-0"
                  >
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
              <div className="mt-6 pt-4 border-t border-zinc-200 space-y-2">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal</span>
                  <span>{formatearPrecio(orden.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Impuestos</span>
                  <span>{formatearPrecio(orden.impuestos)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Envío</span>
                  <span>{formatearPrecio(orden.envio)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span>{formatearPrecio(orden.total)}</span>
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Información de Envío</h3>
              <div className="space-y-2 text-sm">
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

            {/* Acciones */}
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Volver al Inicio
                </Button>
              </Link>
              <Link href="/productos" className="flex-1">
                <Button className="w-full">Seguir Comprando</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
