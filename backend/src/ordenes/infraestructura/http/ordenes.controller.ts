/**
 * CONTROLADOR HTTP - Órdenes
 *
 * Maneja las peticiones HTTP relacionadas con órdenes
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CrearOrdenUseCase } from '@/ordenes/aplicacion/casos-uso/crear-orden.use-case';
import { BuscarOrdenPorNumeroUseCase } from '@/ordenes/aplicacion/casos-uso/buscar-orden-por-numero.use-case';
import { ListarOrdenesUseCase } from '@/ordenes/aplicacion/casos-uso/listar-ordenes.use-case';
import { ActualizarEstadoOrdenUseCase } from '@/ordenes/aplicacion/casos-uso/actualizar-estado-orden.use-case';
import { CrearOrdenDto } from '@/ordenes/aplicacion/dto/crear-orden.dto';
import { ActualizarEstadoOrdenDto } from '@/ordenes/aplicacion/dto/actualizar-estado-orden.dto';
import { OrdenResponseDto } from '@/ordenes/aplicacion/dto/orden-response.dto';

@ApiTags('pedidos')
@Controller('ordenes')
export class OrdenesController {
  constructor(
    private readonly crearOrdenUseCase: CrearOrdenUseCase,
    private readonly buscarOrdenPorNumeroUseCase: BuscarOrdenPorNumeroUseCase,
    private readonly listarOrdenesUseCase: ListarOrdenesUseCase,
    private readonly actualizarEstadoOrdenUseCase: ActualizarEstadoOrdenUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva orden',
    description:
      'Crea una nueva orden de compra sin necesidad de cuenta de usuario (guest checkout)',
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        numeroOrden: 'ORD-2024-00001',
        estado: 'pendiente',
        total: 254.0,
        fechaCreacion: '2024-01-01T00:00:00.000Z',
        metodoPago: 'tarjeta_gt',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o stock insuficiente',
    schema: {
      example: {
        statusCode: 400,
        message: 'Stock insuficiente para "Producto X"',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID xxx no encontrado',
        error: 'Not Found',
      },
    },
  })
  async crearOrden(@Body() crearOrdenDto: CrearOrdenDto) {
    const orden = await this.crearOrdenUseCase.ejecutar(crearOrdenDto);

    // Retornar solo los datos necesarios para el frontend
    return {
      id: orden.id,
      numeroOrden: orden.numeroOrden,
      estado: orden.estado,
      total: orden.total,
      fechaCreacion: orden.fechaCreacion,
      metodoPago: orden.metodoPago,
    };
  }

  @Get(':numeroOrden')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar orden por número',
    description:
      'Obtiene los detalles completos de una orden específica usando su número de orden',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    type: OrdenResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Orden no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Orden con número ORD-2025-00001 no encontrada',
        error: 'Not Found',
      },
    },
  })
  async buscarOrdenPorNumero(
    @Param('numeroOrden') numeroOrden: string,
  ): Promise<OrdenResponseDto> {
    const orden =
      await this.buscarOrdenPorNumeroUseCase.ejecutar(numeroOrden);
    return OrdenResponseDto.fromDomain(orden);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todas las órdenes',
    description:
      'Obtiene un listado paginado de todas las órdenes, ordenadas por fecha de creación (más recientes primero)',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de órdenes con paginación',
    schema: {
      example: {
        ordenes: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            numeroOrden: 'ORD-2025-00001',
            estado: 'pendiente',
            metodoPago: 'contra_entrega',
            nombreCompleto: 'Juan Pérez',
            telefono: '12345678',
            total: 254.0,
            fechaCreacion: '2025-12-02T00:00:00.000Z',
          },
        ],
        total: 10,
        pagina: 1,
        limite: 20,
        totalPaginas: 1,
      },
    },
  })
  async listarOrdenes(
    @Query('pagina') pagina: string = '1',
    @Query('limite') limite: string = '20',
  ) {
    const resultado = await this.listarOrdenesUseCase.ejecutar(
      parseInt(pagina, 10),
      parseInt(limite, 10),
    );

    return {
      ordenes: resultado.ordenes.map((orden) =>
        OrdenResponseDto.fromDomain(orden),
      ),
      total: resultado.total,
      pagina: resultado.pagina,
      limite: resultado.limite,
      totalPaginas: resultado.totalPaginas,
    };
  }

  @Patch(':numeroOrden/estado')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar estado de orden',
    description:
      'Permite actualizar el estado de una orden. Valida que las transiciones de estado sean lógicas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: OrdenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Transición de estado inválida',
    schema: {
      example: {
        statusCode: 400,
        message:
          'No se puede retroceder de "confirmada" a "pendiente"',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Orden no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Orden con número ORD-2025-00001 no encontrada',
        error: 'Not Found',
      },
    },
  })
  async actualizarEstado(
    @Param('numeroOrden') numeroOrden: string,
    @Body() dto: ActualizarEstadoOrdenDto,
  ): Promise<OrdenResponseDto> {
    const orden = await this.actualizarEstadoOrdenUseCase.ejecutar(
      numeroOrden,
      dto,
    );
    return OrdenResponseDto.fromDomain(orden);
  }
}
