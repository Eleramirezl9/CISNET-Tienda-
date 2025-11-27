/**
 * SERVICIO PRISMA
 *
 * Servicio global de conexión a la base de datos
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Base de datos conectada');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Base de datos desconectada');
  }
}
