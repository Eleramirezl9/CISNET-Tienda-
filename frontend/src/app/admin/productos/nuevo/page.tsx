'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/compartido/componentes/ImageUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precioAnterior: '',
    stock: '',
    categoria: '',
    categoriaId: '',
    etiquetas: '',
    destacado: false,
  });

  const [imagen, setImagen] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear FormData para enviar archivo
      const data = new FormData();

      // Agregar imagen si existe
      if (imagen) {
        data.append('imagen', imagen);
      }

      // Agregar campos del formulario
      data.append('nombre', formData.nombre);
      data.append('descripcion', formData.descripcion);
      data.append('precio', formData.precio);
      if (formData.precioAnterior) {
        data.append('precioAnterior', formData.precioAnterior);
      }
      data.append('stock', formData.stock);
      data.append('categoria', formData.categoria);
      data.append('categoriaId', formData.categoriaId);
      data.append('destacado', formData.destacado.toString());

      // Etiquetas (convertir string separado por comas a array)
      if (formData.etiquetas) {
        const etiquetasArray = formData.etiquetas
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t);
        data.append('etiquetas', JSON.stringify(etiquetasArray));
      }

      // Enviar al backend
      const response = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        body: data,
        // No establecer Content-Type, el navegador lo hará automáticamente con el boundary correcto
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear producto');
      }

      // Redirigir a la lista de productos
      router.push('/admin/productos');
    } catch (err: any) {
      setError(err.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/productos"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a productos
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Nuevo Producto</h1>
          <p className="text-zinc-600 mt-2">
            Crea un nuevo producto con imagen optimizada
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Imagen */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Imagen del Producto
            </h2>
            <ImageUpload value={undefined} onChange={setImagen} disabled={loading} />
          </div>

          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Información Básica
            </h2>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                placeholder="Ej: Laptop Dell XPS 15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                placeholder="Describe el producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                  placeholder="99.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Precio Anterior (Opcional)
                </label>
                <input
                  type="number"
                  name="precioAnterior"
                  value={formData.precioAnterior}
                  onChange={handleChange}
                  disabled={loading}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                  placeholder="129.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                disabled={loading}
                min="0"
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                placeholder="10"
              />
            </div>
          </div>

          {/* Categorización */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900">Categorización</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Categoría *
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                  placeholder="Electrónica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  ID Categoría *
                </label>
                <input
                  type="text"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                  placeholder="electronica"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Etiquetas (separadas por comas)
              </label>
              <input
                type="text"
                name="etiquetas"
                value={formData.etiquetas}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                placeholder="nuevo, oferta, destacado"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="destacado"
                checked={formData.destacado}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-500"
              />
              <label className="ml-2 text-sm text-zinc-900">
                Producto destacado
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !imagen}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando producto...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Crear Producto
                </>
              )}
            </button>

            <Link
              href="/admin/productos"
              className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
