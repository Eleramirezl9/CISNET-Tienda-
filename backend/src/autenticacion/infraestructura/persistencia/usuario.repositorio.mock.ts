/**
 * Repositorio Mock de Usuarios
 * Implementación temporal usando memoria
 * Será reemplazado con Prisma en el futuro
 */
import { Injectable } from '@nestjs/common';
import { IUsuarioRepositorio } from '../../dominio/puertos/usuario.repositorio';
import { Usuario } from '../../dominio/entidades/usuario.entity';

@Injectable()
export class UsuarioRepositorioMock implements IUsuarioRepositorio {
  private usuarios = new Map<string, Usuario>();
  private usuariosPorEmail = new Map<string, Usuario>();

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    return this.usuariosPorEmail.get(email) || null;
  }

  async obtenerPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.get(id) || null;
  }

  async crear(usuario: Usuario): Promise<Usuario> {
    this.usuarios.set(usuario.id, usuario);
    this.usuariosPorEmail.set(usuario.email, usuario);
    return usuario;
  }

  async actualizar(usuario: Usuario): Promise<Usuario> {
    this.usuarios.set(usuario.id, usuario);
    this.usuariosPorEmail.set(usuario.email, usuario);
    return usuario;
  }

  async actualizarRefreshToken(
    id: string,
    refreshTokenHash: string,
    refreshTokenExpira: Date,
  ): Promise<void> {
    const usuario = this.usuarios.get(id);
    if (usuario) {
      usuario.refreshTokenHash = refreshTokenHash;
      usuario.refreshTokenExpira = refreshTokenExpira;
    }
  }

  async invalidarRefreshToken(id: string): Promise<void> {
    const usuario = this.usuarios.get(id);
    if (usuario) {
      usuario.refreshTokenHash = undefined;
      usuario.refreshTokenExpira = undefined;
    }
  }
}
