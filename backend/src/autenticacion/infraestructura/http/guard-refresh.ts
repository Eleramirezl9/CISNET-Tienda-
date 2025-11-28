/**
 * Guard: Protección Refresh Token
 * Verifica que el usuario tenga un refresh token válido en las cookies
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuardRefresh extends AuthGuard('jwt-refresh') {}
