# 🏗️ Arquitectura Hexagonal + DDD

## Filosofía: Ports & Adapters

Este backend implementa **Arquitectura Hexagonal** (también conocida como Ports & Adapters) combinada con **Domain-Driven Design (DDD)**.

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                          │
│                      (ADAPTERS)                             │
│                                                             │
│  ┌──────────────┐              ┌──────────────┐           │
│  │   HTTP API   │              │   Prisma DB  │           │
│  │ (Controller) │              │ (Repository) │           │
│  └──────┬───────┘              └──────┬───────┘           │
│         │                             │                    │
└─────────┼─────────────────────────────┼────────────────────┘
          │                             │
          │         ┌───────────────────┘
          │         │
┌─────────▼─────────▼─────────────────────────────────────────┐
│                    APLICACIÓN                               │
│                   (USE CASES)                               │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │  CrearProducto  │  ActualizarProducto       │          │
│  │  ObtenerProductos │  EliminarProducto       │          │
│  └──────────────────────────────────────────────┘          │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      DOMINIO                                │
│                   (CORE BUSINESS)                           │
│                                                             │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐        │
│  │ Entidades  │  │ Value Objects│  │ Repositorios│        │
│  │  Producto  │  │    Precio    │  │ (Interface) │        │
│  └────────────┘  └──────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de un Módulo

Cada módulo de dominio (Productos, Usuarios, Pedidos) sigue esta estructura:

```
src/productos/
│
├── dominio/                        # CAPA DE DOMINIO (CORE)
│   ├── entidades/                  # Lógica de negocio pura
│   │   └── producto.entidad.ts     # Producto con sus reglas
│   ├── value-objects/              # Objetos de valor inmutables
│   │   └── precio.vo.ts            # Precio con validaciones
│   ├── repositorios/               # Interfaces (PORTS)
│   │   └── producto.repositorio.interface.ts
│   └── servicios/                  # Servicios de dominio (opcional)
│
├── aplicacion/                     # CAPA DE APLICACIÓN (USE CASES)
│   ├── casos-uso/                  # Casos de uso del negocio
│   │   ├── crear-producto.use-case.ts
│   │   ├── obtener-productos.use-case.ts
│   │   └── ...
│   └── dto/                        # DTOs de entrada/salida
│       ├── crear-producto.dto.ts
│       └── producto-response.dto.ts
│
├── infraestructura/                # CAPA DE INFRAESTRUCTURA (ADAPTERS)
│   ├── persistencia/               # Implementación repositorios
│   │   └── producto.repositorio.prisma.ts  # ADAPTER para Prisma
│   ├── http/                       # Controladores REST
│   │   ├── productos.controller.ts # ADAPTER para HTTP
│   │   └── mappers/
│   │       └── producto.mapper.ts
│   └── eventos/                    # Event handlers (opcional)
│
└── productos.module.ts             # Módulo NestJS
```

---

## 🎯 Responsabilidades por Capa

### 1. DOMINIO (Core Business Logic)

**Responsabilidad**: Contiene las reglas de negocio puras

**Características**:
- ❌ NO tiene dependencias externas
- ❌ NO conoce la base de datos
- ❌ NO conoce HTTP
- ✅ Solo lógica de negocio pura
- ✅ 100% testeable sin mocks

**Ejemplo**:
```typescript
// producto.entidad.ts
export class Producto {
  public reducirStock(cantidad: number): void {
    if (this.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= cantidad;
  }
}
```

---

### 2. APLICACIÓN (Use Cases)

**Responsabilidad**: Orquesta la lógica de negocio

**Características**:
- ✅ Define casos de uso específicos
- ✅ Coordina entre dominio e infraestructura
- ✅ Usa interfaces (PORTS) del dominio
- ❌ NO implementa detalles técnicos

**Ejemplo**:
```typescript
// crear-producto.use-case.ts
@Injectable()
export class CrearProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORIO) // Usa la interface
    private readonly repo: IProductoRepositorio,
  ) {}

  async ejecutar(dto: CrearProductoDto): Promise<Producto> {
    // Lógica de aplicación
    const producto = Producto.crear(...);
    return await this.repo.guardar(producto);
  }
}
```

---

### 3. INFRAESTRUCTURA (Adapters)

**Responsabilidad**: Implementa detalles técnicos

**Características**:
- ✅ Implementa interfaces del dominio
- ✅ Maneja base de datos (Prisma)
- ✅ Maneja HTTP (Controllers)
- ✅ Maneja eventos externos
- ❌ NO contiene lógica de negocio

**Ejemplo**:
```typescript
// producto.repositorio.prisma.ts
@Injectable()
export class ProductoRepositorioPrisma implements IProductoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(producto: Producto): Promise<Producto> {
    const data = this.mapearAPrisma(producto);
    const resultado = await this.prisma.producto.create({ data });
    return this.mapearAEntidad(resultado);
  }
}
```

---

## 🔌 PORTS & ADAPTERS

### PORTS (Interfaces)

Los **PORTS** son interfaces que definen contratos:

```typescript
// Puerto de entrada (Driving Port)
export interface IProductoRepositorio {
  guardar(producto: Producto): Promise<Producto>;
  buscarPorId(id: string): Promise<Producto | null>;
  // ...
}
```

### ADAPTERS (Implementaciones)

Los **ADAPTERS** implementan los ports:

```typescript
// Adapter de salida (Driven Adapter)
@Injectable()
export class ProductoRepositorioPrisma implements IProductoRepositorio {
  // Implementación usando Prisma
}

// Adapter de entrada (Driving Adapter)
@Controller('productos')
export class ProductosController {
  // Expone HTTP API usando los use cases
}
```

---

## 🎭 Patrones Implementados

### 1. Dependency Inversion Principle

Las capas superiores dependen de abstracciones (interfaces), no de implementaciones concretas.

```typescript
// ✅ Correcto
constructor(
  @Inject(PRODUCTO_REPOSITORIO)
  private readonly repo: IProductoRepositorio,  // Interface
) {}

// ❌ Incorrecto
constructor(
  private readonly repo: ProductoRepositorioPrisma,  // Implementación
) {}
```

### 2. Single Responsibility Principle

Cada clase tiene una única responsabilidad:

- **Entidad**: Lógica de negocio
- **Use Case**: Orquestación
- **Repository**: Persistencia
- **Controller**: HTTP

### 3. Open/Closed Principle

Abierto para extensión, cerrado para modificación:

```typescript
// Puedes agregar nuevos repositorios sin cambiar el dominio
export class ProductoRepositorioMongoDB implements IProductoRepositorio {
  // Nueva implementación
}
```

---

## 🧪 Testing Strategy

### Tests de Dominio (Unitarios)
```typescript
describe('Producto', () => {
  it('debe reducir stock correctamente', () => {
    const producto = new Producto(...);
    producto.reducirStock(5);
    expect(producto.stock).toBe(5);
  });
});
```

### Tests de Use Cases (Integración)
```typescript
describe('CrearProductoUseCase', () => {
  it('debe crear un producto', async () => {
    const mockRepo = { guardar: jest.fn() };
    const useCase = new CrearProductoUseCase(mockRepo);
    // ...
  });
});
```

### Tests de Controllers (E2E)
```typescript
describe('ProductosController (e2e)', () => {
  it('POST /productos', () => {
    return request(app.getHttpServer())
      .post('/productos')
      .expect(201);
  });
});
```

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear un Producto

```
1. Cliente HTTP
   ↓
2. ProductosController (HTTP Adapter)
   - Valida DTO con class-validator
   ↓
3. CrearProductoUseCase (Application)
   - Orquesta la lógica
   ↓
4. Producto (Domain Entity)
   - Valida reglas de negocio
   ↓
5. IProductoRepositorio (Port/Interface)
   - Contrato abstracto
   ↓
6. ProductoRepositorioPrisma (Adapter)
   - Implementación con Prisma
   ↓
7. Base de Datos PostgreSQL
```

---

## 🚀 Ventajas de esta Arquitectura

### ✅ Independencia de Frameworks
El dominio no depende de NestJS, Prisma, ni ningún framework.

### ✅ Testeable
Cada capa se puede testear independientemente.

### ✅ Escalable
Fácil agregar nuevas features sin afectar las existentes.

### ✅ Mantenible
Código organizado y fácil de entender.

### ✅ Flexible
Cambiar de base de datos es trivial (solo cambias el adapter).

---

## 📦 Dependency Injection en NestJS

NestJS maneja la inyección de dependencias automáticamente:

```typescript
@Module({
  providers: [
    // Use Cases
    CrearProductoUseCase,
    
    // Repository (mapea interface a implementación)
    {
      provide: PRODUCTO_REPOSITORIO,  // Token
      useClass: ProductoRepositorioPrisma,  // Implementación
    },
  ],
})
export class ProductosModule {}
```

---

## 🎓 Domain-Driven Design (DDD)

### Bounded Contexts

Cada módulo representa un **Bounded Context**:
- `productos/` - Contexto de catálogo
- `usuarios/` - Contexto de identidad
- `pedidos/` - Contexto de ventas
- `pagos/` - Contexto de pagos

### Aggregates

Las **Entidades** son los **Aggregates** del dominio:
- `Producto` - Aggregate root del catálogo
- `Usuario` - Aggregate root de identidad
- `Pedido` - Aggregate root de ventas

### Value Objects

Conceptos sin identidad propia:
- `Precio` - Valor monetario
- `Email` - Dirección de correo
- `Direccion` - Dirección postal

---

## 📚 Referencias

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Esta arquitectura garantiza código limpio, mantenible y escalable a nivel enterprise.**
