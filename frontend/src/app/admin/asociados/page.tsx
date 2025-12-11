'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Users, Mail, Star, StarOff } from 'lucide-react';
import { asociadosServicio } from '@/asociados/servicios/asociados.servicio';
import type { Asociado, EstadisticasAsociados } from '@/asociados/tipos/asociado.tipos';

export default function AdminAsociadosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const [asociados, setAsociados] = useState<Asociado[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAsociados | null>(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    if (!estaCargando) {
      if (!estaAutenticado) {
        router.push('/login?returnUrl=/admin/asociados');
      } else if (usuario?.rol?.toUpperCase() !== 'ADMIN') {
        router.push('/');
      } else {
        cargarDatos();
      }
    }
  }, [estaAutenticado, estaCargando, usuario, router]);

  const cargarDatos = async () => {
    try {
      const [asociadosData, estadisticasData] = await Promise.all([
        asociadosServicio.listarTodos(),
        asociadosServicio.obtenerEstadisticas(),
      ]);
      setAsociados(asociadosData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarAsociado = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este asociado?')) return;

    setEliminando(id);
    try {
      await asociadosServicio.eliminarAsociado(id);
      setAsociados(asociados.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error al eliminar asociado:', error);
      alert('Error al eliminar el asociado');
    } finally {
      setEliminando(null);
    }
  };

  const toggleDestacado = async (asociado: Asociado) => {
    setActualizando(asociado.id);
    try {
      const actualizado = await asociadosServicio.actualizarAsociado(asociado.id, {
        destacado: !asociado.destacado,
      });
      setAsociados(asociados.map((a) => (a.id === asociado.id ? actualizado : a)));
    } catch (error) {
      console.error('Error al actualizar asociado:', error);
      alert('Error al actualizar el asociado');
    } finally {
      setActualizando(null);
    }
  };

  const toggleActivo = async (asociado: Asociado) => {
    setActualizando(asociado.id);
    try {
      const actualizado = await asociadosServicio.actualizarAsociado(asociado.id, {
        activo: !asociado.activo,
      });
      setAsociados(asociados.map((a) => (a.id === asociado.id ? actualizado : a)));
    } catch (error) {
      console.error('Error al actualizar asociado:', error);
      alert('Error al actualizar el asociado');
    } finally {
      setActualizando(null);
    }
  };

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Cargando asociados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Gestión de Asociados</h1>
            <p className="text-zinc-600 mt-2">
              {asociados.length} asociado(s) en total
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/asociados/solicitudes"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 rounded-lg font-medium border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Solicitudes
              {estadisticas && estadisticas.solicitudesPendientes > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {estadisticas.solicitudesPendientes}
                </span>
              )}
            </Link>
            <Link
              href="/admin/asociados/nuevo"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Asociado
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-zinc-700" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Asociados</p>
                <p className="text-2xl font-bold text-zinc-900">{estadisticas?.totalAsociados || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Destacados</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {asociados.filter((a) => a.destacado).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {estadisticas?.solicitudesPendientes || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de asociados */}
        {asociados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              No hay asociados
            </h3>
            <p className="text-zinc-600 mb-6">
              Comienza agregando tu primer asociado
            </p>
            <Link
              href="/admin/asociados/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Asociado
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-zinc-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Asociado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Cargo / Empresa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Destacado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-100">
                  {asociados.map((asociado) => (
                    <tr key={asociado.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 h-12 w-12 relative rounded-full overflow-hidden bg-zinc-100">
                            {asociado.foto ? (
                              <Image
                                src={asociado.foto}
                                alt={asociado.nombre}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <Users className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">
                              {asociado.nombre}
                            </div>
                            <div className="text-sm text-zinc-500">
                              Orden: {asociado.orden}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-900">{asociado.cargo}</div>
                        {asociado.empresa && (
                          <div className="text-sm text-zinc-500">{asociado.empresa}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActivo(asociado)}
                          disabled={actualizando === asociado.id}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            asociado.activo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          } ${actualizando === asociado.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {asociado.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleDestacado(asociado)}
                          disabled={actualizando === asociado.id}
                          className={`p-2 rounded-lg transition-colors ${
                            asociado.destacado
                              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                              : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                          } ${actualizando === asociado.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={asociado.destacado ? 'Quitar destacado' : 'Marcar como destacado'}
                        >
                          {asociado.destacado ? (
                            <Star className="w-5 h-5 fill-current" />
                          ) : (
                            <StarOff className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/asociados`}
                            className="text-zinc-600 hover:text-zinc-900 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                            title="Ver en página pública"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/asociados/${asociado.id}/editar`}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => eliminarAsociado(asociado.id)}
                            disabled={eliminando === asociado.id}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
