/**
 * DTO - Respuesta Producto
 * 
 * Representa cómo se envía un producto al cliente
 */

import { ApiProperty } from '@nestjs/swagger';

export class ProductoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  precio: number;

  @ApiProperty({ required: false, nullable: true })
  precioAnterior: number | null;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  imagenPrincipal: string;

  @ApiProperty({ type: [String] })
  imagenes: string[];

  @ApiProperty()
  categoriaId: string;

  @ApiProperty()
  categoria: string;

  @ApiProperty({ type: [String] })
  etiquetas: string[];

  @ApiProperty()
  caracteristicas: Record<string, string>;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  destacado: boolean;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;

  @ApiProperty({ description: 'Indica si el producto tiene descuento' })
  tieneDescuento: boolean;

  @ApiProperty({ description: 'Porcentaje de descuento si aplica' })
  porcentajeDescuento: number;

  @ApiProperty({ description: 'Indica si el producto está disponible para compra' })
  disponible: boolean;
}

export class ProductosPaginadosResponseDto {
  @ApiProperty({ type: [ProductoResponseDto] })
  productos: ProductoResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  pagina: number;

  @ApiProperty()
  limite: number;

  @ApiProperty()
  totalPaginas: number;
}
