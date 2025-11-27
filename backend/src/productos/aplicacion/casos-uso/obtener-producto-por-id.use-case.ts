/**
 * USE CASE - Obtener Producto por ID
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import {
  IProductoRepositorio,
  PRODUCTO_REPOSITORIO,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';

@Injectable()
export class ObtenerProductoPorIdUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: IProductoRepositorio,
  ) {}

  async ejecutar(id: string): Promise<Producto> {
    const producto = await this.productoRepositorio.buscarPorId(id);

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }
}
