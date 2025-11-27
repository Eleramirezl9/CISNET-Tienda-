/**
 * MÓDULO COMPARTIDO
 * 
 * Contiene servicios y utilidades compartidas por todos los módulos
 */

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './infraestructura/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CompartidoModule {}
