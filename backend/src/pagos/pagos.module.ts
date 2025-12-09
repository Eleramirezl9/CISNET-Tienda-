/**
 * MÓDULO - Pagos
 *
 * Módulo de NestJS que encapsula la funcionalidad de procesamiento de pagos
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PagosController } from './infraestructura/http/pagos.controller';
import { PayPalService } from './infraestructura/paypal/paypal.service';
import { RecurrenteService } from './infraestructura/recurrente/recurrente.service';
import { BuscarOrdenPorNumeroUseCase } from '@/ordenes/aplicacion/casos-uso/buscar-orden-por-numero.use-case';
import { ActualizarEstadoOrdenUseCase } from '@/ordenes/aplicacion/casos-uso/actualizar-estado-orden.use-case';
import { CompartidoModule } from '@/compartido/compartido.module';

@Module({
  imports: [ConfigModule, CompartidoModule],
  controllers: [PagosController],
  providers: [
    PayPalService,
    RecurrenteService,
    BuscarOrdenPorNumeroUseCase,
    ActualizarEstadoOrdenUseCase,
  ],
  exports: [PayPalService, RecurrenteService],
})
export class PagosModule {}
