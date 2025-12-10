/**
 * Página de Detalle de Orden - Admin
 * Vista completa de una orden específica para administradores
 */

'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button, Select, Label } from '@/compartido/ui';
import { obtenerOrden, type OrdenDetalle, actualizarEstadoOrden, type EstadoOrden } from '@/caracteristicas/checkout';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ numeroOrden: string }>;
}

export default function DetalleOrdenAdminPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [orden, setOrden] = useState<OrdenDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  useEffect(() => {
    cargarOrden();
  }, [resolvedParams.numeroOrden]);

  async function cargarOrden() {
    try {
      setLoading(true);
      const resultado = await obtenerOrden(resolvedParams.numeroOrden);

      if (resultado.success && resultado.data) {
        setOrden(resultado.data);
        setError(null);
      } else {
        setError(resultado.error || 'Error al cargar la orden');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar la orden';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado(nuevoEstado: EstadoOrden) {
    if (!orden || nuevoEstado === orden.estado) return;

    setActualizandoEstado(true);

    const resultado = await actualizarEstadoOrden({
      numeroOrden: orden.numeroOrden,
      estado: nuevoEstado,
    });

    if (resultado.success) {
      toast.success('Estado actualizado', {
        description: `La orden ha sido marcada como "${nuevoEstado}"`,
      });
      // Recargar la orden para obtener los datos actualizados
      await cargarOrden();
    } else {
      toast.error('Error al actualizar', {
        description: resultado.error || 'No se pudo actualizar el estado de la orden',
      });
    }

    setActualizandoEstado(false);
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

  const obtenerColorEstado = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmada: 'bg-blue-100 text-blue-800 border-blue-200',
      en_proceso: 'bg-purple-100 text-purple-800 border-purple-200',
      enviada: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      entregada: 'bg-green-100 text-green-800 border-green-200',
      cancelada: 'bg-red-100 text-red-800 border-red-200',
    };
    return colores[estado] || 'bg-zinc-100 text-zinc-800 border-zinc-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mx-auto mb-4" />
          <p className="text-zinc-600">Cargando orden...</p>
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
            Error al cargar orden
          </h1>
          <p className="text-zinc-600 mb-8">{error || 'Orden no encontrada'}</p>
          <Link href="/admin/ordenes">
            <Button size="lg" className="w-full">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Listado
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/admin/ordenes"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                {orden.numeroOrden}
              </h1>
              <p className="text-zinc-600">
                Creada el {formatearFecha(orden.fechaCreacion)}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg border ${obtenerColorEstado(orden.estado)}`}
            >
              <span className="font-semibold">{orden.estado}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actualizar Estado */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            Gestionar Estado de la Orden
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="estado">Estado Actual</Label>
              <Select
                value={orden.estado}
                onValueChange={(value) => cambiarEstado(value as EstadoOrden)}
                disabled={actualizandoEstado || orden.estado === 'cancelada'}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_proceso">En Proceso</option>
                <option value="enviada">Enviada</option>
                <option value="entregada">Entregada</option>
                <option value="cancelada">Cancelada</option>
              </Select>
              {orden.estado === 'cancelada' && (
                <p className="text-sm text-zinc-600 mt-2">
                  Las órdenes canceladas no pueden cambiar de estado
                </p>
              )}
            </div>
            {actualizandoEstado && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Actualizando...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Detalles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Productos
              </h2>
              <div className="space-y-4">
                {orden.items.map((item) => (
                  <div
                    key={item.productoId}
                    className="flex justify-between items-center py-3 border-b border-zinc-200 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900">
                        {item.nombreProducto}
                      </p>
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
                  <span>Impuestos (IVA 12%)</span>
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

            {/* Notas */}
            {orden.notas && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  Notas del Cliente
                </h2>
                <p className="text-zinc-700 whitespace-pre-wrap">{orden.notas}</p>
              </div>
            )}
          </div>

          {/* Columna Derecha - Información */}
          <div className="space-y-6">
            {/* Cliente */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Cliente
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-zinc-600 mb-1">Nombre</p>
                  <p className="font-medium text-zinc-900">{orden.nombreCompleto}</p>
                </div>
                <div>
                  <p className="text-zinc-600 mb-1">Teléfono</p>
                  <p className="font-medium text-zinc-900">
                    <a
                      href={`tel:${orden.telefono}`}
                      className="hover:underline"
                    >
                      {orden.telefono}
                    </a>
                  </p>
                </div>
                {orden.email && (
                  <div>
                    <p className="text-zinc-600 mb-1">Email</p>
                    <p className="font-medium text-zinc-900">
                      <a
                        href={`mailto:${orden.email}`}
                        className="hover:underline break-all"
                      >
                        {orden.email}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección de Envío
              </h2>
              <div className="space-y-2 text-sm text-zinc-700">
                <p>{orden.direccion}</p>
                <p>{orden.zonaOColonia}</p>
                <p>
                  {orden.municipio}, {orden.departamento}
                </p>
                {orden.referencia && (
                  <p className="text-zinc-600 italic mt-3">
                    Referencia: {orden.referencia}
                  </p>
                )}
              </div>
            </div>

            {/* Método de Pago */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Método de Pago
              </h2>
              <p className="text-sm font-medium text-zinc-900">
                {orden.metodoPago.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Información Adicional */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Información Adicional
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-zinc-600">Fecha de creación</p>
                  <p className="font-medium text-zinc-900">
                    {formatearFecha(orden.fechaCreacion)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-600">Última actualización</p>
                  <p className="font-medium text-zinc-900">
                    {formatearFecha(orden.fechaActualizacion)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-600">ID de orden</p>
                  <p className="font-mono text-xs text-zinc-700 break-all">
                    {orden.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
