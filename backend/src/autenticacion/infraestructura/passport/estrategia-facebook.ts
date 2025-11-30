import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

/**
 * Estrategia de autenticación con Facebook OAuth 2.0
 *
 * Implementa el flujo de OAuth para permitir a los usuarios
 * iniciar sesión con su cuenta de Facebook.
 *
 * @see https://developers.facebook.com/docs/facebook-login
 */
@Injectable()
export class EstrategiaFacebook extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID') || '',
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') || '',
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') || '',
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'displayName', 'name', 'emails', 'photos'],
    });
  }

  /**
   * Valida y extrae los datos del perfil de Facebook
   *
   * @param accessToken Token de acceso de Facebook
   * @param refreshToken Token de refresco de Facebook (opcional)
   * @param profile Perfil del usuario de Facebook
   * @returns Datos del usuario extraídos de Facebook
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // Extraer datos del perfil de Facebook
    const usuario = {
      facebookId: id,
      email: emails && emails.length > 0 ? emails[0].value : null,
      nombre: name?.givenName || '',
      apellido: name?.familyName || '',
      foto: photos && photos.length > 0 ? photos[0].value : null,
      proveedor: 'facebook',
      accessToken, // Token para futuras llamadas a Facebook API
    };

    return usuario;
  }
}
