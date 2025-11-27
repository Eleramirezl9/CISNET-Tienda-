import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { CompartidoModule } from './compartido/compartido.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Módulos de dominio
    ProductosModule,
    
    // Módulo compartido
    CompartidoModule,
  ],
})
export class AppModule {}
