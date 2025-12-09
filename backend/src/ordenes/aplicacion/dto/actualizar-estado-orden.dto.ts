/**
 * DTO - Actualizar Estado de Orden
 * Validación de entrada para actualizar el estado de una orden
 */

import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoOrden } from '@/ordenes/dominio/entidades/orden.entidad';

export class ActualizarEstadoOrdenDto {
  @ApiProperty({
    description: 'Nuevo estado de la orden',
    enum: EstadoOrden,
    example: EstadoOrden.CONFIRMADA,
  })
  @IsEnum(EstadoOrden, {
    message:
      'Estado debe ser: pendiente, confirmada, en_proceso, enviada, entregada o cancelada',
  })
  estado: EstadoOrden;

  @ApiProperty({
    description: 'Notas adicionales sobre el cambio de estado (opcional)',
    example: 'Orden confirmada y lista para preparación',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notas?: string;
}
