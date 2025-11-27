/**
 * CONTROLLER - Productos (HTTP Adapter)
 * 
 * Controlador REST para el módulo de productos
 * Este es un ADAPTER que conecta HTTP con los casos de uso
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Use Cases
import { CrearProductoUseCase } from '@/productos/aplicacion/casos-uso/crear-producto.use-case';
import { ObtenerProductosUseCase } from '@/productos/aplicacion/casos-uso/obtener-productos.use-case';
import { ObtenerProductoPorIdUseCase } from '@/productos/aplicacion/casos-uso/obtener-producto-por-id.use-case';
import { ObtenerProductoPorSlugUseCase } from '@/productos/aplicacion/casos-uso/obtener-producto-por-slug.use-case';
import { ActualizarProductoUseCase } from '@/productos/aplicacion/casos-uso/actualizar-producto.use-case';
import { EliminarProductoUseCase } from '@/productos/aplicacion/casos-uso/eliminar-producto.use-case';

// DTOs
import { CrearProductoDto } from '@/productos/aplicacion/dto/crear-producto.dto';
import { ActualizarProductoDto } from '@/productos/aplicacion/dto/actualizar-producto.dto';
import {
  ProductoResponseDto,
  ProductosPaginadosResponseDto,
} from '@/productos/aplicacion/dto/producto-response.dto';

// Mappers
import { ProductoMapper } from './mappers/producto.mapper';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(
    private readonly crearProductoUseCase: CrearProductoUseCase,
    private readonly obtenerProductosUseCase: ObtenerProductosUseCase,
    private readonly obtenerProductoPorIdUseCase: ObtenerProductoPorIdUseCase,
    private readonly obtenerProductoPorSlugUseCase: ObtenerProductoPorSlugUseCase,
    private readonly actualizarProductoUseCase: ActualizarProductoUseCase,
    private readonly eliminarProductoUseCase: EliminarProductoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El slug ya existe' })
  async crear(
    @Body() dto: CrearProductoDto,
  ): Promise<ProductoResponseDto> {
    const producto = await this.crearProductoUseCase.ejecutar(dto);
    return ProductoMapper.aResponse(producto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de productos con filtros' })
  @ApiQuery({ name: 'categoriaId', required: false, type: String })
  @ApiQuery({ name: 'precioMin', required: false, type: Number })
  @ApiQuery({ name: 'precioMax', required: false, type: Number })
  @ApiQuery({ name: 'busqueda', required: false, type: String })
  @ApiQuery({ name: 'destacados', required: false, type: Boolean })
  @ApiQuery({ name: 'disponibles', required: false, type: Boolean })
  @ApiQuery({
    name: 'ordenar',
    required: false,
    enum: ['precio-asc', 'precio-desc', 'reciente', 'nombre'],
  })
  @ApiQuery({ name: 'pagina', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limite', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: ProductosPaginadosResponseDto,
  })
  async obtenerTodos(
    @Query('categoriaId') categoriaId?: string,
    @Query('precioMin') precioMin?: number,
    @Query('precioMax') precioMax?: number,
    @Query('etiquetas') etiquetas?: string,
    @Query('busqueda') busqueda?: string,
    @Query('destacados') destacados?: boolean,
    @Query('disponibles') disponibles?: boolean,
    @Query('ordenar') ordenar?: string,
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ): Promise<ProductosPaginadosResponseDto> {
    const resultado = await this.obtenerProductosUseCase.ejecutar({
      categoriaId,
      precioMin: precioMin ? Number(precioMin) : undefined,
      precioMax: precioMax ? Number(precioMax) : undefined,
      etiquetas: etiquetas ? etiquetas.split(',') : undefined,
      busqueda,
      destacados: destacados === true || destacados === 'true' as any,
      disponibles: disponibles === true || disponibles === 'true' as any,
      ordenar: ordenar as any,
      pagina: pagina ? Number(pagina) : 1,
      limite: limite ? Number(limite) : 20,
    });

    return {
      productos: resultado.items.map((p) => ProductoMapper.aResponse(p)),
      total: resultado.total,
      pagina: resultado.pagina,
      limite: resultado.limite,
      totalPaginas: resultado.totalPaginas,
    };
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener un producto por su slug' })
  @ApiParam({ name: 'slug', description: 'Slug del producto', example: 'laptop-dell-xps-15' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ProductoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async obtenerPorSlug(
    @Param('slug') slug: string,
  ): Promise<ProductoResponseDto> {
    const producto = await this.obtenerProductoPorSlugUseCase.ejecutar(slug);
    return ProductoMapper.aResponse(producto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ProductoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async obtenerPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductoResponseDto> {
    const producto = await this.obtenerProductoPorIdUseCase.ejecutar(id);
    return ProductoMapper.aResponse(producto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: ProductoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 409, description: 'El slug ya existe' })
  async actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarProductoDto,
  ): Promise<ProductoResponseDto> {
    const producto = await this.actualizarProductoUseCase.ejecutar(id, dto);
    return ProductoMapper.aResponse(producto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async eliminar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.eliminarProductoUseCase.ejecutar(id);
  }
}
