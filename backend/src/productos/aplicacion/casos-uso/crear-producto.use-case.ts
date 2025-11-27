/**
 * USE CASE - Crear Producto
 * 
 * Caso de uso para crear un nuevo producto
 * Sigue el principio de Single Responsibility
 */

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import { Precio } from '@/productos/dominio/value-objects/precio.vo';
import {
  IProductoRepositorio,
  PRODUCTO_REPOSITORIO,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';
import { CrearProductoDto } from '../dto/crear-producto.dto';

@Injectable()
export class CrearProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: IProductoRepositorio,
  ) {}

  async ejecutar(dto: CrearProductoDto): Promise<Producto> {
    // 1. Validar que el slug no exista
    const slugExiste = await this.productoRepositorio.existeSlug(dto.slug);
    if (slugExiste) {
      throw new ConflictException(
        `Ya existe un producto con el slug: ${dto.slug}`,
      );
    }

    // 2. Crear Value Objects
    const precio = Precio.desde(dto.precio);
    const precioAnterior = dto.precioAnterior
      ? Precio.desde(dto.precioAnterior)
      : null;

    // 3. Validar lógica de negocio del descuento
    if (precioAnterior && precioAnterior.esMenorQue(precio)) {
      throw new ConflictException(
        'El precio anterior debe ser mayor al precio actual',
      );
    }

    // 4. Crear entidad de dominio
    const producto = new Producto(
      uuidv4(),
      dto.nombre,
      dto.descripcion,
      dto.slug,
      precio,
      precioAnterior,
      dto.stock,
      dto.imagenPrincipal,
      dto.imagenes || [],
      dto.categoriaId,
      dto.categoria,
      dto.etiquetas || [],
      dto.caracteristicas || {},
      dto.activo ?? true,
      dto.destacado ?? false,
      new Date(),
      new Date(),
    );

    // 5. Persistir usando el repositorio
    const productoGuardado = await this.productoRepositorio.guardar(producto);

    return productoGuardado;
  }
}
