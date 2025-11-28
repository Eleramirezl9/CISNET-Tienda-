/**
 * Entidad Usuario
 * Value object que representa un usuario en el sistema
 */
export class Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  passwordHash: string;
  rol: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  refreshTokenHash?: string;
  refreshTokenExpira?: Date;

  constructor(datos: Partial<Usuario>) {
    Object.assign(this, datos);
  }

  /**
   * Verifica si el usuario está activo
   */
  estaActivo(): boolean {
    return this.activo;
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  obtenerNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  /**
   * Verifica si el usuario es administrador
   */
  esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }
}
