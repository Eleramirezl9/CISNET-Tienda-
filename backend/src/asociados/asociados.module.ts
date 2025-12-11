/**
 * Módulo de Asociados
 * Configura las dependencias e inyección para el módulo
 */

import { Module } from '@nestjs/common';
import { AsociadosControlador } from './infraestructura/http/asociados.controlador';
import { GestionarAsociadosCasoUso } from './aplicacion/casos-uso/gestionar-asociados.caso-uso';
import {
  AsociadoRepositorioPrisma,
  SolicitudAsociadoRepositorioPrisma,
} from './infraestructura/persistencia/asociado.repositorio.prisma';
import {
  ASOCIADO_REPOSITORIO,
  SOLICITUD_ASOCIADO_REPOSITORIO,
} from './dominio/repositorios/asociado.repositorio';
import { CompartidoModule } from '../compartido/compartido.module';

@Module({
  imports: [CompartidoModule],
  controllers: [AsociadosControlador],
  providers: [
    GestionarAsociadosCasoUso,
    {
      provide: ASOCIADO_REPOSITORIO,
      useClass: AsociadoRepositorioPrisma,
    },
    {
      provide: SOLICITUD_ASOCIADO_REPOSITORIO,
      useClass: SolicitudAsociadoRepositorioPrisma,
    },
  ],
  exports: [GestionarAsociadosCasoUso],
})
export class AsociadosModule {}
