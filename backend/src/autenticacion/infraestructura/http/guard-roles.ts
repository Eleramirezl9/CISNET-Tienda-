/**
 * Guard: Protección de Roles
 * Verifica que el usuario tenga uno de los roles especificados
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GuardRoles implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos del decorador @Roles()
    const rolesRequeridos = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Si no hay roles especificados, permite el acceso
    if (!rolesRequeridos) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    // Verifica si el usuario tiene uno de los roles requeridos (case-insensitive)
    const rolUsuario = usuario?.rol?.toLowerCase();
    const rolesLower = rolesRequeridos.map((r) => r.toLowerCase());

    if (!usuario || !rolUsuario || !rolesLower.includes(rolUsuario)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
