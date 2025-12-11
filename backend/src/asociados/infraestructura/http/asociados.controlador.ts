/**
 * Controlador HTTP para el módulo de Asociados
 * Capa de infraestructura - entrada HTTP
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GestionarAsociadosCasoUso } from '../../aplicacion/casos-uso/gestionar-asociados.caso-uso';
import {
  CrearAsociadoDto,
  ActualizarAsociadoDto,
  CrearSolicitudDto,
  ActualizarSolicitudDto,
} from '../../aplicacion/dto/asociado.dto';
import { GuardJWT } from '../../../autenticacion/infraestructura/http/guard-jwt';
import { GuardRoles } from '../../../autenticacion/infraestructura/http/guard-roles';
import { Roles } from '../../../autenticacion/infraestructura/http/decoradores/roles.decorador';
import {
  IServicioAlmacenamiento,
  SERVICIO_ALMACENAMIENTO,
} from '../../../compartido/puertos/servicio-almacenamiento.port';
import { EstadoSolicitud } from '../../dominio/entidades/asociado.entidad';

@Controller('asociados')
export class AsociadosControlador {
  constructor(
    private readonly gestionarAsociados: GestionarAsociadosCasoUso,
    @Inject(SERVICIO_ALMACENAMIENTO)
    private readonly servicioAlmacenamiento: IServicioAlmacenamiento,
  ) {}

  // ========== RUTAS ADMIN (deben ir ANTES de rutas con :id) ==========

  @Get('admin/todos')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async listarTodos() {
    return this.gestionarAsociados.listarTodosAsociados();
  }

  @Get('admin/estadisticas')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async obtenerEstadisticas() {
    return this.gestionarAsociados.obtenerEstadisticas();
  }

  @Get('admin/solicitudes/no-leidas')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async contarNoLeidas() {
    const cantidad = await this.gestionarAsociados.contarSolicitudesNoLeidas();
    return { cantidad };
  }

  @Get('admin/solicitudes')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async listarSolicitudes(@Query('estado') estado?: EstadoSolicitud) {
    if (estado) {
      return this.gestionarAsociados.listarSolicitudesPorEstado(estado);
    }
    return this.gestionarAsociados.listarSolicitudes();
  }

  @Get('admin/solicitudes/:id')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async obtenerSolicitud(@Param('id') id: string) {
    return this.gestionarAsociados.obtenerSolicitud(id);
  }

  @Post('admin')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('foto'))
  async crearAsociado(
    @Body() dto: CrearAsociadoDto,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    if (foto) {
      const urlImagen = await this.servicioAlmacenamiento.subirImagen(foto, 'asociados');
      dto.foto = urlImagen;
    }
    return this.gestionarAsociados.crearAsociado(dto);
  }

  @Put('admin/solicitudes/:id/marcar-leida')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async marcarSolicitudComoLeida(@Param('id') id: string) {
    return this.gestionarAsociados.marcarSolicitudComoLeida(id);
  }

  @Put('admin/solicitudes/:id')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async actualizarSolicitud(
    @Param('id') id: string,
    @Body() dto: ActualizarSolicitudDto,
  ) {
    return this.gestionarAsociados.actualizarSolicitud(id, dto);
  }

  @Put('admin/:id')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('foto'))
  async actualizarAsociado(
    @Param('id') id: string,
    @Body() dto: ActualizarAsociadoDto,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    if (foto) {
      const urlImagen = await this.servicioAlmacenamiento.subirImagen(foto, 'asociados');
      dto.foto = urlImagen;
    }
    return this.gestionarAsociados.actualizarAsociado(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(GuardJWT, GuardRoles)
  @Roles('admin')
  async eliminarAsociado(@Param('id') id: string) {
    await this.gestionarAsociados.eliminarAsociado(id);
    return { mensaje: 'Asociado eliminado correctamente' };
  }

  // ========== RUTAS PÚBLICAS ==========

  @Get()
  async listarActivos() {
    return this.gestionarAsociados.listarAsociadosActivos();
  }

  @Post('solicitudes')
  async crearSolicitud(@Body() dto: CrearSolicitudDto) {
    return this.gestionarAsociados.crearSolicitud(dto);
  }

  @Get(':id')
  async obtenerAsociado(@Param('id') id: string) {
    return this.gestionarAsociados.obtenerAsociado(id);
  }
}
