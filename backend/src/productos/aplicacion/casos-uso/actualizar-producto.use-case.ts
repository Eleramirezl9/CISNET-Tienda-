/**
 * USE CASE - Actualizar Producto
 */

import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Producto } from '@/productos/dominio/entidades/producto.entidad';
import { Precio } from '@/productos/dominio/value-objects/precio.vo';
import {
  IProductoRepositorio,
  PRODUCTO_REPOSITORIO,
} from '@/productos/dominio/repositorios/producto.repositorio.interface';
import { ActualizarProductoDto } from '../dto/actualizar-producto.dto';

@Injectable()
export class ActualizarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO)
    private readonly productoRepositorio: IProductoRepositorio,
  ) {}

  async ejecutar(id: string, dto: ActualizarProductoDto): Promise<Producto> {
    // 1. Buscar producto existente
    const producto = await this.productoRepositorio.buscarPorId(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 2. Validar slug si cambió
    if (dto.slug && dto.slug !== producto.slug) {
      const slugExiste = await this.productoRepositorio.existeSlug(
        dto.slug,
        id,
      );
      if (slugExiste) {
        throw new ConflictException(
          `Ya existe un producto con el slug: ${dto.slug}`,
        );
      }
    }

    // 3. Actualizar campos
    if (dto.nombre !== undefined) producto.nombre = dto.nombre;
    if (dto.descripcion !== undefined) producto.descripcion = dto.descripcion;
    if (dto.slug !== undefined) producto.slug = dto.slug;
    if (dto.stock !== undefined) producto.stock = dto.stock;
    if (dto.imagenPrincipal !== undefined)
      producto.imagenPrincipal = dto.imagenPrincipal;
    if (dto.imagenes !== undefined) producto.imagenes = dto.imagenes;
    if (dto.categoriaId !== undefined) producto.categoriaId = dto.categoriaId;
    if (dto.categoria !== undefined) producto.categoria = dto.categoria;
    if (dto.etiquetas !== undefined) producto.etiquetas = dto.etiquetas;
    if (dto.caracteristicas !== undefined)
      producto.caracteristicas = dto.caracteristicas;
    if (dto.activo !== undefined) producto.activo = dto.activo;
    if (dto.destacado !== undefined) producto.destacado = dto.destacado;

    // 4. Actualizar precio si cambió
    if (dto.precio !== undefined) {
      producto.precio = Precio.desde(dto.precio);
    }

    // 5. Actualizar precio anterior si cambió
    if (dto.precioAnterior !== undefined) {
      producto.precioAnterior = dto.precioAnterior
        ? Precio.desde(dto.precioAnterior)
        : null;
    }

    // 6. Validar lógica de negocio del descuento
    if (
      producto.precioAnterior &&
      producto.precioAnterior.esMenorQue(producto.precio)
    ) {
      throw new ConflictException(
        'El precio anterior debe ser mayor al precio actual',
      );
    }

    // 7. Actualizar fecha de modificación
    producto.fechaActualizacion = new Date();

    // 8. Guardar cambios
    return await this.productoRepositorio.guardar(producto);
  }
}
