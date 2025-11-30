/**
 * Módulo: Autenticación
 * Configura e inyecta todas las dependencias relacionadas con autenticación
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Servicios
import { AutenticacionServicio } from './aplicacion/casos-uso/autenticacion.servicio';
import { Argon2Servicio } from './infraestructura/seguridad/argon2.servicio';

// Estrategias Passport
import { EstrategiaJWT } from './infraestructura/passport/estrategia-jwt';
import { EstrategiaRT } from './infraestructura/passport/estrategia-rt';
import { EstrategiaFacebook } from './infraestructura/passport/estrategia-facebook';
import { EstrategiaGoogle } from './infraestructura/passport/estrategia-google';

// Guards
import { GuardJWT } from './infraestructura/http/guard-jwt';
import { GuardRoles } from './infraestructura/http/guard-roles';
import { GuardJWTOpcional } from './infraestructura/http/guard-jwt-opcional';
import { GuardRefresh } from './infraestructura/http/guard-refresh';
import { GuardPermisos } from './infraestructura/http/guard-permisos';

// Controlador
import { AutenticacionControlador } from './infraestructura/http/autenticacion.controlador';

// Repositorios y Seeds
import { UsuarioRepositorioMock } from './infraestructura/persistencia/usuario.repositorio.mock';
import { UsuarioRepositorioPrisma } from './infraestructura/persistencia/usuario.repositorio.prisma';
import { SeedUsuarios } from './infraestructura/persistencia/seed-usuarios';
import { CompartidoModule } from '@/compartido/compartido.module';

// Puertos
import { HASHING_SERVICE } from './dominio/puertos/hashing.service';
import { USUARIO_REPOSITORIO } from './dominio/puertos/usuario.repositorio';

@Module({
  imports: [
    CompartidoModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'tu-secreto-super-seguro-cambia-esto',
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Servicios
    AutenticacionServicio,

    // Estrategias
    EstrategiaJWT,
    EstrategiaRT,
    EstrategiaFacebook,
    EstrategiaGoogle,

    // Guards
    GuardJWT,
    GuardRoles,
    GuardJWTOpcional,
    GuardRefresh,
    GuardPermisos,

    // Seeds
    SeedUsuarios,

    // Implementaciones (inyección de dependencias)
    {
      provide: HASHING_SERVICE,
      useClass: Argon2Servicio,
    },
    {
      provide: USUARIO_REPOSITORIO,
      useClass: UsuarioRepositorioPrisma, // ✅ Ahora usa Prisma (PostgreSQL)
    },
  ],
  controllers: [AutenticacionControlador],
  exports: [
    AutenticacionServicio,
    GuardJWT,
    GuardRoles,
    GuardJWTOpcional,
    GuardRefresh,
    GuardPermisos,
    HASHING_SERVICE,
    USUARIO_REPOSITORIO,
  ],
})
export class AutenticacionModule {}
