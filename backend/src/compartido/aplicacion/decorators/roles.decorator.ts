/**
 * DECORADOR COMPARTIDO - @Roles()
 * 
 * Define qué roles tienen permiso para acceder a un endpoint
 * Usado junto con RolesGuard
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Roles disponibles en el sistema
 */
export enum Rol {
  ADMIN = 'admin',
  CLIENTE = 'cliente',
  VENDEDOR = 'vendedor',
  MODERADOR = 'moderador',
}

/**
 * Key para metadata
 */
export const ROLES_KEY = 'roles';

/**
 * Decorador @Roles()
 * 
 * @example Solo admins
 * ```typescript
 * @Roles(Rol.ADMIN)
 * @Delete('productos/:id')
 * eliminarProducto(@Param('id') id: string) {
 *   // Solo admins pueden eliminar
 * }
 * ```
 * 
 * @example Múltiples roles
 * ```typescript
 * @Roles(Rol.ADMIN, Rol.VENDEDOR)
 * @Post('productos')
 * crearProducto(@Body() dto: CrearProductoDto) {
 *   // Admins y vendedores pueden crear productos
 * }
 * ```
 * 
 * @example Sin decorador = público
 * ```typescript
 * @Get('productos')
 * listarProductos() {
 *   // Cualquiera puede ver productos
 * }
 * ```
 */
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorador @EsSoloAdmin()
 * Atajo para @Roles(Rol.ADMIN)
 */
export const EsSoloAdmin = () => Roles(Rol.ADMIN);

/**
 * Decorador @EsSoloCliente()
 * Atajo para @Roles(Rol.CLIENTE)
 */
export const EsSoloCliente = () => Roles(Rol.CLIENTE);

/**
 * Decorador @EsAdminOVendedor()
 * Atajo común
 */
export const EsAdminOVendedor = () => Roles(Rol.ADMIN, Rol.VENDEDOR);
