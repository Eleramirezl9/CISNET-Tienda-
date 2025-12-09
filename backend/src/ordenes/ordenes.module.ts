/**
 * MÓDULO - Órdenes
 *
 * Módulo de NestJS que encapsula toda la funcionalidad de órdenes
 * Sigue la arquitectura hexagonal (puertos y adaptadores)
 */

import { Module } from '@nestjs/common';
import { CompartidoModule } from '@/compartido/compartido.module';

// Infraestructura - HTTP
import { OrdenesController } from './infraestructura/http/ordenes.controller';

// Infraestructura - Persistencia
import { OrdenRepositorioPrisma } from './infraestructura/persistencia/orden.repositorio.prisma';
import { ORDEN_REPOSITORIO } from './dominio/repositorios/orden.repositorio';
import { ProductoRepositorioPrisma } from './infraestructura/persistencia/producto.repositorio.prisma';
import { PRODUCTO_REPOSITORIO } from './dominio/repositorios/producto.repositorio';

// Aplicación - Casos de Uso
import { CrearOrdenUseCase } from './aplicacion/casos-uso/crear-orden.use-case';
import { BuscarOrdenPorNumeroUseCase } from './aplicacion/casos-uso/buscar-orden-por-numero.use-case';
import { ListarOrdenesUseCase } from './aplicacion/casos-uso/listar-ordenes.use-case';
import { ActualizarEstadoOrdenUseCase } from './aplicacion/casos-uso/actualizar-estado-orden.use-case';

@Module({
  imports: [CompartidoModule],
  controllers: [OrdenesController],
  providers: [
    // Repositorios (Adaptadores)
    {
      provide: ORDEN_REPOSITORIO,
      useClass: OrdenRepositorioPrisma,
    },
    {
      provide: PRODUCTO_REPOSITORIO,
      useClass: ProductoRepositorioPrisma,
    },
    // Casos de Uso
    CrearOrdenUseCase,
    BuscarOrdenPorNumeroUseCase,
    ListarOrdenesUseCase,
    ActualizarEstadoOrdenUseCase,
  ],
  exports: [
    ORDEN_REPOSITORIO,
    PRODUCTO_REPOSITORIO,
    CrearOrdenUseCase,
    BuscarOrdenPorNumeroUseCase,
    ListarOrdenesUseCase,
    ActualizarEstadoOrdenUseCase,
  ],
})
export class OrdenesModule {}
