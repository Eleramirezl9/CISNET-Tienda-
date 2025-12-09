/**
 * Dashboard de Administración - Órdenes
 * Página para visualizar y gestionar todas las órdenes
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Eye, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/compartido/ui';

interface ItemOrden {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Orden {
  id: string;
  numeroOrden: string;
  estado: string;
  metodoPago: string;
  nombreCompleto: string;
  telefono: string;
  email?: string;
  total: number;
  fechaCreacion: string;
  items: ItemOrden[];
}

interface ResultadoListarOrdenes {
  ordenes: Orden[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export default function AdminOrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 20;

  useEffect(() => {
    cargarOrdenes();
  }, [pagina]);

  async function cargarOrdenes() {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ordenes?pagina=${pagina}&limite=${limite}`,
      );

      if (!response.ok) {
        throw new Error('Error al cargar las órdenes');
      }

      const data: ResultadoListarOrdenes = await response.json();
      setOrdenes(data.ordenes);
      setTotalPaginas(data.totalPaginas);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
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
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-blue-100 text-blue-800',
      en_proceso: 'bg-purple-100 text-purple-800',
      enviada: 'bg-indigo-100 text-indigo-800',
      entregada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return colores[estado] || 'bg-zinc-100 text-zinc-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mx-auto mb-4" />
          <p className="text-zinc-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-zinc-200 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Error</h1>
          <p className="text-zinc-600 mb-8">{error}</p>
          <Button onClick={() => cargarOrdenes()} size="lg" className="w-full">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                Gestión de Órdenes
              </h1>
              <p className="text-zinc-600">
                {total} {total === 1 ? 'orden' : 'órdenes'} en total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ordenes.length === 0 ? (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
            <Package className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">
              No hay órdenes
            </h2>
            <p className="text-zinc-600">
              Aún no se han realizado órdenes en el sistema
            </p>
          </div>
        ) : (
          <>
            {/* Tabla de Órdenes */}
            <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Número de Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {ordenes.map((orden) => (
                      <tr key={orden.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-zinc-900">
                            {orden.numeroOrden}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {orden.items.length} {orden.items.length === 1 ? 'producto' : 'productos'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-zinc-900">
                            {orden.nombreCompleto}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {orden.telefono}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerColorEstado(orden.estado)}`}
                          >
                            {orden.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-900">
                          {formatearPrecio(orden.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                          {formatearFecha(orden.fechaCreacion)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/admin/ordenes/${orden.numeroOrden}`}
                            className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-zinc-600">
                  Página {pagina} de {totalPaginas}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
