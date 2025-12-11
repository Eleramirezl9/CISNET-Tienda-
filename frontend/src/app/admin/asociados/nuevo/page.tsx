'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { ImageUpload } from '@/compartido/componentes/ImageUpload';
import { asociadosServicio } from '@/asociados/servicios/asociados.servicio';
import type { CrearAsociadoDto } from '@/asociados/tipos/asociado.tipos';

export default function NuevoAsociadoPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [formulario, setFormulario] = useState<CrearAsociadoDto>({
    nombre: '',
    cargo: '',
    empresa: '',
    descripcion: '',
    linkedin: '',
    twitter: '',
    sitioWeb: '',
    orden: 0,
    activo: true,
    destacado: false,
  });

  useEffect(() => {
    if (!estaCargando) {
      if (!estaAutenticado) {
        router.push('/login?returnUrl=/admin/asociados/nuevo');
      } else if (usuario?.rol !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [estaAutenticado, estaCargando, usuario, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      await asociadosServicio.crearAsociado(formulario, fotoFile || undefined);
      router.push('/admin/asociados');
    } catch (err) {
      setError('Error al crear el asociado. Por favor intenta de nuevo.');
      console.error('Error al crear asociado:', err);
    } finally {
      setGuardando(false);
    }
  };

  if (estaCargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/asociados"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Asociados
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Nuevo Asociado</h1>
          <p className="text-zinc-600 mt-2">
            Completa la información del nuevo asociado
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900 mb-6">
              Información Personal
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Foto del Asociado
                </label>
                <div className="max-w-xs">
                  <ImageUpload
                    onChange={setFotoFile}
                    disabled={guardando}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label
                  htmlFor="cargo"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Cargo *
                </label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={formulario.cargo}
                  onChange={handleChange}
                  required
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                  placeholder="Ej: CEO, Director, Desarrollador"
                />
              </div>

              <div>
                <label
                  htmlFor="empresa"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Empresa
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formulario.empresa}
                  onChange={handleChange}
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div>
                <label
                  htmlFor="orden"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Orden de Aparición
                </label>
                <input
                  type="number"
                  id="orden"
                  name="orden"
                  value={formulario.orden}
                  onChange={handleChange}
                  min="0"
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  rows={3}
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all resize-none disabled:bg-zinc-100"
                  placeholder="Breve descripción del asociado..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900 mb-6">
              Redes Sociales
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formulario.linkedin}
                  onChange={handleChange}
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Twitter / X
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formulario.twitter}
                  onChange={handleChange}
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                  placeholder="https://x.com/..."
                />
              </div>

              <div>
                <label
                  htmlFor="sitioWeb"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Sitio Web
                </label>
                <input
                  type="url"
                  id="sitioWeb"
                  name="sitioWeb"
                  value={formulario.sitioWeb}
                  onChange={handleChange}
                  disabled={guardando}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all disabled:bg-zinc-100"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900 mb-6">
              Configuración
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formulario.activo}
                  onChange={handleCheckbox}
                  disabled={guardando}
                  className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <div>
                  <span className="text-sm font-medium text-zinc-900">Activo</span>
                  <p className="text-xs text-zinc-500">
                    El asociado será visible en la página pública
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formulario.destacado}
                  onChange={handleCheckbox}
                  disabled={guardando}
                  className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <div>
                  <span className="text-sm font-medium text-zinc-900">Destacado</span>
                  <p className="text-xs text-zinc-500">
                    Aparecerá en la sección de asociados destacados
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/asociados"
              className="px-6 py-3 text-zinc-700 bg-white border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
            >
              {guardando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Asociado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
