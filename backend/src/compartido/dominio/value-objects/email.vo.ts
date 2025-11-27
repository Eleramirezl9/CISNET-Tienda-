/**
 * VALUE OBJECT COMPARTIDO - Email
 * 
 * Representa una dirección de email válida
 * Usado por: Usuarios, Notificaciones, etc.
 */

export class Email {
  private readonly _valor: string;

  constructor(email: string) {
    this.validar(email);
    this._valor = email.toLowerCase().trim();
  }

  get valor(): string {
    return this._valor;
  }

  private validar(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('El email es requerido');
    }

    // Regex para validar email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error('Formato de email inválido');
    }

    if (email.length > 255) {
      throw new Error('El email no puede exceder 255 caracteres');
    }
  }

  /**
   * Obtiene el dominio del email
   * @example Email('user@example.com').obtenerDominio() → 'example.com'
   */
  public obtenerDominio(): string {
    return this._valor.split('@')[1];
  }

  /**
   * Obtiene el nombre de usuario
   * @example Email('user@example.com').obtenerUsuario() → 'user'
   */
  public obtenerUsuario(): string {
    return this._valor.split('@')[0];
  }

  /**
   * Compara si dos emails son iguales
   */
  public equals(otro: Email): boolean {
    return this._valor === otro._valor;
  }

  /**
   * Verifica si es un email de un dominio específico
   */
  public esDeDominio(dominio: string): boolean {
    return this.obtenerDominio() === dominio.toLowerCase();
  }

  public toString(): string {
    return this._valor;
  }

  public toJSON(): string {
    return this._valor;
  }

  /**
   * Factory method
   */
  public static desde(email: string): Email {
    return new Email(email);
  }
}
