# Arquitectura del Proyecto E-Commerce

## Stack Tecnológico

### Backend
- **Framework**: NestJS 10.x
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT + OAuth 2.0 (Google, Facebook)
- **Almacenamiento**: Cloudinary
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: Zustand
- **Validación**: Zod
- **Iconos**: Lucide React
- **Upload**: React Dropzone

## Arquitectura del Backend

### Patrón: Arquitectura Hexagonal (Ports & Adapters)

```
src/
├── {modulo}/
│   ├── dominio/              # Capa de Dominio (Core)
│   │   ├── entidades/        # Entidades de negocio
│   │   ├── value-objects/    # Objetos de valor
│   │   └── repositorios/     # Interfaces de repositorios (Ports)
│   ├── aplicacion/           # Capa de Aplicación
│   │   ├── casos-uso/        # Use Cases (lógica de aplicación)
│   │   └── dto/              # Data Transfer Objects
│   └── infraestructura/      # Capa de Infraestructura (Adapters)
│       ├── http/             # Controllers, Mappers
│       └── persistencia/     # Repositorios (implementación)
└── compartido/               # Shared Kernel
    ├── dominio/              # Value Objects compartidos
    ├── infraestructura/      # Servicios compartidos
    │   └── adaptadores/      # Cloudinary, Email, etc.
    └── puertos/              # Interfaces compartidas
```

### Capas y Responsabilidades

#### 1. Dominio (Core Business Logic)
- **Entidades**: Objetos con identidad y ciclo de vida
- **Value Objects**: Objetos inmutables sin identidad
- **Reglas de Negocio**: Validaciones y lógica pura
- **Repositorios (Interfaces)**: Contratos de persistencia

**Ejemplo:**
```typescript
// productos/dominio/entidades/producto.entidad.ts
export class Producto {
  constructor(
    public readonly id: string,
    public nombre: string,
    public precio: Precio,  // Value Object
    // ...
  ) {
    this.validar();
  }

  public estaDisponible(): boolean {
    return this.activo && this.stock > 0;
  }
}
```

#### 2. Aplicación (Use Cases)
- **Casos de Uso**: Orquestación de la lógica de negocio
- **DTOs**: Contratos de entrada/salida
- **No contiene lógica de negocio**: Solo coordina

**Ejemplo:**
```typescript
// productos/aplicacion/casos-uso/crear-producto.use-case.ts
@Injectable()
export class CrearProductoUseCase {
  async ejecutar(dto: CrearProductoDto): Promise<Producto> {
    // 1. Validar slug único
    // 2. Crear entidad
    // 3. Persistir
    // 4. Retornar
  }
}
```

#### 3. Infraestructura (Adapters)
- **HTTP**: Controllers, Guards, Interceptors
- **Persistencia**: Implementación de repositorios
- **Servicios Externos**: Cloudinary, Email, etc.

**Ejemplo:**
```typescript
// productos/infraestructura/persistencia/producto.repositorio.prisma.ts
@Injectable()
export class ProductoRepositorioPrisma implements IProductoRepositorio {
  async guardar(producto: Producto): Promise<Producto> {
    // Implementación con Prisma
  }
}
```

## Flujos Principales

### 1. Crear Producto con Imagen

```
Cliente → Controller → Use Case → Entidad → Repositorio → DB
   ↓          ↓            ↓
Upload → Cloudinary → URL
```

**Detalle:**
1. Cliente envía FormData con imagen
2. Controller valida imagen (tipo, tamaño)
3. Controller sube a Cloudinary usando `IServicioAlmacenamiento`
4. Use Case recibe DTO con URL de imagen
5. Use Case crea entidad `Producto`
6. Repositorio persiste en PostgreSQL
7. Response mapper convierte entidad a DTO

### 2. Autenticación OAuth

```
Cliente → Google/Facebook → Callback → Verificar Token → JWT
                                ↓
                          Crear/Buscar Usuario
                                ↓
                          Guardar RefreshToken
```

## Módulos del Sistema

### Core Modules

#### Productos
- CRUD completo de productos
- Upload de imágenes
- Filtros y búsqueda
- Paginación
- Gestión de stock

#### Autenticación
- Login tradicional (email/password)
- OAuth 2.0 (Google, Facebook)
- JWT tokens (access + refresh)
- Renovación automática
- Guards y decoradores

#### Compartido
- Servicio de almacenamiento (Cloudinary)
- Prisma service
- Exception filters
- Decoradores personalizados

## Seguridad

### Backend

```typescript
// Configuración en main.ts
app.use(helmet());              // Headers de seguridad
app.enableCors({                // CORS configurado
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
app.useGlobalPipes(             // Validación global
  new ValidationPipe({
    transform: true,
    whitelist: true,
  })
);
```

### Protección de Rutas

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Post('productos')
```

### Secrets Management

```env
# .env (NUNCA en git)
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_API_SECRET=...

# .env.example (en git)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=change_me_in_production
CLOUDINARY_API_SECRET=your_api_secret
```

## Frontend Architecture

### Estructura de Carpetas

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Páginas admin
│   ├── productos/         # Páginas públicas
│   └── layout.tsx         # Layout raíz
├── caracteristicas/       # Feature-based modules
│   └── productos/
│       ├── componentes/   # Componentes específicos
│       └── servicios/     # Lógica de negocio
└── compartido/            # Shared
    ├── componentes/       # Componentes reutilizables
    ├── hooks/             # Custom hooks
    └── servicios/         # API clients
```

### Estado Global (Zustand)

```typescript
// compartido/tienda/auth.tienda.ts
interface AuthState {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  iniciarSesion: (credenciales) => Promise<void>;
  cerrarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(/* ... */);
```

## Variables de Entorno

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=...
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_FACEBOOK_APP_ID=...
```

## Comandos Útiles

### Backend
```bash
cd backend

# Desarrollo
pnpm run start:dev

# Build
pnpm run build

# Prisma
npx prisma migrate dev
npx prisma studio
npx prisma generate

# Tests
pnpm test
pnpm test:e2e
```

### Frontend
```bash
cd frontend

# Desarrollo
pnpm dev

# Build
pnpm build
pnpm start

# Linting
pnpm lint
```

## Despliegue

### Backend (Render/Railway)
1. Variables de entorno configuradas
2. Database PostgreSQL provisionada
3. Ejecutar migraciones: `npx prisma migrate deploy`
4. Build: `pnpm run build`
5. Start: `pnpm run start:prod`

### Frontend (Vercel)
1. Variables de entorno configuradas
2. Build automático en cada push
3. Edge Functions para API routes

## Mejoras Futuras

### Backend
- [ ] Implementar caché (Redis)
- [ ] Rate limiting por usuario
- [ ] Logs centralizados (Winston/Pino)
- [ ] Métricas (Prometheus)
- [ ] Health checks
- [ ] Backup automático DB

### Frontend
- [ ] PWA support
- [ ] Infinite scroll
- [ ] Búsqueda con Algolia
- [ ] Analytics (GA4)
- [ ] Error boundary mejorado
- [ ] Tests E2E (Playwright)

## Recursos

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Arquitectura Hexagonal](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)
