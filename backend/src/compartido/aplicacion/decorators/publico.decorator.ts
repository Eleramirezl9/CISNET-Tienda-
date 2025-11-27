/**
 * DECORADOR COMPARTIDO - @Publico()
 * 
 * Marca un endpoint como público (sin autenticación requerida)
 * Útil cuando tienes un guard global de autenticación
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Key para metadata
 */
export const ES_PUBLICO_KEY = 'esPublico';

/**
 * Decorador @Publico()
 * 
 * Marca un endpoint como accesible sin autenticación
 * 
 * @example
 * ```typescript
 * @Publico()
 * @Get('productos')
 * listarProductos() {
 *   // Cualquiera puede acceder sin login
 * }
 * ```
 * 
 * @example En un controller con guard global
 * ```typescript
 * @Controller('productos')
 * @UseGuards(JwtAuthGuard)  // Guard en todo el controller
 * export class ProductosController {
 *   
 *   @Publico()  // Excepto esta ruta
 *   @Get()
 *   listar() { }
 * 
 *   @Post()  // Esta requiere autenticación
 *   crear() { }
 * }
 * ```
 */
export const Publico = () => SetMetadata(ES_PUBLICO_KEY, true);
