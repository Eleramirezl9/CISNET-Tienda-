import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { CompartidoModule } from './compartido/compartido.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { PagosModule } from './pagos/pagos.module';
import { AsociadosModule } from './asociados/asociados.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Módulos de dominio
    ProductosModule,
    AutenticacionModule,
    OrdenesModule,
    PagosModule,
    AsociadosModule,

    // Módulo compartido
    CompartidoModule,
  ],
})
export class AppModule {}
