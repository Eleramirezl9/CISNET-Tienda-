/**
 * DECORADOR COMPARTIDO - @UsuarioActual()
 * 
 * Extrae el usuario actual de la request (después de autenticación)
 * Usado en controllers para obtener el usuario logueado
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Interface del usuario autenticado
 * (Se llenará después del JWT guard)
 */
export interface UsuarioAutenticado {
  id: string;
  email: string;
  rol: string;
}

/**
 * Decorador @UsuarioActual()
 * 
 * @example
 * ```typescript
 * @Get('perfil')
 * obtenerPerfil(@UsuarioActual() usuario: UsuarioAutenticado) {
 *   return { id: usuario.id, email: usuario.email };
 * }
 * ```
 * 
 * @example Con propiedad específica
 * ```typescript
 * @Get('mis-pedidos')
 * obtenerMisPedidos(@UsuarioActual('id') usuarioId: string) {
 *   return this.pedidosService.obtenerPorUsuario(usuarioId);
 * }
 * ```
 */
export const UsuarioActual = createParamDecorator(
  (data: keyof UsuarioAutenticado | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const usuario = request.user as UsuarioAutenticado;

    // Si no hay usuario autenticado, retornar undefined
    // (El guard debería haber rechazado la request antes)
    if (!usuario) {
      return undefined;
    }

    // Si se especifica una propiedad, retornar solo esa
    // Ejemplo: @UsuarioActual('id')
    if (data) {
      return usuario[data];
    }

    // Retornar el usuario completo
    return usuario;
  },
);

/**
 * Decorador opcional - No requiere autenticación
 * 
 * @example
 * ```typescript
 * @Get('productos')
 * listarProductos(@UsuarioActualOpcional() usuario?: UsuarioAutenticado) {
 *   // usuario puede ser undefined si no está logueado
 *   if (usuario) {
 *     // Mostrar precios personalizados
 *   }
 * }
 * ```
 */
export const UsuarioActualOpcional = createParamDecorator(
  (data: keyof UsuarioAutenticado | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const usuario = request.user as UsuarioAutenticado | undefined;

    if (!usuario) {
      return undefined;
    }

    if (data) {
      return usuario[data];
    }

    return usuario;
  },
);
