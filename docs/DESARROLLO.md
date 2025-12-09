# 🚀 Guía de Desarrollo

## Setup Inicial Completado ✅

### Lo que se ha configurado:

1. **✅ Proyecto Next.js 14** con TypeScript y App Router
2. **✅ Tailwind CSS** configurado y listo
3. **✅ Estructura de carpetas** según DDD + Feature Sliced Design
4. **✅ Feature: Catálogo de Productos** (completa)
5. **✅ Feature: Carrito de Compras** (completa)
6. **✅ Sistema de utilidades** (api-client, formatters, cn)
7. **✅ Componentes base** (Button, Card)
8. **✅ Design tokens** (colores, espaciado)
9. **✅ Configuración VSCode** (settings, extensions)

---

## 🎯 Cómo Probar el Proyecto

### 1. Verificar Instalación
```bash
cd C:\Users\MARLON\Desktop\Tienda
npm install
```

### 2. Ejecutar en Desarrollo
```bash
npm run dev
```

### 3. Abrir en el Navegador
- Home: http://localhost:3000
- Productos: http://localhost:3000/productos

---

## 📝 Próximos Pasos (En Orden)

### Fase 1: Completar el Frontend Base

#### 1.1 Agregar más componentes Shadcn/UI
```bash
# Instalar componentes adicionales (cuando estés listo)
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

#### 1.2 Implementar TanStack Query
**Crear**: `src/compartido/lib/query-client.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      refetchOnWindowFocus: false,
    },
  },
});
```

**Actualizar**: `src/app/layout.tsx` para incluir QueryClientProvider

#### 1.3 Crear más páginas
- [ ] `/productos/[slug]` - Detalle de producto
- [ ] `/carrito` - Vista del carrito
- [ ] `/checkout` - Proceso de compra
- [ ] `/auth/login` - Login
- [ ] `/auth/registro` - Registro

#### 1.4 Implementar el Carrito UI
**Crear**: `src/caracteristicas/carrito-compras/ui/`
- `carrito-drawer.tsx` - Drawer lateral del carrito
- `carrito-item.tsx` - Item individual del carrito
- `resumen-carrito.tsx` - Resumen de totales

---

### Fase 2: Backend con NestJS

#### 2.1 Crear proyecto NestJS
```bash
# En otra carpeta (ej: C:\Users\MARLON\Desktop\Tienda-Backend)
npm i -g @nestjs/cli
nest new tienda-backend
```

#### 2.2 Instalar dependencias
```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @prisma/client prisma
npm install passport passport-jwt
npm install argon2
npm install class-validator class-transformer
npm install @nestjs/swagger
```

#### 2.3 Estructura del Backend
```
tienda-backend/
├── src/
│   ├── auth/              # Módulo de autenticación
│   ├── users/             # Módulo de usuarios
│   ├── products/          # Módulo de productos
│   ├── orders/            # Módulo de pedidos
│   ├── payments/          # Módulo de pagos
│   ├── common/            # Utilidades compartidas
│   └── main.ts
├── prisma/
│   └── schema.prisma      # Schema de la base de datos
└── test/
```

---

### Fase 3: Base de Datos (Supabase + Prisma)

#### 3.1 Crear cuenta en Supabase
- Ir a https://supabase.com
- Crear nuevo proyecto
- Obtener DATABASE_URL

#### 3.2 Configurar Prisma
**Crear**: `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  nombre    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  orders    Order[]
}

model Product {
  id              String   @id @default(uuid())
  nombre          String
  descripcion     String
  slug            String   @unique
  precio          Decimal
  precioAnterior  Decimal?
  stock           Int
  imagenPrincipal String
  imagenes        String[]
  categoriaId     String
  activo          Boolean  @default(true)
  destacado       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  categoria       Category @relation(fields: [categoriaId], references: [id])
  orderItems      OrderItem[]
}

model Category {
  id        String    @id @default(uuid())
  nombre    String
  slug      String    @unique
  createdAt DateTime  @default(now())
  
  products  Product[]
}

model Order {
  id              String      @id @default(uuid())
  userId          String
  total           Decimal
  estado          String      @default("pendiente")
  direccionEnvio  String
  createdAt       DateTime    @default(now())
  
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
}

model OrderItem {
  id         String  @id @default(uuid())
  orderId    String
  productId  String
  cantidad   Int
  precio     Decimal
  
  order      Order   @relation(fields: [orderId], references: [id])
  product    Product @relation(fields: [productId], references: [id])
}
```

#### 3.3 Ejecutar migraciones
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### Fase 4: Autenticación JWT

#### 4.1 Implementar estrategia JWT en NestJS
**Crear**: `src/auth/auth.module.ts`, `auth.service.ts`, `jwt.strategy.ts`

#### 4.2 Endpoints de autenticación
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refrescar token
- `GET /auth/me` - Usuario actual

#### 4.3 Integrar en el Frontend
**Crear**: `src/caracteristicas/autenticacion/`
- `dominio/usuario.types.ts`
- `infraestructura/auth.service.ts`
- `aplicacion/useAuth.ts`
- `ui/formulario-login.tsx`

---

### Fase 5: Integración de Pagos

#### 5.1 Recurrente (Guatemala)
- Crear cuenta en https://recurrente.com
- Obtener API keys
- Implementar en backend

#### 5.2 Stripe (Internacional)
- Crear cuenta en https://stripe.com
- Instalar SDK: `npm install stripe`
- Implementar webhooks

#### 5.3 Fri (Billetera Digital)
- Integrar API de Fri
- Implementar QR y deeplinks

---

### Fase 6: Imágenes con Cloudinary

#### 6.1 Configurar Cloudinary
```bash
npm install cloudinary
```

#### 6.2 Upload de imágenes
**Crear**: `src/compartido/lib/cloudinary.ts`

---

### Fase 7: Testing

#### 7.1 Tests Unitarios
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

#### 7.2 Tests E2E
```bash
npm install -D playwright
```

---

### Fase 8: Deployment

#### 8.1 Frontend (Vercel)
```bash
# Conectar con GitHub
# Deploy automático en cada push
```

#### 8.2 Backend (Render)
```bash
# Crear servicio en Render
# Configurar variables de entorno
```

---

## 🛠️ Comandos Útiles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # Linter
npm run type-check   # Verificar tipos
```

### Backend (cuando esté creado)
```bash
npm run start:dev    # Desarrollo con hot reload
npm run build        # Build producción
npm run start:prod   # Producción
```

### Base de Datos
```bash
npx prisma studio    # GUI de la base de datos
npx prisma migrate dev  # Crear migración
npx prisma generate  # Generar cliente
```

---

## 📚 Recursos de Aprendizaje

### Next.js 14
- https://nextjs.org/docs
- https://nextjs.org/learn

### NestJS
- https://docs.nestjs.com
- https://github.com/nestjs/nest

### Prisma
- https://www.prisma.io/docs

### Tailwind CSS
- https://tailwindcss.com/docs

### Shadcn/UI
- https://ui.shadcn.com

---

## ⚠️ Notas Importantes

1. **Variables de Entorno**: Nunca commitear `.env.local` al repositorio
2. **TypeScript**: Mantener `strict: true` siempre
3. **Commits**: Usar conventional commits (feat:, fix:, docs:)
4. **Branches**: `main` (producción), `develop` (desarrollo), `feature/*` (features)

---

## 🎉 Estado Actual

```
✅ Proyecto inicializado
✅ Estructura de carpetas completa
✅ Feature: Catálogo de Productos
✅ Feature: Carrito de Compras
✅ Componentes UI base
✅ Sistema de utilidades
⏳ Backend NestJS
⏳ Base de datos Prisma
⏳ Autenticación JWT
⏳ Integración de pagos
⏳ Testing
⏳ Deployment
```

---

**¡Estás listo para continuar con el desarrollo! 🚀**
