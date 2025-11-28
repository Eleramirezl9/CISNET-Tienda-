/**
 * Repositorio de Usuarios con Prisma
 * Implementación real usando PostgreSQL
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';
import { IUsuarioRepositorio } from '../../dominio/puertos/usuario.repositorio';
import { Usuario } from '../../dominio/entidades/usuario.entity';

@Injectable()
export class UsuarioRepositorioPrisma implements IUsuarioRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) return null;

    return new Usuario({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido || '',
      passwordHash: usuario.password,
      rol: usuario.rol.toUpperCase() as 'ADMIN' | 'CLIENTE',
      activo: usuario.activo,
      fechaCreacion: usuario.fechaCreacion,
      fechaActualizacion: usuario.fechaActualizacion,
      refreshTokenHash: usuario.refreshTokenHash || undefined,
      refreshTokenExpira: usuario.refreshTokenExpira || undefined,
    });
  }

  async obtenerPorId(id: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) return null;

    return new Usuario({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido || '',
      passwordHash: usuario.password,
      rol: usuario.rol.toUpperCase() as 'ADMIN' | 'CLIENTE',
      activo: usuario.activo,
      fechaCreacion: usuario.fechaCreacion,
      fechaActualizacion: usuario.fechaActualizacion,
      refreshTokenHash: usuario.refreshTokenHash || undefined,
      refreshTokenExpira: usuario.refreshTokenExpira || undefined,
    });
  }

  async crear(usuario: Usuario): Promise<Usuario> {
    const creado = await this.prisma.usuario.create({
      data: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        password: usuario.passwordHash,
        rol: usuario.rol.toLowerCase(),
        activo: usuario.activo,
        emailVerificado: false,
      },
    });

    return new Usuario({
      id: creado.id,
      email: creado.email,
      nombre: creado.nombre,
      apellido: creado.apellido || '',
      passwordHash: creado.password,
      rol: creado.rol.toUpperCase() as 'ADMIN' | 'CLIENTE',
      activo: creado.activo,
      fechaCreacion: creado.fechaCreacion,
      fechaActualizacion: creado.fechaActualizacion,
    });
  }

  async actualizar(usuario: Usuario): Promise<Usuario> {
    const actualizado = await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        password: usuario.passwordHash,
        rol: usuario.rol.toLowerCase(),
        activo: usuario.activo,
      },
    });

    return new Usuario({
      id: actualizado.id,
      email: actualizado.email,
      nombre: actualizado.nombre,
      apellido: actualizado.apellido || '',
      passwordHash: actualizado.password,
      rol: actualizado.rol.toUpperCase() as 'ADMIN' | 'CLIENTE',
      activo: actualizado.activo,
      fechaCreacion: actualizado.fechaCreacion,
      fechaActualizacion: actualizado.fechaActualizacion,
    });
  }

  async actualizarRefreshToken(
    id: string,
    refreshTokenHash: string,
    refreshTokenExpira: Date,
  ): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: {
        refreshTokenHash,
        refreshTokenExpira,
      },
    });
  }

  async invalidarRefreshToken(id: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: {
        refreshTokenHash: null,
        refreshTokenExpira: null,
      },
    });
  }
}
