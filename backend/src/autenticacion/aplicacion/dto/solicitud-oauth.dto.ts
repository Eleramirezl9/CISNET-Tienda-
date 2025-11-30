import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

/**
 * DTO para autenticación con proveedor OAuth externo
 *
 * Representa los datos que recibimos del proveedor OAuth (Facebook, Google, etc.)
 * después de que el usuario se autentica exitosamente.
 */
export class SolicitudOAuthDto {
  /**
   * ID único del usuario en el proveedor OAuth
   * @example "1234567890"
   */
  @IsString()
  proveedorId: string;

  /**
   * Nombre del proveedor OAuth
   * @example "facebook" | "google"
   */
  @IsIn(['facebook', 'google'])
  proveedor: 'facebook' | 'google';

  /**
   * Email del usuario (puede ser null si el proveedor no lo proporciona)
   * @example "usuario@ejemplo.com"
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * Nombre del usuario
   * @example "Juan"
   */
  @IsString()
  nombre: string;

  /**
   * Apellido del usuario
   * @example "Pérez"
   */
  @IsString()
  apellido: string;

  /**
   * URL de la foto de perfil del usuario (opcional)
   * @example "https://graph.facebook.com/123456/picture"
   */
  @IsString()
  @IsOptional()
  foto?: string;

  /**
   * Token de acceso del proveedor OAuth (para futuras llamadas API)
   * @example "EAAQfCZBQlBU4BQ..."
   */
  @IsString()
  @IsOptional()
  accessToken?: string;
}
