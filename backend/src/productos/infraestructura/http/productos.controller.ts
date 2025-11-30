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
  UseInterceptors,
  UploadedFile,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
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

// Servicios Compartidos
import {
  SERVICIO_ALMACENAMIENTO,
  IServicioAlmacenamiento,
} from '@/compartido/puertos/servicio-almacenamiento.port';

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
    @Inject(SERVICIO_ALMACENAMIENTO)
    private readonly servicioAlmacenamiento: IServicioAlmacenamiento,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear un nuevo producto con imagen' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del producto (JPG, PNG, WEBP, máx 5MB)',
        },
        nombre: { type: 'string', example: 'Laptop Dell XPS 15' },
        descripcion: { type: 'string' },
        precio: { type: 'number', example: 1299.99 },
        stock: { type: 'number', example: 10 },
        categoria: { type: 'string', example: 'Electrónica' },
        categoriaId: { type: 'string', example: 'electronica' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o imagen incorrecta' })
  @ApiResponse({ status: 409, description: 'El slug ya existe' })
  async crear(
    @Body() dto: any,
    @UploadedFile() imagen?: Express.Multer.File,
  ): Promise<ProductoResponseDto> {
    // Transformar datos de FormData
    this.transformarFormData(dto);

    // Validar imagen si fue proporcionada
    if (imagen) {
      this.validarImagen(imagen);
      // Subir imagen a Cloudinary
      const imagenUrl = await this.servicioAlmacenamiento.subirImagen(
        imagen,
        'productos',
      );
      dto.imagenPrincipal = imagenUrl;
    }

    const producto = await this.crearProductoUseCase.ejecutar(dto);
    return ProductoMapper.aResponse(producto);
  }

  /**
   * Transforma los datos de FormData al formato esperado por el DTO
   */
  private transformarFormData(dto: any): void {
    // Convertir números que vienen como strings
    if (typeof dto.precio === 'string') {
      dto.precio = parseFloat(dto.precio);
    }
    if (dto.precioAnterior && typeof dto.precioAnterior === 'string') {
      dto.precioAnterior = parseFloat(dto.precioAnterior);
    }
    if (typeof dto.stock === 'string') {
      dto.stock = parseInt(dto.stock, 10);
    }

    // Convertir booleanos que vienen como strings
    if (typeof dto.destacado === 'string') {
      dto.destacado = dto.destacado === 'true';
    }
    if (typeof dto.activo === 'string') {
      dto.activo = dto.activo === 'true';
    }

    // Parsear etiquetas si viene como JSON string
    if (typeof dto.etiquetas === 'string') {
      try {
        dto.etiquetas = JSON.parse(dto.etiquetas);
      } catch {
        dto.etiquetas = [];
      }
    }

    // Parsear características si viene como JSON string
    if (typeof dto.caracteristicas === 'string') {
      try {
        dto.caracteristicas = JSON.parse(dto.caracteristicas);
      } catch {
        dto.caracteristicas = {};
      }
    }
  }

  /**
   * Valida que el archivo sea una imagen válida
   */
  private validarImagen(archivo: Express.Multer.File): void {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB

    if (!tiposPermitidos.includes(archivo.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no válido. Solo se permiten JPG, PNG y WEBP',
      );
    }

    if (archivo.size > tamanoMaximo) {
      throw new BadRequestException(
        'La imagen es demasiado grande. Tamaño máximo: 5MB',
      );
    }
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
      destacados: destacados !== undefined ? (destacados === true || destacados === 'true' as any) : undefined,
      disponibles: disponibles !== undefined ? (disponibles === true || disponibles === 'true' as any) : undefined,
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
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar un producto con opción de cambiar imagen' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Nueva imagen del producto (opcional)',
        },
        nombre: { type: 'string' },
        descripcion: { type: 'string' },
        precio: { type: 'number' },
        stock: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: ProductoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 409, description: 'El slug ya existe' })
  async actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: any,
    @UploadedFile() imagen?: Express.Multer.File,
  ): Promise<ProductoResponseDto> {
    // Transformar datos de FormData
    this.transformarFormData(dto);

    // Si se proporcionó una nueva imagen
    if (imagen) {
      this.validarImagen(imagen);

      // Obtener producto actual para eliminar imagen antigua
      const productoActual = await this.obtenerProductoPorIdUseCase.ejecutar(id);

      // Subir nueva imagen
      const imagenUrl = await this.servicioAlmacenamiento.subirImagen(
        imagen,
        'productos',
      );
      dto.imagenPrincipal = imagenUrl;

      // Eliminar imagen antigua de Cloudinary (si existe)
      if (productoActual.imagenPrincipal) {
        try {
          const idPublico = this.servicioAlmacenamiento.extraerIdPublico(
            productoActual.imagenPrincipal,
          );
          await this.servicioAlmacenamiento.eliminarImagen(idPublico);
        } catch (error) {
          // Log del error pero no fallar la actualización
          console.error('Error al eliminar imagen antigua:', error);
        }
      }
    }

    const producto = await this.actualizarProductoUseCase.ejecutar(id, dto);
    return ProductoMapper.aResponse(producto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto y su imagen' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async eliminar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    // Obtener producto para eliminar su imagen
    const producto = await this.obtenerProductoPorIdUseCase.ejecutar(id);

    // Eliminar imagen de Cloudinary si existe
    if (producto.imagenPrincipal) {
      try {
        const idPublico = this.servicioAlmacenamiento.extraerIdPublico(
          producto.imagenPrincipal,
        );
        await this.servicioAlmacenamiento.eliminarImagen(idPublico);
      } catch (error) {
        // Log del error pero continuar con la eliminación del producto
        console.error('Error al eliminar imagen de Cloudinary:', error);
      }
    }

    // Eliminar producto de la base de datos
    await this.eliminarProductoUseCase.ejecutar(id);
  }
}
