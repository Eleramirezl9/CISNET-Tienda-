/**
 * Seed de Usuarios
 * Crea usuarios por defecto para testing y desarrollo
 */
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IUsuarioRepositorio, USUARIO_REPOSITORIO } from '../../dominio/puertos/usuario.repositorio';
import { IHashingService, HASHING_SERVICE } from '../../dominio/puertos/hashing.service';
import { Usuario } from '../../dominio/entidades/usuario.entity';
import { RolEnum } from '../../dominio/tipos/rol.enum';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SeedUsuarios implements OnModuleInit {
  constructor(
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
  ) {}

  async onModuleInit() {
    await this.crearUsuariosDefault();
  }

  private async crearUsuariosDefault() {
    // Solo ejecutar seeds en modo desarrollo
    const nodeEnv = process.env.NODE_ENV || 'development';
    const isDevelopment = nodeEnv === 'development';

    // Crear usuario ADMIN por defecto
    const emailAdmin = 'admin@cisnet.com';
    const adminExistente = await this.usuarioRepositorio.obtenerPorEmail(emailAdmin);

    if (!adminExistente) {
      const passwordHash = await this.hashingService.hashear('Admin123');

      const usuarioAdmin = new Usuario({
        id: uuid(),
        email: emailAdmin,
        nombre: 'Administrador',
        apellido: 'Sistema',
        passwordHash,
        rol: RolEnum.ADMIN,
        activo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      });

      await this.usuarioRepositorio.crear(usuarioAdmin);

      console.log('✅ Usuario ADMIN creado exitosamente');
      console.log('📧 Email: admin@cisnet.com');

      // Solo mostrar password en desarrollo
      if (isDevelopment) {
        console.log('🔑 Password: Admin123');
        console.log('⚠️  IMPORTANTE: Cambia esta contraseña en producción');
      }
    }

    // Crear usuario CLIENTE de prueba (solo en desarrollo)
    if (isDevelopment) {
      const emailCliente = 'cliente@test.com';
      const clienteExistente = await this.usuarioRepositorio.obtenerPorEmail(emailCliente);

      if (!clienteExistente) {
        const passwordHash = await this.hashingService.hashear('Cliente123');

        const usuarioCliente = new Usuario({
          id: uuid(),
          email: emailCliente,
          nombre: 'Cliente',
          apellido: 'Prueba',
          passwordHash,
          rol: RolEnum.CLIENTE,
          activo: true,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        });

        await this.usuarioRepositorio.crear(usuarioCliente);

        console.log('✅ Usuario CLIENTE creado exitosamente');
        console.log('📧 Email: cliente@test.com');
        console.log('🔑 Password: Cliente123');
      }
    }
  }
}
