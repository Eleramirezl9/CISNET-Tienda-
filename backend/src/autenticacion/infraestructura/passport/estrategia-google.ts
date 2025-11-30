import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

/**
 * Estrategia de autenticación con Google OAuth 2.0
 *
 * Implementa el flujo de OAuth para permitir a los usuarios
 * iniciar sesión con su cuenta de Google.
 *
 * @see https://developers.google.com/identity/protocols/oauth2
 */
@Injectable()
export class EstrategiaGoogle extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    });
  }

  /**
   * Valida y extrae los datos del perfil de Google
   *
   * @param accessToken Token de acceso de Google
   * @param refreshToken Token de refresco de Google (opcional)
   * @param profile Perfil del usuario de Google
   * @param done Callback de Passport
   * @returns Datos del usuario extraídos de Google
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // Extraer datos del perfil de Google
    const usuario = {
      googleId: id,
      email: emails && emails.length > 0 ? emails[0].value : null,
      nombre: name?.givenName || '',
      apellido: name?.familyName || '',
      foto: photos && photos.length > 0 ? photos[0].value : null,
      proveedor: 'google',
      accessToken, // Token para futuras llamadas a Google API
    };

    done(null, usuario);
  }
}
