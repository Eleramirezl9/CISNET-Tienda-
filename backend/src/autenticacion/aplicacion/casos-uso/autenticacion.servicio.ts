/**
 * Caso de Uso: Servicio de Autenticación
 * Orquesta la lógica de autenticación siguiendo Clean Architecture
 */
import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../../dominio/entidades/usuario.entity';
import { RolEnum } from '../../dominio/tipos/rol.enum';
import { HASHING_SERVICE, IHashingService } from '../../dominio/puertos/hashing.service';
import {
  USUARIO_REPOSITORIO,
  IUsuarioRepositorio,
} from '../../dominio/puertos/usuario.repositorio';
import { SolicitudRegistroDTO } from '../dto/solicitud-registro.dto';
import { SolicitudLoginDTO } from '../dto/solicitud-login.dto';
import { SolicitudOAuthDto } from '../dto/solicitud-oauth.dto';
import { RespuestaAutenticacionDTO } from '../dto/respuesta-autenticacion.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AutenticacionServicio {
  constructor(
    @Inject(HASHING_SERVICE) private readonly hashingService: IHashingService,
    @Inject(USUARIO_REPOSITORIO) private readonly usuarioRepositorio: IUsuarioRepositorio,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario
   * @throws BadRequestException si el email ya existe
   */
  async registrar(
    solicitud: SolicitudRegistroDTO,
  ): Promise<RespuestaAutenticacionDTO> {
    // Validar que el usuario no exista
    const usuarioExistente = await this.usuarioRepositorio.obtenerPorEmail(
      solicitud.email,
    );

    if (usuarioExistente) {
      throw new BadRequestException(
        'El email ya está registrado en el sistema',
      );
    }

    // Crear nuevo usuario
    const passwordHash = await this.hashingService.hashear(solicitud.password);

    const nuevoUsuario = new Usuario({
      id: uuid(),
      email: solicitud.email,
      nombre: solicitud.nombre,
      apellido: solicitud.apellido,
      passwordHash,
      rol: RolEnum.CLIENTE,
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    const usuarioCreado = await this.usuarioRepositorio.crear(nuevoUsuario);

    // Generar tokens
    const accessToken = this.generarAccessToken(usuarioCreado);

    return new RespuestaAutenticacionDTO(accessToken, usuarioCreado);
  }

  /**
   * Login de usuario
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async login(solicitud: SolicitudLoginDTO): Promise<RespuestaAutenticacionDTO> {
    // Obtener usuario por email
    const usuario = await this.usuarioRepositorio.obtenerPorEmail(
      solicitud.email,
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const passwordValida = await this.hashingService.verificar(
      solicitud.password,
      usuario.passwordHash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!usuario.estaActivo()) {
      throw new UnauthorizedException('El usuario no está activo');
    }

    // Generar tokens
    const accessToken = this.generarAccessToken(usuario);
    const refreshToken = this.generarRefreshToken(usuario);

    // Guardar refresh token en la base de datos
    const refreshTokenHash = await this.hashingService.hashear(refreshToken);
    const refreshTokenExpira = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await this.usuarioRepositorio.actualizarRefreshToken(
      usuario.id,
      refreshTokenHash,
      refreshTokenExpira,
    );

    const respuesta = new RespuestaAutenticacionDTO(accessToken, usuario);
    (respuesta as any).refreshToken = refreshToken;

    return respuesta;
  }

  /**
   * Refresca el access token usando el refresh token
   * @throws UnauthorizedException si el refresh token es inválido
   */
  async refrescar(usuarioId: string, refreshToken: string): Promise<RespuestaAutenticacionDTO> {
    const usuario = await this.usuarioRepositorio.obtenerPorId(usuarioId);

    if (!usuario || !usuario.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Verificar que el refresh token no haya expirado
    if (
      usuario.refreshTokenExpira &&
      usuario.refreshTokenExpira < new Date()
    ) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Verificar que el refresh token sea válido
    const refreshTokenValido = await this.hashingService.verificar(
      refreshToken,
      usuario.refreshTokenHash,
    );

    if (!refreshTokenValido) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Generar nuevo access token y refresh token (rotación)
    const nuevoAccessToken = this.generarAccessToken(usuario);
    const nuevoRefreshToken = this.generarRefreshToken(usuario);

    const nuevoRefreshTokenHash = await this.hashingService.hashear(
      nuevoRefreshToken,
    );
    const nuevoRefreshTokenExpira = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.usuarioRepositorio.actualizarRefreshToken(
      usuario.id,
      nuevoRefreshTokenHash,
      nuevoRefreshTokenExpira,
    );

    const respuesta = new RespuestaAutenticacionDTO(nuevoAccessToken, usuario);
    (respuesta as any).refreshToken = nuevoRefreshToken;

    return respuesta;
  }

  /**
   * Logout del usuario (invalida el refresh token)
   */
  async logout(usuarioId: string): Promise<void> {
    await this.usuarioRepositorio.invalidarRefreshToken(usuarioId);
  }

  /**
   * Autenticación con proveedor OAuth (Facebook, Google, etc.)
   *
   * Si el usuario ya existe (por email o proveedorId), lo autentica.
   * Si no existe, crea una nueva cuenta automáticamente.
   *
   * @throws BadRequestException si falta información requerida
   */
  async autenticarOAuth(
    solicitud: SolicitudOAuthDto,
  ): Promise<RespuestaAutenticacionDTO> {
    // Buscar usuario existente por proveedorId o email
    let usuario = await this.usuarioRepositorio.obtenerPorProveedorId(
      solicitud.proveedor,
      solicitud.proveedorId,
    );

    // Si no existe por proveedorId, buscar por email
    if (!usuario && solicitud.email) {
      usuario = await this.usuarioRepositorio.obtenerPorEmail(solicitud.email);

      // Si existe por email pero no tiene proveedorId, vincular la cuenta
      if (usuario) {
        usuario.proveedorOAuth = solicitud.proveedor;
        usuario.proveedorId = solicitud.proveedorId;
        if (solicitud.foto) {
          usuario.foto = solicitud.foto;
        }
        await this.usuarioRepositorio.actualizar(usuario);
      }
    }

    // Si el usuario no existe, crear uno nuevo
    if (!usuario) {
      const nuevoUsuario = new Usuario({
        id: uuid(),
        email: solicitud.email || `${solicitud.proveedor}_${solicitud.proveedorId}@oauth.local`,
        nombre: solicitud.nombre,
        apellido: solicitud.apellido,
        passwordHash: '', // No tiene contraseña para OAuth
        rol: RolEnum.CLIENTE,
        activo: true,
        proveedorOAuth: solicitud.proveedor,
        proveedorId: solicitud.proveedorId,
        foto: solicitud.foto,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      });

      usuario = await this.usuarioRepositorio.crear(nuevoUsuario);
    }

    // Verificar que el usuario esté activo
    if (!usuario.estaActivo()) {
      throw new UnauthorizedException('El usuario no está activo');
    }

    // Generar tokens
    const accessToken = this.generarAccessToken(usuario);
    const refreshToken = this.generarRefreshToken(usuario);

    // Guardar refresh token
    const refreshTokenHash = await this.hashingService.hashear(refreshToken);
    const refreshTokenExpira = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.usuarioRepositorio.actualizarRefreshToken(
      usuario.id,
      refreshTokenHash,
      refreshTokenExpira,
    );

    const respuesta = new RespuestaAutenticacionDTO(accessToken, usuario);
    (respuesta as any).refreshToken = refreshToken;

    return respuesta;
  }

  /**
   * Genera un JWT access token
   */
  private generarAccessToken(usuario: Usuario): string {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Access token de 15 minutos
    });
  }

  /**
   * Genera un JWT refresh token
   */
  private generarRefreshToken(usuario: Usuario): string {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token de 7 días
    });
  }
}
