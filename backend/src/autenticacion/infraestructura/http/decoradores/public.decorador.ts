/**
 * Decorador: @Public()
 * Marca una ruta como pública (no requiere autenticación)
 */
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('esPublico', true);
