/**
 * Port: Interfaz de Hashing Service
 * Define el contrato que debe cumplir cualquier implementación de hashing
 */
export interface IHashingService {
  /**
   * Hashea una contraseña usando el algoritmo configurado
   */
  hashear(password: string): Promise<string>;

  /**
   * Verifica una contraseña contra un hash
   */
  verificar(password: string, hash: string): Promise<boolean>;
}

export const HASHING_SERVICE = Symbol('IHashingService');
