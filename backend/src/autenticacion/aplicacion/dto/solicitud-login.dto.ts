/**
 * DTO: Solicitud de Login
 * Validación y mapeo de datos para el login de usuarios
 */
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SolicitudLoginDTO {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
