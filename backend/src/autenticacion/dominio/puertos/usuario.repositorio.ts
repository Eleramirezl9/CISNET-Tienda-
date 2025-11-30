/**
 * Port: Interfaz de Repositorio de Usuarios
 * Define el contrato para acceso a datos de usuarios
 */
import { Usuario } from '../entidades/usuario.entity';

export interface IUsuarioRepositorio {
  /**
   * Busca un usuario por su email
   */
  obtenerPorEmail(email: string): Promise<Usuario | null>;

  /**
   * Busca un usuario por su ID
   */
  obtenerPorId(id: string): Promise<Usuario | null>;

  /**
   * Crea un nuevo usuario
   */
  crear(usuario: Usuario): Promise<Usuario>;

  /**
   * Actualiza un usuario existente
   */
  actualizar(usuario: Usuario): Promise<Usuario>;

  /**
   * Actualiza el refresh token del usuario
   */
  actualizarRefreshToken(
    id: string,
    refreshTokenHash: string,
    refreshTokenExpira: Date,
  ): Promise<void>;

  /**
   * Invalida el refresh token del usuario (logout)
   */
  invalidarRefreshToken(id: string): Promise<void>;

  /**
   * Busca un usuario por su ID de proveedor OAuth
   */
  obtenerPorProveedorId(
    proveedor: string,
    proveedorId: string,
  ): Promise<Usuario | null>;
}

export const USUARIO_REPOSITORIO = Symbol('IUsuarioRepositorio');
