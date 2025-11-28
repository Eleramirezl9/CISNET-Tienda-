/**
 * Decorador: @Roles()
 * Especifica qué roles pueden acceder a una ruta
 */
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
