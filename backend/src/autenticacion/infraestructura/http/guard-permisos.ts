/**
 * Guard: Verificación de Permisos
 * Verifica que el usuario tenga los permisos necesarios
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermisoEnum, tienePermiso } from '../../dominio/tipos/permiso.enum';
import { PERMISOS_KEY } from './decoradores/permisos.decorador';

@Injectable()
export class GuardPermisos implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisosRequeridos = this.reflector.getAllAndOverride<PermisoEnum[]>(
      PERMISOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se especificaron permisos, permitir acceso
    if (!permisosRequeridos || permisosRequeridos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario || !usuario.rol) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const tieneAlgunPermiso = permisosRequeridos.some((permiso) =>
      tienePermiso(usuario.rol, permiso),
    );

    if (!tieneAlgunPermiso) {
      throw new ForbiddenException(
        `No tienes los permisos necesarios. Se requiere: ${permisosRequeridos.join(', ')}`,
      );
    }

    return true;
  }
}
