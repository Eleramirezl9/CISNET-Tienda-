/**
 * DECORADOR COMPARTIDO - @ApiPaginacion()
 * 
 * Documenta parámetros de paginación en Swagger
 * Evita repetir la misma documentación en cada endpoint
 */

import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Decorador @ApiPaginacion()
 * 
 * Agrega documentación Swagger para parámetros de paginación
 * 
 * @example
 * ```typescript
 * @ApiPaginacion()
 * @Get('productos')
 * listar(
 *   @Query('pagina') pagina?: number,
 *   @Query('limite') limite?: number,
 * ) {
 *   // Swagger mostrará automáticamente los query params
 * }
 * ```
 */
export function ApiPaginacion() {
  return applyDecorators(
    ApiQuery({
      name: 'pagina',
      required: false,
      type: Number,
      description: 'Número de página (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limite',
      required: false,
      type: Number,
      description: 'Elementos por página (default: 20, max: 100)',
      example: 20,
    }),
  );
}

/**
 * Decorador @ApiFiltrosProducto()
 * 
 * Documenta filtros comunes de productos
 */
export function ApiFiltrosProducto() {
  return applyDecorators(
    ApiPaginacion(),
    ApiQuery({
      name: 'categoriaId',
      required: false,
      type: String,
      description: 'Filtrar por categoría',
    }),
    ApiQuery({
      name: 'precioMin',
      required: false,
      type: Number,
      description: 'Precio mínimo',
    }),
    ApiQuery({
      name: 'precioMax',
      required: false,
      type: Number,
      description: 'Precio máximo',
    }),
    ApiQuery({
      name: 'busqueda',
      required: false,
      type: String,
      description: 'Búsqueda por nombre o descripción',
    }),
    ApiQuery({
      name: 'destacados',
      required: false,
      type: Boolean,
      description: 'Solo productos destacados',
    }),
    ApiQuery({
      name: 'disponibles',
      required: false,
      type: Boolean,
      description: 'Solo productos disponibles',
    }),
    ApiQuery({
      name: 'ordenar',
      required: false,
      enum: ['precio-asc', 'precio-desc', 'reciente', 'nombre'],
      description: 'Orden de los resultados',
    }),
  );
}
