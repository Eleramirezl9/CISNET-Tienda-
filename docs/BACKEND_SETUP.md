# 🚀 Setup Backend - Guía de Instalación

## 📋 Pre-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado (o cuenta en Supabase)
- npm o yarn

---

## 🔧 Instalación Paso a Paso

### 1. Instalar Dependencias

```bash
cd C:\Users\MARLON\Desktop\Tienda\backend
npm install
```

Esto instalará:
- **NestJS** - Framework
- **Prisma** - ORM
- **Passport + JWT** - Autenticación
- **Class Validator** - Validación
- **Swagger** - Documentación
- Y todas las dependencias necesarias

---

### 2. Configurar Base de Datos

#### Opción A: PostgreSQL Local

1. Instala PostgreSQL desde https://www.postgresql.org/download/

2. Crea la base de datos:
```sql
CREATE DATABASE tienda_db;
```

3. Actualiza `.env`:
```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/tienda_db?schema=public"
```

#### Opción B: Supabase (Gratis en la nube)

1. Crea cuenta en https://supabase.com

2. Crea un nuevo proyecto

3. Ve a Settings → Database → Connection String

4. Copia la URL de conexión y actualiza `.env`:
```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROYECTO].supabase.co:5432/postgres"
```

---

### 3. Generar Cliente Prisma

```bash
npx prisma generate
```

Este comando genera el cliente TypeScript de Prisma basado en el schema.

---

### 4. Ejecutar Migraciones

```bash
npx prisma migrate dev --name init
```

Esto crea las tablas en la base de datos:
- ✅ `productos`
- ✅ `usuarios`
- ✅ `direcciones`
- ✅ `pedidos`
- ✅ `items_pedido`
- ✅ `pagos`

---

### 5. (Opcional) Sembrar Datos de Prueba

Crea el archivo `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear productos de prueba
  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Laptop Dell XPS 15',
        descripcion: 'Laptop de alto rendimiento',
        slug: 'laptop-dell-xps-15',
        precio: 12500,
        precioAnterior: 15000,
        stock: 5,
        imagenPrincipal: 'https://via.placeholder.com/500',
        categoriaId: '123e4567-e89b-12d3-a456-426614174000',
        categoria: 'Computadoras',
        etiquetas: ['laptop', 'dell'],
        caracteristicas: { procesador: 'Intel i7', ram: '16GB' },
        destacado: true,
      },
      {
        nombre: 'Mouse Logitech MX Master 3',
        descripcion: 'Mouse ergonómico profesional',
        slug: 'mouse-logitech-mx-master-3',
        precio: 850,
        stock: 15,
        imagenPrincipal: 'https://via.placeholder.com/500',
        categoriaId: '123e4567-e89b-12d3-a456-426614174001',
        categoria: 'Accesorios',
        etiquetas: ['mouse', 'logitech'],
        caracteristicas: { conectividad: 'Bluetooth' },
      },
    ],
  });

  console.log('✅ Datos de prueba creados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Agregar script en `package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Ejecutar:
```bash
npx prisma db seed
```

---

### 6. Configurar Variables de Entorno

Revisa y actualiza `.env`:

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="cambia-este-secreto-en-produccion"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"
```

---

### 7. Iniciar el Servidor

```bash
npm run start:dev
```

El servidor iniciará en: **http://localhost:3001**

Verás:
```
✅ Base de datos conectada
🚀 Servidor corriendo en http://localhost:3001
📚 Documentación en http://localhost:3001/api
```

---

## 🧪 Verificar Instalación

### 1. Swagger Documentation

Abre en tu navegador:
```
http://localhost:3001/api
```

Deberías ver la documentación interactiva de la API.

### 2. Probar Endpoint

```bash
# Obtener todos los productos
curl http://localhost:3001/api/productos

# Crear un producto (con datos de prueba)
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Producto",
    "descripcion": "Descripción de prueba del producto",
    "slug": "test-producto",
    "precio": 100,
    "stock": 10,
    "imagenPrincipal": "https://via.placeholder.com/500",
    "categoriaId": "123e4567-e89b-12d3-a456-426614174000",
    "categoria": "Test"
  }'
```

### 3. Prisma Studio (GUI de Base de Datos)

```bash
npx prisma studio
```

Se abrirá en http://localhost:5555 una interfaz visual para ver y editar datos.

---

## 🐛 Solución de Problemas

### Error: Cannot find module '@prisma/client'

```bash
npx prisma generate
```

### Error: Connection timeout

Verifica que PostgreSQL esté corriendo y que la URL de conexión sea correcta.

### Error: Migration failed

```bash
# Reiniciar migraciones (⚠️ borra todos los datos)
npx prisma migrate reset
npx prisma migrate dev
```

### Puerto 3001 ocupado

Cambia el puerto en `.env`:
```env
PORT=3002
```

---

## 📦 Comandos Útiles

```bash
# Desarrollo
npm run start:dev          # Hot reload

# Producción
npm run build
npm run start:prod

# Base de datos
npx prisma studio          # GUI visual
npx prisma migrate dev     # Crear migración
npx prisma migrate reset   # Reiniciar DB
npx prisma db seed         # Sembrar datos
npx prisma generate        # Generar cliente

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests E2E
npm run test:cov           # Coverage

# Linting
npm run lint
npm run format
```

---

## 🎯 Próximos Pasos

1. ✅ Backend instalado y corriendo
2. ✅ Base de datos configurada
3. ✅ API de productos funcionando
4. ⏳ Conectar frontend con backend
5. ⏳ Implementar autenticación
6. ⏳ Implementar módulo de pedidos
7. ⏳ Integrar pasarelas de pago

---

## 📚 Estructura Creada

```
backend/
├── src/
│   ├── productos/          ✅ Módulo completo
│   │   ├── dominio/        ✅ Entidades, VOs, Interfaces
│   │   ├── aplicacion/     ✅ Use Cases, DTOs
│   │   └── infraestructura/✅ Controllers, Repositorios
│   │
│   ├── compartido/         ✅ Prisma Service
│   ├── app.module.ts       ✅ Módulo principal
│   └── main.ts             ✅ Bootstrap
│
├── prisma/
│   └── schema.prisma       ✅ Schema completo (6 tablas)
│
├── .env                    ✅ Variables de entorno
├── package.json            ✅ Dependencias
├── tsconfig.json           ✅ TypeScript config
└── nest-cli.json           ✅ NestJS config
```

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado
- [ ] PostgreSQL configurado
- [ ] `npm install` ejecutado
- [ ] `.env` configurado
- [ ] `npx prisma generate` ejecutado
- [ ] `npx prisma migrate dev` ejecutado
- [ ] `npm run start:dev` corriendo
- [ ] http://localhost:3001/api accesible
- [ ] Endpoint `/api/productos` responde

---

## 🆘 Ayuda

Si tienes problemas:

1. Verifica los logs en la consola
2. Revisa que PostgreSQL esté corriendo
3. Verifica las variables de entorno en `.env`
4. Ejecuta `npx prisma studio` para ver la base de datos
5. Consulta la documentación: http://localhost:3001/api

---

**¡Backend listo para desarrollo! 🎉**
