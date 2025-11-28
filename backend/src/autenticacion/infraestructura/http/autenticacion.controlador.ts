/**
 * Controlador: Autenticación
 * Endpoints para registro, login, refresh y logout
 */
import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AutenticacionServicio } from '../../aplicacion/casos-uso/autenticacion.servicio';
import { SolicitudRegistroDTO } from '../../aplicacion/dto/solicitud-registro.dto';
import { SolicitudLoginDTO } from '../../aplicacion/dto/solicitud-login.dto';
import { RespuestaAutenticacionDTO } from '../../aplicacion/dto/respuesta-autenticacion.dto';
import { Public } from './decoradores/public.decorador';
import { UsuarioActual } from './decoradores/usuario-actual.decorador';
import { GuardJWT } from './guard-jwt';
import { GuardRefresh } from './guard-refresh';

@ApiTags('Autenticación')
@Controller('auth')
export class AutenticacionControlador {
  constructor(private readonly autenticacionServicio: AutenticacionServicio) {}

  /**
   * Registra un nuevo usuario en el sistema
   * @POST /auth/register
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: RespuestaAutenticacionDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'El email ya existe o datos inválidos',
  })
  async register(
    @Body() solicitud: SolicitudRegistroDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RespuestaAutenticacionDTO> {
    const resultado = await this.autenticacionServicio.registrar(solicitud);

    // Por defecto, el refresh token no se devuelve en registro
    // El cliente debe hacer login para obtener el refresh token

    return resultado;
  }

  /**
   * Login de usuario
   * @POST /auth/login
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuario',
    description: 'Autentica un usuario y devuelve tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: RespuestaAutenticacionDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(
    @Body() solicitud: SolicitudLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RespuestaAutenticacionDTO> {
    const resultado = await this.autenticacionServicio.login(solicitud);

    // Guardar refresh token en cookie HttpOnly
    if ((resultado as any).refreshToken) {
      response.cookie('refreshToken', (resultado as any).refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/',
      });

      // No devolver el refresh token en el JSON
      delete (resultado as any).refreshToken;
    }

    return resultado;
  }

  /**
   * Refresca el access token
   * @POST /auth/refresh
   */
  @Public()
  @UseGuards(GuardRefresh)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar access token',
    description: 'Obtiene un nuevo access token usando el refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refrescado exitosamente',
    type: RespuestaAutenticacionDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refresh(
    @UsuarioActual() usuario: any,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RespuestaAutenticacionDTO> {
    const resultado = await this.autenticacionServicio.refrescar(
      usuario.id,
      usuario.refreshToken,
    );

    // Actualizar refresh token en cookie
    if ((resultado as any).refreshToken) {
      response.cookie('refreshToken', (resultado as any).refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      delete (resultado as any).refreshToken;
    }

    return resultado;
  }

  /**
   * Logout del usuario
   * @POST /auth/logout
   */
  @UseGuards(GuardJWT)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout del usuario',
    description: 'Invalida los tokens del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout exitoso',
  })
  async logout(
    @UsuarioActual() usuario: any,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ mensaje: string }> {
    await this.autenticacionServicio.logout(usuario.id);

    // Limpiar cookie de refresh token
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { mensaje: 'Logout exitoso' };
  }

  /**
   * Obtiene el perfil del usuario actual
   * @GET /auth/profile
   */
  @UseGuards(GuardJWT)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Devuelve los datos del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
  })
  async profile(@UsuarioActual() usuario: any) {
    return usuario;
  }
}
