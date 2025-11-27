import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - Permitir frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API REST para E-commerce con Arquitectura Hexagonal + DDD')
    .setVersion('1.0')
    .addTag('productos', 'Gestión de productos del catálogo')
    .addTag('usuarios', 'Gestión de usuarios y autenticación')
    .addTag('pedidos', 'Gestión de pedidos y compras')
    .addTag('pagos', 'Procesamiento de pagos')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación en http://localhost:${port}/api`);
}

bootstrap();
