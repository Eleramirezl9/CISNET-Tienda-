/**
 * DTO - Crear Orden
 * Data Transfer Object para la creación de órdenes
 */

import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsUUID,
  MinLength,
  MaxLength,
  Matches,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum de métodos de pago
 */
export enum MetodoPago {
  PAYPAL = 'paypal',
  RECURRENTE = 'recurrente',
  TARJETA_GT = 'tarjeta_gt',
  BILLETERA_FRI = 'billetera_fri',
  CONTRA_ENTREGA = 'contra_entrega',
  TARJETA_INTERNACIONAL = 'tarjeta_internacional',
}

/**
 * DTO para items de la orden
 */
export class ItemOrdenDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El productoId debe ser un UUID válido' })
  productoId: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
  })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;

  @ApiProperty({
    description: 'Precio unitario del producto al momento de la compra',
    example: 100.0,
  })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precio: number;
}

/**
 * DTO principal para crear orden
 */
export class CrearOrdenDto {
  // Datos del cliente
  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan José Pérez García',
    minLength: 3,
  })
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombreCompleto: string;

  @ApiProperty({
    description: 'Teléfono de contacto (8 dígitos)',
    example: '12345678',
    pattern: '^[0-9]{8}$',
  })
  @IsString({ message: 'El teléfono debe ser un texto' })
  @Matches(/^[0-9]{8}$/, {
    message: 'El teléfono debe tener exactamente 8 dígitos',
  })
  telefono: string;

  @ApiPropertyOptional({
    description: 'Email del cliente (opcional)',
    example: 'juan@ejemplo.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  email?: string;

  // Dirección de envío
  @ApiProperty({
    description: 'Dirección exacta de envío',
    example: 'Calle principal, casa #10',
    minLength: 10,
  })
  @IsString({ message: 'La dirección debe ser un texto' })
  @MinLength(10, { message: 'La dirección debe ser más específica' })
  direccion: string;

  @ApiProperty({
    description: 'Departamento de Guatemala',
    example: 'Guatemala',
  })
  @IsString({ message: 'El departamento debe ser un texto' })
  @MinLength(1, { message: 'El departamento es requerido' })
  departamento: string;

  @ApiProperty({
    description: 'Municipio',
    example: 'Guatemala',
  })
  @IsString({ message: 'El municipio debe ser un texto' })
  @MinLength(1, { message: 'El municipio es requerido' })
  municipio: string;

  @ApiProperty({
    description: 'Zona o colonia',
    example: 'Zona 10',
  })
  @IsString({ message: 'La zona o colonia debe ser un texto' })
  @MinLength(1, { message: 'La zona o colonia es requerida' })
  zonaOColonia: string;

  @ApiPropertyOptional({
    description: 'Referencia para encontrar la dirección',
    example: 'Frente a la gasolinera, portón verde',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'La referencia debe ser un texto' })
  @MaxLength(200, { message: 'La referencia no puede exceder 200 caracteres' })
  referencia?: string;

  // Método de pago
  @ApiProperty({
    description: 'Método de pago seleccionado',
    enum: MetodoPago,
    example: MetodoPago.TARJETA_GT,
  })
  @IsEnum(MetodoPago, {
    message: 'El método de pago debe ser uno de los valores permitidos',
  })
  metodoPago: MetodoPago;

  // Notas adicionales
  @ApiPropertyOptional({
    description: 'Notas adicionales para la orden',
    example: 'Entregar después de las 2pm',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto' })
  @MaxLength(500, { message: 'Las notas no pueden exceder 500 caracteres' })
  notas?: string;

  // Items de la orden
  @ApiProperty({
    description: 'Lista de productos en la orden',
    type: [ItemOrdenDto],
  })
  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un producto en la orden' })
  @ValidateNested({ each: true })
  @Type(() => ItemOrdenDto)
  items: ItemOrdenDto[];

  // Totales
  @ApiProperty({
    description: 'Subtotal de la orden (antes de impuestos y envío)',
    example: 200.0,
  })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @IsPositive({ message: 'El subtotal debe ser positivo' })
  subtotal: number;

  @ApiProperty({
    description: 'Impuestos (IVA 12%)',
    example: 24.0,
  })
  @IsNumber({}, { message: 'Los impuestos deben ser un número' })
  @Min(0, { message: 'Los impuestos no pueden ser negativos' })
  impuestos: number;

  @ApiProperty({
    description: 'Costo de envío',
    example: 30.0,
  })
  @IsNumber({}, { message: 'El envío debe ser un número' })
  @Min(0, { message: 'El envío no puede ser negativo' })
  envio: number;

  @ApiProperty({
    description: 'Total de la orden (subtotal + impuestos + envío)',
    example: 254.0,
  })
  @IsNumber({}, { message: 'El total debe ser un número' })
  @IsPositive({ message: 'El total debe ser positivo' })
  total: number;
}
