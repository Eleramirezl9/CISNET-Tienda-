'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/compartido/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  slug: string;
  precio: number;
  precioAnterior?: number;
  stock: number;
  imagenPrincipal: string;
  categoria: string;
  activo: boolean;
  destacado: boolean;
}

export default function AdminProductosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    if (!estaCargando) {
      if (!estaAutenticado) {
        router.push('/login?returnUrl=/admin/productos');
      } else if (usuario?.rol !== 'ADMIN') {
        router.push('/');
      } else {
        cargarProductos();
      }
    }
  }, [estaAutenticado, estaCargando, usuario, router]);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data.productos || []);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    setEliminando(id);
    try {
      const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProductos(productos.filter((p) => p.id !== id));
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    } finally {
      setEliminando(null);
    }
  };

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Gestión de Productos
            </h1>
            <p className="text-zinc-600 mt-2">
              {productos.length} producto(s) en total
            </p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        </div>

        {/* Lista de productos */}
        {productos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              No hay productos
            </h3>
            <p className="text-zinc-600 mb-6">
              Comienza creando tu primer producto
            </p>
            <Link
              href="/admin/productos/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Producto
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-lg overflow-hidden bg-zinc-100">
                          <Image
                            src={producto.imagenPrincipal}
                            alt={producto.nombre}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zinc-900">
                            {producto.nombre}
                          </div>
                          <div className="text-sm text-zinc-500 max-w-xs truncate">
                            {producto.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-zinc-100 text-zinc-800 rounded">
                        {producto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-900">
                        Q{producto.precio.toFixed(2)}
                      </div>
                      {producto.precioAnterior && (
                        <div className="text-xs text-zinc-500 line-through">
                          Q{producto.precioAnterior.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          producto.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {producto.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded inline-flex items-center justify-center ${
                            producto.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        {producto.destacado && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded inline-flex items-center justify-center">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/productos/${producto.slug}`}
                          className="text-zinc-600 hover:text-zinc-900 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                          title="Ver producto"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/productos/${producto.id}/editar`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          disabled={eliminando === producto.id}
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
        )}
      </div>
    </div>
  );
}
