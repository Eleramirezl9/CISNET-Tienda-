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
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AutenticacionServicio } from '../../aplicacion/casos-uso/autenticacion.servicio';
import { SolicitudRegistroDTO } from '../../aplicacion/dto/solicitud-registro.dto';
import { SolicitudLoginDTO } from '../../aplicacion/dto/solicitud-login.dto';
import { SolicitudOAuthDto } from '../../aplicacion/dto/solicitud-oauth.dto';
import { RespuestaAutenticacionDTO } from '../../aplicacion/dto/respuesta-autenticacion.dto';
import { Public } from './decoradores/public.decorador';
import { UsuarioActual } from './decoradores/usuario-actual.decorador';
import { GuardJWT } from './guard-jwt';
import { GuardRefresh } from './guard-refresh';

@ApiTags('autenticacion')
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
    description: 'Crea una nueva cuenta de usuario con email y contraseña. Devuelve el access token y los datos del usuario.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: RespuestaAutenticacionDTO,
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        usuario: {
          id: 'uuid-123',
          email: 'nuevo@example.com',
          nombre: 'María',
          apellido: 'González',
          rol: 'cliente',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El email ya existe o datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'El email ya está registrado',
        error: 'Bad Request',
      },
    },
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
    description: 'Autentica un usuario y devuelve tokens (access token en JSON, refresh token en cookie HttpOnly)',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: RespuestaAutenticacionDTO,
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        usuario: {
          id: 'uuid-123',
          email: 'usuario@example.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          rol: 'cliente',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
        error: 'Unauthorized',
      },
    },
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
   * Inicia el flujo de autenticación con Facebook
   * @GET /auth/facebook
   */
  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Iniciar login con Facebook',
    description: 'Redirige al usuario a la página de autorización de Facebook',
  })
  async facebookLogin() {
    // Este método solo inicia el flujo OAuth
    // El guard de Passport redirige automáticamente a Facebook
  }

  /**
   * Callback de Facebook OAuth
   * @GET /auth/facebook/callback
   */
  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Callback de Facebook OAuth',
    description: 'Procesa la respuesta de Facebook y crea/autentica al usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación con Facebook exitosa',
    type: RespuestaAutenticacionDTO,
  })
  async facebookCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const facebookUser = req.user as any;

    // Crear DTO con los datos de Facebook
    const solicitudOAuth: SolicitudOAuthDto = {
      proveedorId: facebookUser.facebookId,
      proveedor: 'facebook',
      email: facebookUser.email,
      nombre: facebookUser.nombre,
      apellido: facebookUser.apellido,
      foto: facebookUser.foto,
      accessToken: facebookUser.accessToken,
    };

    // Autenticar o crear usuario
    const resultado =
      await this.autenticacionServicio.autenticarOAuth(solicitudOAuth);

    // Guardar refresh token en cookie
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

    // Redirigir al frontend con el access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    response.redirect(
      `${frontendUrl}/auth/callback?token=${resultado.accessToken}`,
    );
  }

  /**
   * Inicia el flujo de autenticación con Google
   * @GET /auth/google
   */
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Iniciar login con Google',
    description: 'Redirige al usuario a la página de autorización de Google',
  })
  async googleLogin() {
    // Este método solo inicia el flujo OAuth
    // El guard de Passport redirige automáticamente a Google
  }

  /**
   * Callback de Google OAuth
   * @GET /auth/google/callback
   */
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Callback de Google OAuth',
    description: 'Procesa la respuesta de Google y crea/autentica al usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación con Google exitosa',
    type: RespuestaAutenticacionDTO,
  })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const googleUser = req.user as any;

    // Crear DTO con los datos de Google
    const solicitudOAuth: SolicitudOAuthDto = {
      proveedorId: googleUser.googleId,
      proveedor: 'google',
      email: googleUser.email,
      nombre: googleUser.nombre,
      apellido: googleUser.apellido,
      foto: googleUser.foto,
      accessToken: googleUser.accessToken,
    };

    // Autenticar o crear usuario
    const resultado =
      await this.autenticacionServicio.autenticarOAuth(solicitudOAuth);

    // Guardar refresh token en cookie
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

    // Redirigir al frontend con el access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    response.redirect(
      `${frontendUrl}/auth/callback?token=${resultado.accessToken}`,
    );
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
