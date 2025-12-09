/**
 * Estrategia JWT para Passport
 * Valida el access token en cada request protegido
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class EstrategiaJWT extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in environment variables. ' +
        'Please check your .env file in the backend directory.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      nombre: payload.nombre,
      apellido: payload.apellido,
      rol: payload.rol,
      activo: payload.activo,
    };
  }
}
