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
    // 1. Generar slug si no se proporcionó
    const slug = dto.slug || this.generarSlug(dto.nombre);

    // 2. Validar que el slug no exista
    const slugExiste = await this.productoRepositorio.existeSlug(slug);
    if (slugExiste) {
      throw new ConflictException(
        `Ya existe un producto con el slug: ${slug}`,
      );
    }

    // 3. Crear Value Objects
    const precio = Precio.desde(dto.precio);
    const precioAnterior = dto.precioAnterior
      ? Precio.desde(dto.precioAnterior)
      : null;

    // 4. Validar lógica de negocio del descuento
    if (precioAnterior && precioAnterior.esMenorQue(precio)) {
      throw new ConflictException(
        'El precio anterior debe ser mayor al precio actual',
      );
    }

    // 5. Crear entidad de dominio
    const producto = new Producto(
      uuidv4(),
      dto.nombre,
      dto.descripcion,
      slug,
      precio,
      precioAnterior,
      dto.stock,
      dto.imagenPrincipal!,
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

    // 6. Persistir usando el repositorio
    const productoGuardado = await this.productoRepositorio.guardar(producto);

    return productoGuardado;
  }

  /**
   * Genera un slug a partir del nombre del producto
   */
  private generarSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD') // Normalizar caracteres unicode
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-'); // Remover guiones duplicados
  }
}
