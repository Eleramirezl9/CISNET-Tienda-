/**
 * Guard: Protección JWT
 * Verifica que el usuario tenga un access token válido
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuardJWT extends AuthGuard('jwt') {}
