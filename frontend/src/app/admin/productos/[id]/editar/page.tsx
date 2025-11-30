'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/compartido/componentes/ImageUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarProductoPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productoId, setProductoId] = useState<string>('');

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
    imagenActual: '',
  });

  const [imagenNueva, setImagenNueva] = useState<File | null>(null);

  // Cargar datos del producto
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const resolvedParams = await params;
        setProductoId(resolvedParams.id);

        const response = await fetch(
          `http://localhost:3001/api/productos/${resolvedParams.id}`
        );

        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }

        const producto = await response.json();

        setFormData({
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: producto.precio?.toString() || '',
          precioAnterior: producto.precioAnterior?.toString() || '',
          stock: producto.stock?.toString() || '',
          categoria: producto.categoria || '',
          categoriaId: producto.categoriaId || '',
          etiquetas: Array.isArray(producto.etiquetas)
            ? producto.etiquetas.join(', ')
            : '',
          destacado: producto.destacado || false,
          imagenActual: producto.imagenPrincipal || '',
        });
      } catch (err: any) {
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setLoadingData(false);
      }
    };

    cargarProducto();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear FormData para enviar archivo
      const data = new FormData();

      // Agregar imagen nueva si existe
      if (imagenNueva) {
        data.append('imagen', imagenNueva);
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
      const response = await fetch(
        `http://localhost:3001/api/productos/${productoId}`,
        {
          method: 'PUT',
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      // Redirigir a la lista de productos
      router.push('/admin/productos');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-zinc-400 mx-auto mb-4" />
          <p className="text-zinc-600">Cargando producto...</p>
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
            href="/admin/productos"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a productos
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Editar Producto</h1>
          <p className="text-zinc-600 mt-2">
            Actualiza la información del producto
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

            {/* Imagen actual */}
            {formData.imagenActual && !imagenNueva && (
              <div className="mb-4">
                <p className="text-sm text-zinc-600 mb-2">Imagen actual:</p>
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-zinc-200">
                  <Image
                    src={formData.imagenActual}
                    alt={formData.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-zinc-600 mb-2">
                {formData.imagenActual
                  ? 'Subir nueva imagen (opcional):'
                  : 'Agregar imagen:'}
              </p>
              <ImageUpload
                value={undefined}
                onChange={setImagenNueva}
                disabled={loading}
              />
            </div>
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
            <h2 className="text-lg font-semibold text-zinc-900">
              Categorización
            </h2>

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
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
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
