/**
 * Implementación: Servicio de Hashing con Argon2
 * Implementa la interfaz IHashingService usando Argon2
 */
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IHashingService } from '../../dominio/puertos/hashing.service';

@Injectable()
export class Argon2Servicio implements IHashingService {
  /**
   * Opciones de configuración para Argon2
   * Sigue recomendaciones de OWASP
   */
  private readonly opciones = {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  };

  /**
   * Hashea una contraseña usando Argon2
   */
  async hashear(password: string): Promise<string> {
    return argon2.hash(password, this.opciones);
  }

  /**
   * Verifica una contraseña contra un hash Argon2
   */
  async verificar(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }
}
