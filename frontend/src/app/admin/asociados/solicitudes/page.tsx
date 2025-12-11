'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { asociadosServicio } from '@/asociados/servicios/asociados.servicio';
import type { SolicitudAsociado, EstadoSolicitud } from '@/asociados/tipos/asociado.tipos';

const ESTADOS: { valor: EstadoSolicitud | 'todas'; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'revisando', etiqueta: 'En Revisión' },
  { valor: 'aprobada', etiqueta: 'Aprobadas' },
  { valor: 'rechazada', etiqueta: 'Rechazadas' },
];

const COLORES_ESTADO: Record<EstadoSolicitud, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  revisando: 'bg-blue-100 text-blue-800',
  aprobada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
};

export default function SolicitudesAsociadosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudAsociado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | 'todas'>('todas');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAsociado | null>(null);
  const [actualizando, setActualizando] = useState(false);
  const [notasAdmin, setNotasAdmin] = useState('');

  useEffect(() => {
    if (!estaCargando) {
      if (!estaAutenticado) {
        router.push('/login?returnUrl=/admin/asociados/solicitudes');
      } else if (usuario?.rol !== 'ADMIN') {
        router.push('/');
      } else {
        cargarSolicitudes();
      }
    }
  }, [estaAutenticado, estaCargando, usuario, router]);

  const cargarSolicitudes = async () => {
    try {
      const data = await asociadosServicio.listarSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    } finally {
      setCargando(false);
    }
  };

  const marcarComoLeida = async (solicitud: SolicitudAsociado) => {
    if (solicitud.leida) return;

    try {
      const actualizada = await asociadosServicio.marcarSolicitudLeida(solicitud.id);
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === solicitud.id ? actualizada : s))
      );
      if (solicitudSeleccionada?.id === solicitud.id) {
        setSolicitudSeleccionada(actualizada);
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const abrirDetalle = (solicitud: SolicitudAsociado) => {
    setSolicitudSeleccionada(solicitud);
    setNotasAdmin(solicitud.notasAdmin || '');
    marcarComoLeida(solicitud);
  };

  const actualizarEstado = async (nuevoEstado: EstadoSolicitud) => {
    if (!solicitudSeleccionada) return;

    setActualizando(true);
    try {
      const actualizada = await asociadosServicio.actualizarSolicitud(
        solicitudSeleccionada.id,
        { estado: nuevoEstado, notasAdmin }
      );
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === solicitudSeleccionada.id ? actualizada : s))
      );
      setSolicitudSeleccionada(actualizada);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar la solicitud');
    } finally {
      setActualizando(false);
    }
  };

  const guardarNotas = async () => {
    if (!solicitudSeleccionada) return;

    setActualizando(true);
    try {
      const actualizada = await asociadosServicio.actualizarSolicitud(
        solicitudSeleccionada.id,
        { notasAdmin }
      );
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === solicitudSeleccionada.id ? actualizada : s))
      );
      setSolicitudSeleccionada(actualizada);
    } catch (error) {
      console.error('Error al guardar notas:', error);
      alert('Error al guardar las notas');
    } finally {
      setActualizando(false);
    }
  };

  const solicitudesFiltradas =
    filtroEstado === 'todas'
      ? solicitudes
      : solicitudes.filter((s) => s.estado === filtroEstado);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/asociados"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Asociados
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Solicitudes de Asociación</h1>
          <p className="text-zinc-600 mt-2">
            {solicitudes.filter((s) => !s.leida).length} solicitud(es) sin leer
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {ESTADOS.map((estado) => (
            <button
              key={estado.valor}
              onClick={() => setFiltroEstado(estado.valor)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === estado.valor
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {estado.etiqueta}
              {estado.valor !== 'todas' && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {solicitudes.filter((s) => s.estado === estado.valor).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lista de solicitudes */}
          <div className="space-y-4">
            {solicitudesFiltradas.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-zinc-100">
                <div className="w-16 h-16 bg-zinc-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  No hay solicitudes
                </h3>
                <p className="text-zinc-600">
                  {filtroEstado === 'todas'
                    ? 'Aún no se han recibido solicitudes de asociación'
                    : `No hay solicitudes con estado "${filtroEstado}"`}
                </p>
              </div>
            ) : (
              solicitudesFiltradas.map((solicitud) => (
                <button
                  key={solicitud.id}
                  onClick={() => abrirDetalle(solicitud)}
                  className={`w-full text-left bg-white rounded-xl p-5 border transition-all hover:shadow-md ${
                    solicitudSeleccionada?.id === solicitud.id
                      ? 'border-zinc-900 shadow-md'
                      : 'border-zinc-100'
                  } ${!solicitud.leida ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-900 truncate">
                          {solicitud.nombre}
                        </h3>
                        {!solicitud.leida && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            Nuevo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 truncate">{solicitud.email}</p>
                      {solicitud.empresa && (
                        <p className="text-sm text-zinc-500 truncate">{solicitud.empresa}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          COLORES_ESTADO[solicitud.estado]
                        }`}
                      >
                        {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(solicitud.fechaCreacion).toLocaleDateString('es-GT')}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Detalle de solicitud */}
          <div className="lg:sticky lg:top-8">
            {solicitudSeleccionada ? (
              <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">
                        {solicitudSeleccionada.nombre}
                      </h2>
                      <span
                        className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                          COLORES_ESTADO[solicitudSeleccionada.estado]
                        }`}
                      >
                        {solicitudSeleccionada.estado.charAt(0).toUpperCase() +
                          solicitudSeleccionada.estado.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSolicitudSeleccionada(null)}
                      className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Mail className="w-5 h-5 text-zinc-400" />
                    <a
                      href={`mailto:${solicitudSeleccionada.email}`}
                      className="hover:text-zinc-900 transition-colors"
                    >
                      {solicitudSeleccionada.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-600">
                    <Phone className="w-5 h-5 text-zinc-400" />
                    <a
                      href={`tel:${solicitudSeleccionada.telefono}`}
                      className="hover:text-zinc-900 transition-colors"
                    >
                      {solicitudSeleccionada.telefono}
                    </a>
                  </div>

                  {solicitudSeleccionada.empresa && (
                    <div className="flex items-center gap-3 text-zinc-600">
                      <Building2 className="w-5 h-5 text-zinc-400" />
                      <span>{solicitudSeleccionada.empresa}</span>
                    </div>
                  )}

                  {solicitudSeleccionada.cargo && (
                    <div className="flex items-center gap-3 text-zinc-600">
                      <Briefcase className="w-5 h-5 text-zinc-400" />
                      <span>{solicitudSeleccionada.cargo}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-zinc-600">
                    <Clock className="w-5 h-5 text-zinc-400" />
                    <span className="text-sm">
                      {formatearFecha(solicitudSeleccionada.fechaCreacion)}
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-zinc-100 bg-zinc-50">
                  <h3 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensaje
                  </h3>
                  <p className="text-zinc-600 whitespace-pre-wrap">
                    {solicitudSeleccionada.mensaje}
                  </p>
                </div>

                <div className="p-6 border-t border-zinc-100">
                  <h3 className="text-sm font-semibold text-zinc-700 mb-2">
                    Notas del Administrador
                  </h3>
                  <textarea
                    value={notasAdmin}
                    onChange={(e) => setNotasAdmin(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all resize-none text-sm"
                    placeholder="Añade notas internas sobre esta solicitud..."
                  />
                  <button
                    onClick={guardarNotas}
                    disabled={actualizando}
                    className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
                  >
                    Guardar notas
                  </button>
                </div>

                <div className="p-6 border-t border-zinc-100 bg-zinc-50">
                  <h3 className="text-sm font-semibold text-zinc-700 mb-4">
                    Cambiar Estado
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => actualizarEstado('revisando')}
                      disabled={
                        actualizando || solicitudSeleccionada.estado === 'revisando'
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-800 rounded-xl font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      En Revisión
                    </button>
                    <button
                      onClick={() => actualizarEstado('pendiente')}
                      disabled={
                        actualizando || solicitudSeleccionada.estado === 'pendiente'
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 text-amber-800 rounded-xl font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Pendiente
                    </button>
                    <button
                      onClick={() => actualizarEstado('aprobada')}
                      disabled={
                        actualizando || solicitudSeleccionada.estado === 'aprobada'
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 text-green-800 rounded-xl font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => actualizarEstado('rechazada')}
                      disabled={
                        actualizando || solicitudSeleccionada.estado === 'rechazada'
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-800 rounded-xl font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-zinc-100">
                <div className="w-16 h-16 bg-zinc-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Selecciona una solicitud
                </h3>
                <p className="text-zinc-600">
                  Haz clic en una solicitud para ver sus detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
