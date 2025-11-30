/**
 * MÓDULO COMPARTIDO
 *
 * Contiene servicios y utilidades compartidas por todos los módulos
 */

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infraestructura/prisma/prisma.service';
import { CloudinaryServicio } from './infraestructura/adaptadores/cloudinary.servicio';
import { SERVICIO_ALMACENAMIENTO } from './puertos/servicio-almacenamiento.port';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    {
      provide: SERVICIO_ALMACENAMIENTO,
      useClass: CloudinaryServicio,
    },
  ],
  exports: [PrismaService, SERVICIO_ALMACENAMIENTO],
})
export class CompartidoModule {}
