/**
 * Estrategia Refresh Token para Passport
 * Valida el refresh token en el endpoint de refresco
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class EstrategiaRT extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not defined in environment variables. ' +
        'Please check your .env file in the backend directory.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extrae el token de las cookies
          return request?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
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
