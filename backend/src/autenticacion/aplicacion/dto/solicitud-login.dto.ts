/**
 * DTO: Solicitud de Login
 * Validación y mapeo de datos para el login de usuarios
 */
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SolicitudLoginDTO {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'password123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
