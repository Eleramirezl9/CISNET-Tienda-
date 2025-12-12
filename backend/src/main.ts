import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Habilitar rawBody para webhooks de Stripe
    rawBody: true,
  });

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
    .setDescription(
      'API REST para E-commerce construida con Arquitectura Hexagonal + DDD\n\n' +
      'Características principales:\n' +
      '- Autenticación JWT con refresh tokens\n' +
      '- OAuth2 (Google y Facebook)\n' +
      '- Procesamiento de pagos (PayPal y Recurrente)\n' +
      '- Gestión de productos, órdenes y usuarios\n' +
      '- Validación estricta según estándares OWASP\n\n' +
      'Repositorio: https://github.com/Eleramirezl9/CISNET-Tienda-'
    )
    .setVersion('1.0.0')
    .setContact('CISNET Tienda', 'https://github.com/Eleramirezl9/CISNET-Tienda-', 'soporte@cisnet-tienda.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('productos', 'Gestión de productos del catálogo')
    .addTag('autenticacion', 'Autenticación y seguridad (JWT, OAuth2)')
    .addTag('usuarios', 'Gestión de usuarios y perfiles')
    .addTag('ordenes', 'Gestión de órdenes y compras')
    .addTag('pagos', 'Procesamiento de pagos (PayPal, Recurrente)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese su token JWT (sin el prefijo "Bearer")',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3001', 'Servidor de Desarrollo')
    .addServer('https://api.tu-dominio.com', 'Servidor de Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  });

  // ✅ CORREGIDO: Swagger en 'docs' para evitar conflicto con prefijo global 'api'
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'E-commerce API - Documentación',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación Swagger en http://localhost:${port}/docs`);
  console.log(`🔌 API Endpoints en http://localhost:${port}/api`);
  console.log(`🔐 OWASP Security enabled - Helmet, Validation, JWT Auth`);
}

bootstrap();
