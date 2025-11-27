/**
 * DTO - Crear Producto
 * 
 * Define la estructura de datos para crear un producto
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
  Min,
  MaxLength,
  MinLength,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CrearProductoDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 15',
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop de alto rendimiento con procesador Intel i7 y 16GB RAM',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  descripcion: string;

  @ApiProperty({
    description: 'Slug único del producto (URL amigable)',
    example: 'laptop-dell-xps-15',
  })
  @IsString()
  @MinLength(1)
  slug: string;

  @ApiProperty({
    description: 'Precio del producto en Quetzales',
    example: 12500.00,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio: number;

  @ApiProperty({
    description: 'Precio anterior (para mostrar descuento)',
    example: 15000.00,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioAnterior?: number;

  @ApiProperty({
    description: 'Cantidad en stock',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen principal',
    example: 'https://res.cloudinary.com/demo/image/upload/laptop.jpg',
  })
  @IsUrl()
  imagenPrincipal: string;

  @ApiProperty({
    description: 'URLs de imágenes adicionales',
    example: ['https://res.cloudinary.com/demo/image/upload/laptop-2.jpg'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imagenes?: string[];

  @ApiProperty({
    description: 'ID de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  categoriaId: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Computadoras',
  })
  @IsString()
  categoria: string;

  @ApiProperty({
    description: 'Etiquetas del producto',
    example: ['laptop', 'dell', 'gaming'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  etiquetas?: string[];

  @ApiProperty({
    description: 'Características técnicas del producto',
    example: {
      procesador: 'Intel i7',
      ram: '16GB',
      almacenamiento: '512GB SSD',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  caracteristicas?: Record<string, string>;

  @ApiProperty({
    description: 'Si el producto está activo',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({
    description: 'Si el producto es destacado',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}
