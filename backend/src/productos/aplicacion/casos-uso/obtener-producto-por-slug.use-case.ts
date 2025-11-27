/**
 * USE CASE - Obtener Producto por Slug
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import {
  IProductoRepositorio,
  PRODUCTO_REPOSITORIO,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';

@Injectable()
export class ObtenerProductoPorSlugUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: IProductoRepositorio,
  ) {}

  async ejecutar(slug: string): Promise<Producto> {
    const producto = await this.productoRepositorio.buscarPorSlug(slug);

    if (!producto) {
      throw new NotFoundException(`Producto con slug "${slug}" no encontrado`);
    }

    return producto;
  }
}
