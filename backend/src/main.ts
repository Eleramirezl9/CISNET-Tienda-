import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad: Helmet (protección de headers HTTP)
  app.use(helmet() as any);

  // CORS - Permitir frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookie Parser para manejo de cookies seguras
  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe global - Strict mode OWASP
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API REST para E-commerce con Arquitectura Hexagonal + DDD')
    .setVersion('1.0')
    .addTag('productos', 'Gestión de productos del catálogo')
    .addTag('autenticacion', 'Autenticación y seguridad')
    .addTag('usuarios', 'Gestión de usuarios')
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
  console.log(`🔐 OWASP Security enabled - Helmet, Validation, JWT Auth`);
}

bootstrap();
