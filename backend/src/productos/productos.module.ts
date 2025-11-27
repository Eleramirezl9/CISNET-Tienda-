import { Module } from '@nestjs/common';
import { CompartidoModule } from '@/compartido/compartido.module';

// Controllers (HTTP Adapters)
import { ProductosController } from './infraestructura/http/productos.controller';

// Use Cases (Application Layer)
import { CrearProductoUseCase } from './aplicacion/casos-uso/crear-producto.use-case';
import { ObtenerProductosUseCase } from './aplicacion/casos-uso/obtener-productos.use-case';
import { ObtenerProductoPorIdUseCase } from './aplicacion/casos-uso/obtener-producto-por-id.use-case';
import { ActualizarProductoUseCase } from './aplicacion/casos-uso/actualizar-producto.use-case';
import { EliminarProductoUseCase } from './aplicacion/casos-uso/eliminar-producto.use-case';
import { ObtenerProductoPorSlugUseCase } from './aplicacion/casos-uso/obtener-producto-por-slug.use-case';

// Repositories (Infrastructure Adapters)
import { ProductoRepositorioPrisma } from './infraestructura/persistencia/producto.repositorio.prisma';

// Repository Interface Token
import { PRODUCTO_REPOSITORIO } from './dominio/repositorios/producto.repositorio.interface';

@Module({
  imports: [CompartidoModule],
  controllers: [ProductosController],
  providers: [
    // Use Cases
    CrearProductoUseCase,
    ObtenerProductosUseCase,
    ObtenerProductoPorIdUseCase,
    ActualizarProductoUseCase,
    EliminarProductoUseCase,
    ObtenerProductoPorSlugUseCase,
    
    // Repository Implementation
    {
      provide: PRODUCTO_REPOSITORIO,
      useClass: ProductoRepositorioPrisma,
    },
  ],
  exports: [
    PRODUCTO_REPOSITORIO,
    ObtenerProductosUseCase,
    ObtenerProductoPorIdUseCase,
  ],
})
export class ProductosModule {}
