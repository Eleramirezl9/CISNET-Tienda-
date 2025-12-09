# 🌳 Árbol de Carpetas del Backend - Guía Visual Completa

## 📋 Índice
1. [Vista General](#vista-general)
2. [Carpeta por Carpeta](#explicación-detallada)
3. [Flujo de Datos](#flujo-de-datos)
4. [Qué va en cada carpeta](#reglas-de-organización)

---

## 🎯 Vista General

```
backend/
│
├── 📁 src/                         # CÓDIGO FUENTE
│   ├── 📁 productos/               # ✅ MÓDULO COMPLETO (DDD)
│   ├── 📁 usuarios/                # ⏳ Próximo módulo
│   ├── 📁 pedidos/                 # ⏳ Próximo módulo
│   ├── 📁 compartido/              # ✅ Código compartido
│   ├── 📄 app.module.ts            # ✅ Módulo raíz de NestJS
│   └── 📄 main.ts                  # ✅ Punto de entrada
│
├── 📁 prisma/                      # CONFIGURACIÓN DE BASE DE DATOS
│   └── 📄 schema.prisma            # ✅ Schema completo (6 tablas)
│
├── 📁 test/                        # TESTS E2E
│   └── 📁 e2e/
│
├── 📄 package.json                 # ✅ Dependencias
├── 📄 tsconfig.json                # ✅ Config TypeScript
├── 📄 nest-cli.json                # ✅ Config NestJS
├── 📄 .env                         # ✅ Variables de entorno
└── 📄 README.md                    # ✅ Documentación
```

---

## 🔍 Explicación Detallada

### 📁 `src/` - Raíz del Código

```
src/
├── 📄 main.ts           # Punto de entrada de la aplicación
├── 📄 app.module.ts     # Módulo raíz que importa todos los módulos
│
├── 📁 productos/        # MÓDULO DE DOMINIO (Completo)
├── 📁 usuarios/         # MÓDULO DE DOMINIO (Próximo)
├── 📁 pedidos/          # MÓDULO DE DOMINIO (Próximo)
└── 📁 compartido/       # Código compartido entre módulos
```

#### 📄 `main.ts` - Punto de Entrada

```typescript
// Lo que hace:
// 1. Crea la aplicación NestJS
// 2. Configura CORS
// 3. Configura validación global
// 4. Configura Swagger
// 5. Inicia el servidor en puerto 3001
```

#### 📄 `app.module.ts` - Módulo Raíz

```typescript
// Lo que hace:
// 1. Importa ConfigModule (variables de entorno)
// 2. Importa ProductosModule
// 3. Importa CompartidoModule
// 4. Importa otros módulos futuros
```

---

### 📁 `src/productos/` - Módulo de Productos (Arquitectura Hexagonal)

```
productos/
├── 📄 productos.module.ts          # Configuración del módulo
│
├── 📁 dominio/                     # CAPA DE DOMINIO (QUÉ)
│   ├── 📁 entidades/               # Entidades del negocio
│   │   ├── 📄 producto.entidad.ts
│   │   └── 📄 producto.entidad.spec.ts  ✅ Tests
│   │
│   ├── 📁 value-objects/           # Objetos de valor
│   │   ├── 📄 precio.vo.ts
│   │   └── 📄 precio.vo.spec.ts         ✅ Tests
│   │
│   ├── 📁 repositorios/            # Interfaces (PORTS)
│   │   └── 📄 producto.repositorio.interface.ts
│   │
│   └── 📁 servicios/               # Servicios de dominio (opcional)
│
├── 📁 aplicacion/                  # CAPA DE APLICACIÓN
│   ├── 📁 casos-uso/               # Use Cases
│   │   ├── 📄 crear-producto.use-case.ts
│   │   ├── 📄 crear-producto.use-case.spec.ts      ✅ Tests
│   │   ├── 📄 obtener-productos.use-case.ts
│   │   ├── 📄 obtener-productos.use-case.spec.ts   ✅ Tests
│   │   ├── 📄 obtener-producto-por-id.use-case.ts
│   │   ├── 📄 obtener-producto-por-slug.use-case.ts
│   │   ├── 📄 actualizar-producto.use-case.ts
│   │   └── 📄 eliminar-producto.use-case.ts
│   │
│   └── 📁 dto/                     # Data Transfer Objects
│       ├── 📄 crear-producto.dto.ts
│       ├── 📄 actualizar-producto.dto.ts
│       └── 📄 producto-response.dto.ts
│
└── 📁 infraestructura/             # CAPA DE INFRAESTRUCTURA (CÓMO)
    ├── 📁 persistencia/            # Repositorios (ADAPTERS)
    │   └── 📄 producto.repositorio.prisma.ts
    │
    ├── 📁 http/                    # Controllers REST (ADAPTERS)
    │   ├── 📄 productos.controller.ts
    │   └── 📁 mappers/
    │       └── 📄 producto.mapper.ts
    │
    └── 📁 eventos/                 # Event handlers (opcional)
```

---

### 📊 Explicación por Capa

#### 1️⃣ **DOMINIO** - El Corazón del Negocio

```
📁 dominio/
│
├── 📁 entidades/
│   └── producto.entidad.ts
│       • Clase Producto con lógica de negocio
│       • reducirStock()
│       • incrementarStock()
│       • tieneDescuento()
│       • estaDisponible()
│       ✅ NO menciona Prisma, MongoDB, HTTP
│       ✅ Solo lógica PURA de negocio
│
├── 📁 value-objects/
│   └── precio.vo.ts
│       • Clase Precio inmutable
│       • aplicarDescuento()
│       • sumar(), restar(), multiplicar()
│       ✅ Validaciones incluidas
│       ✅ Inmutable (no puede cambiar después de creado)
│
└── 📁 repositorios/
    └── producto.repositorio.interface.ts
        • Interface IProductoRepositorio
        • Define QUÉ operaciones existen
        • guardar(), buscarPorId(), buscarTodos()
        ✅ Es un PORT (contrato)
        ✅ NO implementa nada, solo define
```

**Regla de Oro del Dominio**:
```
❌ NO puede importar:
   - @nestjs/*
   - @prisma/*
   - express
   - Ningún framework

✅ SOLO puede usar:
   - TypeScript puro
   - Otras clases del dominio
```

---

#### 2️⃣ **APLICACIÓN** - Orquestación

```
📁 aplicacion/
│
├── 📁 casos-uso/
│   └── crear-producto.use-case.ts
│       • Coordina entre dominio e infraestructura
│       • 1. Valida (puede usar lógica de aplicación)
│       • 2. Crea entidad de dominio
│       • 3. Llama al repositorio para persistir
│       ✅ Usa interfaces (PORTS), no implementaciones
│
└── 📁 dto/
    └── crear-producto.dto.ts
        • Define estructura de datos de entrada/salida
        • Validaciones con class-validator
        • Documentación con @ApiProperty (Swagger)
        ✅ Solo para transferencia de datos
```

---

#### 3️⃣ **INFRAESTRUCTURA** - Detalles Técnicos

```
📁 infraestructura/
│
├── 📁 persistencia/
│   └── producto.repositorio.prisma.ts
│       • Implementa IProductoRepositorio (el PORT)
│       • Usa Prisma para hablar con PostgreSQL
│       • Mapea entre Entidad de Dominio ↔ Modelo de Prisma
│       ✅ Es un ADAPTER
│       ✅ Puede ser reemplazado sin tocar dominio
│
├── 📁 http/
│   ├── productos.controller.ts
│   │   • Expone endpoints REST
│   │   • GET /api/productos
│   │   • POST /api/productos
│   │   • Llama a los Use Cases
│   │   ✅ Es un ADAPTER de entrada
│   │
│   └── 📁 mappers/
│       └── producto.mapper.ts
│           • Convierte Entidad → DTO de respuesta
│           • Agrega campos calculados (tieneDescuento, etc.)
│
└── 📁 eventos/
    • Event handlers (próximo)
    • Reacciona a eventos del dominio
```

---

### 📁 `src/compartido/` - Código Compartido

```
compartido/
├── 📄 compartido.module.ts         # Módulo @Global
│
└── 📁 infraestructura/
    └── 📁 prisma/
        └── 📄 prisma.service.ts    # Servicio de conexión a BD
            • Conecta/desconecta de PostgreSQL
            • Disponible globalmente
            • Inyectable en cualquier módulo
```

**Propósito**:
- Código usado por múltiples módulos
- Servicios globales (Prisma, Logger, etc.)
- Utilidades compartidas

---

### 📁 `prisma/` - Base de Datos

```
prisma/
├── 📄 schema.prisma                # Schema de la BD
│   • Define tablas (models)
│   • Define relaciones
│   • Configura generador de cliente
│
└── 📁 migrations/                  # Migraciones (se generan)
    └── 📄 20231125_init/
        └── migration.sql
```

**Archivo principal**: `schema.prisma`

```prisma
// Define las tablas
model Producto {
  id              String   @id @default(uuid())
  nombre          String
  precio          Decimal
  stock           Int
  // ... más campos
}

model Usuario {
  id              String   @id @default(uuid())
  email           String   @unique
  // ... más campos
}

// etc.
```

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear un Producto

```
1️⃣ Cliente HTTP
   │
   ↓ POST /api/productos
   │
2️⃣ productos.controller.ts (Infraestructura/HTTP)
   │ @Post()
   │ crear(@Body() dto: CrearProductoDto)
   │
   ↓ llama a
   │
3️⃣ crear-producto.use-case.ts (Aplicación)
   │ ejecutar(dto)
   │ • Valida slug único
   │ • Crea entidad Producto
   │ • Llama a repositorio
   │
   ↓ usa
   │
4️⃣ producto.entidad.ts (Dominio)
   │ Producto.crear(...)
   │ • Valida reglas de negocio
   │ • Crea instancia válida
   │
   ↓ se pasa a
   │
5️⃣ IProductoRepositorio (Dominio - Interface/PORT)
   │ guardar(producto)
   │
   ↓ implementado por
   │
6️⃣ producto.repositorio.prisma.ts (Infraestructura/Persistencia)
   │ guardar(producto: Producto)
   │ • Mapea Entidad → Prisma Model
   │ • Ejecuta query INSERT
   │ • Mapea Prisma Model → Entidad
   │
   ↓
   │
7️⃣ PostgreSQL
   INSERT INTO productos (...)
```

---

## 📝 Reglas de Organización

### ✅ Qué va en DOMINIO

```typescript
// ✅ CORRECTO
export class Producto {
  reducirStock(cantidad: number) {
    if (this.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= cantidad;
  }
}

// ❌ INCORRECTO
export class Producto {
  async reducirStock(cantidad: number) {
    await prisma.producto.update(...);  // ❌ Mención a Prisma
  }
}
```

### ✅ Qué va en APLICACIÓN

```typescript
// ✅ CORRECTO - Use Case
export class CrearProductoUseCase {
  async ejecutar(dto: CrearProductoDto) {
    const producto = Producto.crear(...);
    return await this.repo.guardar(producto);
  }
}

// ❌ INCORRECTO - Lógica de negocio en Use Case
export class CrearProductoUseCase {
  async ejecutar(dto: CrearProductoDto) {
    if (dto.stock < 0) {  // ❌ Esto va en el Dominio
      throw new Error('Stock no puede ser negativo');
    }
    // ...
  }
}
```

### ✅ Qué va en INFRAESTRUCTURA

```typescript
// ✅ CORRECTO - Repositorio
export class ProductoRepositorioPrisma {
  async guardar(producto: Producto) {
    return await this.prisma.producto.create({
      data: this.mapearAPrisma(producto)
    });
  }
}

// ❌ INCORRECTO - Lógica de negocio en Repositorio
export class ProductoRepositorioPrisma {
  async guardar(producto: Producto) {
    if (producto.stock < 0) {  // ❌ Esto va en el Dominio
      throw new Error('...');
    }
    // ...
  }
}
```

---

## 📋 Checklist: ¿Dónde va mi código?

### Pregúntate:

1. **¿Es una regla de negocio pura?**
   → 📁 `dominio/entidades/` o `dominio/value-objects/`

2. **¿Es una validación de formato (email, URL)?**
   → 📁 `dominio/value-objects/`

3. **¿Es coordinación entre dominio e infraestructura?**
   → 📁 `aplicacion/casos-uso/`

4. **¿Es validación de datos de entrada HTTP?**
   → 📁 `aplicacion/dto/`

5. **¿Es comunicación con base de datos?**
   → 📁 `infraestructura/persistencia/`

6. **¿Es un endpoint HTTP?**
   → 📁 `infraestructura/http/`

7. **¿Es código usado por múltiples módulos?**
   → 📁 `compartido/`

---

## 🎯 Próximos Módulos (Estructura Idéntica)

### Cuando agregues `usuarios/`:

```
src/usuarios/
├── dominio/
│   ├── entidades/
│   │   └── usuario.entidad.ts
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   └── password.vo.ts
│   └── repositorios/
│       └── usuario.repositorio.interface.ts
│
├── aplicacion/
│   ├── casos-uso/
│   │   ├── registrar-usuario.use-case.ts
│   │   ├── iniciar-sesion.use-case.ts
│   │   └── cambiar-password.use-case.ts
│   └── dto/
│
└── infraestructura/
    ├── persistencia/
    │   └── usuario.repositorio.prisma.ts
    └── http/
        └── usuarios.controller.ts
```

### Cuando agregues `pedidos/`:

```
src/pedidos/
├── dominio/
│   ├── entidades/
│   │   ├── pedido.entidad.ts
│   │   └── item-pedido.entidad.ts
│   ├── value-objects/
│   │   └── estado-pedido.vo.ts
│   └── repositorios/
│
├── aplicacion/
│   ├── casos-uso/
│   │   ├── crear-pedido.use-case.ts
│   │   ├── confirmar-pedido.use-case.ts
│   │   └── cancelar-pedido.use-case.ts
│   └── dto/
│
└── infraestructura/
    ├── persistencia/
    └── http/
```

---

## 🎓 Ventajas de Esta Estructura

### ✅ Escalabilidad
```
Agregar nuevo módulo = Copiar estructura
Sin afectar módulos existentes
```

### ✅ Mantenibilidad
```
Código organizado por dominio
Fácil de encontrar
Responsabilidades claras
```

### ✅ Testabilidad
```
Dominio: Tests sin BD
Aplicación: Tests con mocks
Infraestructura: Tests de integración
```

### ✅ Flexibilidad
```
Cambiar de Prisma a TypeORM:
  Solo cambiar infraestructura/persistencia/
  Dominio y Aplicación intactos
```

---

## 📚 Resumen Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND STRUCTURE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  src/                                                       │
│  ├─ main.ts              ⚙️  Punto de entrada             │
│  ├─ app.module.ts        ⚙️  Módulo raíz                  │
│  │                                                          │
│  ├─ productos/           🎯 MÓDULO DE DOMINIO              │
│  │  ├─ dominio/          💎 QUÉ hace (Lógica pura)       │
│  │  ├─ aplicacion/       🎭 Orquestación (Use Cases)     │
│  │  └─ infraestructura/  🔧 CÓMO lo hace (Prisma, HTTP)  │
│  │                                                          │
│  └─ compartido/          🌐 Código compartido              │
│     └─ prisma.service.ts 🗄️  Conexión a BD               │
│                                                             │
│  prisma/                                                    │
│  └─ schema.prisma        📊 Definición de tablas          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Navegación Rápida

Para encontrar algo específico:

| Busco... | Voy a... |
|----------|----------|
| Reglas de negocio | `dominio/entidades/` |
| Validaciones de objetos | `dominio/value-objects/` |
| Casos de uso | `aplicacion/casos-uso/` |
| Validación de entrada | `aplicacion/dto/` |
| Queries a BD | `infraestructura/persistencia/` |
| Endpoints REST | `infraestructura/http/` |
| Tests | Archivo `*.spec.ts` al lado del código |

---

**🎯 Esta estructura garantiza código limpio, mantenible y escalable!**
