/**
 * USE CASE - Obtener Productos
 * 
 * Caso de uso para listar productos con filtros y paginación
 */

import { Injectable, Inject } from '@nestjs/common';
import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import {
  IProductoRepositorio,
  PRODUCTO_REPOSITORIO,
  FiltrosProducto,
  ResultadoPaginado,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';

@Injectable()
export class ObtenerProductosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: IProductoRepositorio,
  ) {}

  async ejecutar(
    filtros?: FiltrosProducto,
  ): Promise<ResultadoPaginado<Producto>> {
    return await this.productoRepositorio.buscarTodos(filtros);
  }
}
