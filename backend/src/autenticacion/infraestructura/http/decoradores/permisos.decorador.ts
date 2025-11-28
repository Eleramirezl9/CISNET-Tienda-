/**
 * Decorador: Permisos Requeridos
 * Define qué permisos se necesitan para acceder a un endpoint
 */
import { SetMetadata } from '@nestjs/common';
import { PermisoEnum } from '../../../dominio/tipos/permiso.enum';

export const PERMISOS_KEY = 'permisos';

/**
 * Decorador para especificar permisos requeridos
 * @param permisos - Lista de permisos necesarios para acceder al endpoint
 */
export const RequierePermisos = (...permisos: PermisoEnum[]) =>
  SetMetadata(PERMISOS_KEY, permisos);
