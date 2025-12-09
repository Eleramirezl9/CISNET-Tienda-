# 🚀 Backend E-commerce - NestJS

Backend profesional construido con **NestJS**, **Prisma ORM**, **PostgreSQL** y **Arquitectura Hexagonal + DDD**.

## 🏗️ Arquitectura

### Arquitectura Hexagonal (Ports & Adapters)

Cada módulo de dominio sigue esta estructura:

```
src/[modulo]/
├── dominio/              # CAPA DE DOMINIO (Core Business Logic)
│   ├── entidades/        # Entidades del dominio
│   ├── value-objects/    # Value Objects
│   ├── repositorios/     # Interfaces de repositorios (PORTS)
│   └── servicios/        # Servicios de dominio
│
├── aplicacion/           # CAPA DE APLICACIÓN (Use Cases)
│   ├── casos-uso/        # Casos de uso (lógica de negocio)
│   ├── dto/              # DTOs de entrada/salida
│   └── queries/          # Queries (CQRS pattern)
│
└── infraestructura/      # CAPA DE INFRAESTRUCTURA (ADAPTERS)
    ├── persistencia/     # Implementación de repositorios (Prisma)
    ├── http/             # Controllers REST
    └── eventos/          # Event handlers
```

### Domain-Driven Design (DDD)

- **Bounded Contexts**: Productos, Usuarios, Pedidos, Pagos
- **Aggregates**: Producto, Usuario, Pedido
- **Value Objects**: Precio, Email, Direccion
- **Domain Events**: ProductoCreado, PedidoConfirmado

## 📦 Stack Tecnológico

- **NestJS 10** - Framework Node.js enterprise
- **Prisma ORM** - ORM TypeScript-first
- **PostgreSQL** - Base de datos relacional
- **Passport + JWT** - Autenticación
- **Argon2** - Hash de contraseñas
- **Class Validator** - Validación de DTOs
- **Swagger** - Documentación API

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia `.env` y configura:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/tienda_db"
JWT_SECRET="tu-secreto"
```

### 3. Configurar Base de Datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Sembrar datos (opcional)
npx prisma db seed
```

### 4. Ejecutar en Desarrollo
```bash
npm run start:dev
```

El servidor estará en: http://localhost:3001

### 5. Ver Documentación API
```bash
# Una vez el servidor esté corriendo
```
Abre: http://localhost:3001/api

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── productos/           # Módulo de Productos (DDD)
│   ├── usuarios/            # Módulo de Usuarios
│   ├── pedidos/             # Módulo de Pedidos
│   ├── pagos/               # Módulo de Pagos
│   ├── compartido/          # Código compartido
│   └── main.ts              # Punto de entrada
│
├── prisma/
│   └── schema.prisma        # Schema de base de datos
│
└── test/
    └── e2e/                 # Tests end-to-end
```

## 🎯 Módulos Implementados

### ✅ Productos
- CRUD completo
- Búsqueda y filtros
- Gestión de inventario
- Imágenes con Cloudinary

### ⏳ Usuarios
- Registro y login
- Autenticación JWT
- Roles y permisos
- Perfil de usuario

### ⏳ Pedidos
- Creación de pedidos
- Estados del pedido
- Historial

### ⏳ Pagos
- Recurrente (Guatemala)
- Stripe (Internacional)
- Webhooks

## 🔒 Seguridad

- Contraseñas hasheadas con Argon2
- JWT con Access + Refresh tokens
- Validación estricta de DTOs
- CORS configurado
- Rate limiting (próximo)

## 📚 Comandos Útiles

```bash
# Desarrollo
npm run start:dev       # Hot reload

# Producción
npm run build
npm run start:prod

# Base de datos
npx prisma studio       # GUI de la base de datos
npx prisma migrate dev  # Crear migración
npx prisma generate     # Generar cliente

# Testing
npm run test            # Tests unitarios
npm run test:e2e        # Tests E2E
npm run test:cov        # Coverage

# Linting
npm run lint
npm run format
```

## 🌟 Features Enterprise

- ✅ Arquitectura Hexagonal
- ✅ Domain-Driven Design
- ✅ CQRS Pattern (Query/Command separation)
- ✅ Dependency Injection
- ✅ Exception Filters
- ✅ Validation Pipes
- ✅ Swagger Documentation
- ⏳ Event Sourcing
- ⏳ BullMQ (Queues)
- ⏳ Redis (Cache)

## 📖 Documentación

- [Arquitectura Hexagonal](./docs/ARQUITECTURA.md)
- [Guía de Desarrollo](./docs/DESARROLLO.md)
- [API Reference](http://localhost:3001/api)

---

**Construido con ❤️ usando las mejores prácticas de la industria**
