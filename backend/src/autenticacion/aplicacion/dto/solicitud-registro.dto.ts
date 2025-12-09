/**
 * DTO: Solicitud de Registro
 * Validación y mapeo de datos para el registro de usuarios
 */
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SolicitudRegistroDTO {
  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'nuevo@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'María',
    minLength: 2,
    maxLength: 50,
    type: String,
  })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'González',
    minLength: 2,
    maxLength: 50,
    type: String,
  })
  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  apellido: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres, máximo 128)',
    example: 'MiPassword123!',
    minLength: 8,
    maxLength: 128,
    type: String,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(128, { message: 'La contraseña no puede exceder 128 caracteres' })
  password: string;
}
