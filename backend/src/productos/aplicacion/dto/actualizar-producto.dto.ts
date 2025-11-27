/**
 * DTO - Actualizar Producto
 */

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CrearProductoDto } from './crear-producto.dto';

export class ActualizarProductoDto extends PartialType(CrearProductoDto) {
  @ApiProperty({
    description: 'ID del producto a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id?: string;
}
