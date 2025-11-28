/**
 * Estrategia Refresh Token para Passport
 * Valida el refresh token en el endpoint de refresco
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class EstrategiaRT extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extrae el token de las cookies
          return request?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'tu-secreto-refresh-super-seguro',
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    const refreshToken = request?.cookies?.refreshToken;
    return {
      id: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}
