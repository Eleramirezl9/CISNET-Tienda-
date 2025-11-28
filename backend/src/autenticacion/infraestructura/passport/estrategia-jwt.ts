/**
 * Estrategia JWT para Passport
 * Valida el access token en cada request protegido
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class EstrategiaJWT extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambia-esto',
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
