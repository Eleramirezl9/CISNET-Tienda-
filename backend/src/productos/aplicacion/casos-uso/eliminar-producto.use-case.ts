/**
 * USE CASE - Eliminar Producto
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IProductoRepositorio,
  PRODUCTO_REPOSITORIO,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';

@Injectable()
export class EliminarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: IProductoRepositorio,
  ) {}

  async ejecutar(id: string): Promise<void> {
    // 1. Verificar que el producto existe
    const producto = await this.productoRepositorio.buscarPorId(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 2. Eliminar el producto
    await this.productoRepositorio.eliminar(id);
  }
}
