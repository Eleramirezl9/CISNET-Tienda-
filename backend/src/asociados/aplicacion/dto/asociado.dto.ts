/**
 * DTOs para el módulo de Asociados
 * Validación con class-validator
 */

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  MaxLength,
  MinLength,
  IsIn,
} from 'class-validator';

export class CrearAsociadoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  cargo: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  empresa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  foto?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  twitter?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  sitioWeb?: string;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}

export class ActualizarAsociadoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  cargo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  empresa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  foto?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  twitter?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  sitioWeb?: string;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}

export class CrearSolicitudDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  nombre: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  telefono: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  empresa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cargo?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  mensaje: string;
}

export class ActualizarSolicitudDto {
  @IsOptional()
  @IsIn(['pendiente', 'revisando', 'aprobada', 'rechazada'])
  estado?: 'pendiente' | 'revisando' | 'aprobada' | 'rechazada';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notasAdmin?: string;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;
}
