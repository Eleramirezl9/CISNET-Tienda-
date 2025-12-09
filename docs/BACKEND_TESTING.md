# 🧪 Estrategia de Testing - Backend

## ⚡ El Poder de la Arquitectura Hexagonal para Testing

Gracias a la **Arquitectura Hexagonal**, puedes hacer tests **ultra-rápidos** sin base de datos usando **mocks**.

---

## 📊 Pirámide de Testing

```
        /\
       /  \
      / E2E \       ← Pocos, lentos, completos
     /______\
    /        \
   / Integración \  ← Algunos, medios
  /______________\
 /                \
/   Unitarios      \ ← Muchos, rápidos, específicos
/____________________\
```

---

## 🎯 Tipos de Tests en Tu Proyecto

### 1. Tests de Dominio (⚡ Ultra Rápidos)

**Qué testean**: Lógica de negocio pura  
**Velocidad**: ~5-10ms por test  
**Dependencias**: Ninguna  
**Cobertura objetivo**: 100%  

**Archivos creados**:
- ✅ `producto.entidad.spec.ts` - 20 tests
- ✅ `precio.vo.spec.ts` - 15 tests

**Ejemplo**:
```typescript
describe('Producto', () => {
  it('debe reducir el stock correctamente', () => {
    const producto = Producto.crear(/* ... */);
    
    producto.reducirStock(3);
    
    expect(producto.stock).toBe(7);
  });
});
```

**Por qué son rápidos**:
- ❌ NO usan base de datos
- ❌ NO usan mocks complicados
- ✅ Solo instancian clases JavaScript
- ✅ Son tests síncronos (mayormente)

---

### 2. Tests de Use Cases (⚡ Muy Rápidos con Mocks)

**Qué testean**: Lógica de aplicación y coordinación  
**Velocidad**: ~15-30ms por test  
**Dependencias**: Mocks del repositorio  
**Cobertura objetivo**: 90%+  

**Archivos creados**:
- ✅ `crear-producto.use-case.spec.ts` - 10 tests
- ✅ `obtener-productos.use-case.spec.ts` - 8 tests

**Ejemplo**:
```typescript
describe('CrearProductoUseCase', () => {
  let useCase: CrearProductoUseCase;
  let mockRepositorio: jest.Mocked<IProductoRepositorio>;

  beforeEach(() => {
    // Crear un MOCK del repositorio (sin BD real)
    mockRepositorio = {
      guardar: jest.fn(),
      buscarPorId: jest.fn(),
      existeSlug: jest.fn(),
      // ...
    };

    useCase = new CrearProductoUseCase(mockRepositorio);
  });

  it('debe crear un producto exitosamente', async () => {
    // Arrange
    mockRepositorio.existeSlug.mockResolvedValue(false);
    mockRepositorio.guardar.mockImplementation(p => Promise.resolve(p));

    // Act
    const resultado = await useCase.ejecutar(dto);

    // Assert
    expect(resultado).toBeDefined();
    expect(mockRepositorio.guardar).toHaveBeenCalledTimes(1);
  });
});
```

**Por qué son rápidos**:
- ✅ Usan mocks en lugar de base de datos real
- ✅ No requieren setup/teardown de BD
- ✅ Son independientes entre sí

---

### 3. Tests de Integración (🐌 Lentos con BD Real)

**Qué testean**: Integración con base de datos real  
**Velocidad**: ~200-500ms por test  
**Dependencias**: PostgreSQL de prueba  
**Cobertura objetivo**: 70%+  

**Ejemplo** (próximo a implementar):
```typescript
describe('ProductoRepositorioPrisma (Integración)', () => {
  let prisma: PrismaClient;
  let repo: ProductoRepositorioPrisma;

  beforeAll(async () => {
    // Conectar a BD de prueba
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL_TEST } }
    });
    repo = new ProductoRepositorioPrisma(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe guardar un producto en la BD real', async () => {
    const producto = Producto.crear(/* ... */);
    
    const resultado = await repo.guardar(producto);
    
    expect(resultado.id).toBeDefined();
    
    // Limpiar
    await prisma.producto.delete({ where: { id: resultado.id } });
  });
});
```

---

### 4. Tests E2E (🐌 Muy Lentos)

**Qué testean**: Flujo completo de la aplicación  
**Velocidad**: ~1-3 segundos por test  
**Dependencias**: Servidor completo + BD  
**Cobertura objetivo**: 50%+  

**Ejemplo** (próximo a implementar):
```typescript
describe('ProductosController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /api/productos debe retornar productos', () => {
    return request(app.getHttpServer())
      .get('/api/productos')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('productos');
        expect(Array.isArray(res.body.productos)).toBe(true);
      });
  });
});
```

---

## 📈 Comparación de Velocidad

```
┌─────────────────────┬──────────┬───────────────┬─────────────┐
│ Tipo de Test        │ Cantidad │ Tiempo/Test   │ Total       │
├─────────────────────┼──────────┼───────────────┼─────────────┤
│ Dominio             │   35     │  ~5-10ms      │  ~350ms     │
│ Use Cases (mocks)   │   18     │  ~15-30ms     │  ~540ms     │
│ Integración (BD)    │   10     │  ~200-500ms   │  ~3.5s      │
│ E2E                 │    5     │  ~1-3s        │  ~10s       │
├─────────────────────┼──────────┼───────────────┼─────────────┤
│ TOTAL               │   68     │               │  ~14.4s     │
└─────────────────────┴──────────┴───────────────┴─────────────┘
```

**Comparación sin Arquitectura Hexagonal**:
- ❌ Todos los tests usan BD real
- ❌ 68 tests × 500ms = **34 segundos**
- ❌ Más lento para el desarrollo

**Con Arquitectura Hexagonal** (tu proyecto):
- ✅ 53 tests sin BD (dominio + use cases)
- ✅ 15 tests con BD (integración + E2E)
- ✅ Total: **14.4 segundos**
- ✅ **57% más rápido!** ⚡

---

## 🚀 Ejecutar los Tests

### Todos los Tests
```bash
npm run test
```

### Tests en Watch Mode (desarrollo)
```bash
npm run test:watch
```

### Solo tests de un archivo
```bash
npm run test producto.entidad.spec.ts
```

### Con Coverage
```bash
npm run test:cov
```

### Solo tests unitarios (rápidos)
```bash
npm run test -- --testPathPattern="(entidad|vo)\\.spec\\.ts$"
```

---

## 📁 Estructura de Tests

```
src/productos/
├── dominio/
│   ├── entidades/
│   │   ├── producto.entidad.ts
│   │   └── producto.entidad.spec.ts     ✅ 20 tests
│   └── value-objects/
│       ├── precio.vo.ts
│       └── precio.vo.spec.ts            ✅ 15 tests
│
├── aplicacion/
│   └── casos-uso/
│       ├── crear-producto.use-case.ts
│       ├── crear-producto.use-case.spec.ts     ✅ 10 tests
│       ├── obtener-productos.use-case.ts
│       └── obtener-productos.use-case.spec.ts  ✅ 8 tests
│
└── infraestructura/
    ├── persistencia/
    │   ├── producto.repositorio.prisma.ts
    │   └── producto.repositorio.prisma.spec.ts  ⏳ Próximo
    └── http/
        ├── productos.controller.ts
        └── productos.controller.spec.ts         ⏳ Próximo
```

---

## 📝 Convenciones de Testing

### Nomenclatura
```typescript
// ✅ CORRECTO
describe('Producto', () => {
  describe('Creación', () => {
    it('debe crear un producto válido', () => { });
  });
});

// ❌ INCORRECTO
describe('producto tests', () => {
  it('test 1', () => { });
});
```

### Estructura AAA (Arrange-Act-Assert)
```typescript
it('debe reducir el stock', () => {
  // Arrange (Preparar)
  const producto = Producto.crear(/* ... */);
  
  // Act (Actuar)
  producto.reducirStock(3);
  
  // Assert (Verificar)
  expect(producto.stock).toBe(7);
});
```

### Tests Independientes
```typescript
// ✅ CORRECTO - Cada test crea su propia data
it('test 1', () => {
  const producto = crearProducto();
  // test...
});

it('test 2', () => {
  const producto = crearProducto();
  // test...
});

// ❌ INCORRECTO - Tests comparten estado
let producto;
beforeAll(() => {
  producto = crearProducto();
});
```

---

## 🎯 Qué Testear en Cada Capa

### Dominio
- ✅ Validaciones de reglas de negocio
- ✅ Cálculos y operaciones
- ✅ Estados y transiciones
- ✅ Value Objects

**Ejemplo**:
```typescript
// ✅ Testear reglas de negocio
it('debe lanzar error si el stock es negativo', () => {
  expect(() => {
    Producto.crear(/* ... */, -5, /* ... */);
  }).toThrow('El stock no puede ser negativo');
});
```

### Use Cases
- ✅ Flujo completo del caso de uso
- ✅ Validaciones de lógica de aplicación
- ✅ Interacción con repositorios (mocked)
- ✅ Manejo de errores

**Ejemplo**:
```typescript
// ✅ Testear el flujo completo
it('debe crear un producto exitosamente', async () => {
  mockRepositorio.existeSlug.mockResolvedValue(false);
  mockRepositorio.guardar.mockImplementation(p => Promise.resolve(p));
  
  const resultado = await useCase.ejecutar(dto);
  
  expect(resultado).toBeDefined();
  expect(mockRepositorio.guardar).toHaveBeenCalled();
});
```

### Infraestructura
- ✅ Integración con base de datos
- ✅ Mapeo de datos
- ✅ Queries complejas

### Controllers
- ✅ Validación de DTOs
- ✅ Códigos de respuesta HTTP
- ✅ Serialización de respuestas

---

## 🛠️ Herramientas de Testing

### Jest (Configurado)
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### Scripts Disponibles
```bash
npm run test              # Ejecutar todos los tests
npm run test:watch        # Watch mode
npm run test:cov          # Con coverage
npm run test:debug        # Debug mode
npm run test:e2e          # Solo E2E
```

---

## 📊 Objetivo de Coverage

```
┌─────────────────┬──────────┐
│ Capa            │ Coverage │
├─────────────────┼──────────┤
│ Dominio         │   100%   │
│ Aplicación      │    90%   │
│ Infraestructura │    70%   │
│ Controllers     │    80%   │
├─────────────────┼──────────┤
│ TOTAL           │  85%+    │
└─────────────────┴──────────┘
```

---

## 💡 Mejores Prácticas

### 1. Tests Rápidos Primero
Escribe primero tests de dominio y use cases (sin BD).

### 2. Un Concepto por Test
```typescript
// ✅ CORRECTO
it('debe crear un producto válido', () => { });
it('debe validar que el nombre no esté vacío', () => { });

// ❌ INCORRECTO
it('debe crear un producto y validar todo', () => { });
```

### 3. Usa Helpers para Crear Data
```typescript
// Helper
const crearProductoValido = (overrides = {}) => {
  return Producto.crear(
    'uuid-123',
    'Laptop',
    'Descripción válida del producto',
    'laptop',
    Precio.desde(1000),
    10,
    'https://example.com/image.jpg',
    'cat-123',
    'Computadoras',
    ...overrides
  );
};

// Uso
it('test', () => {
  const producto = crearProductoValido({ stock: 5 });
});
```

### 4. Mocks Simples
```typescript
// ✅ CORRECTO - Mock simple
const mockRepo = {
  guardar: jest.fn().mockResolvedValue(producto),
};

// ❌ INCORRECTO - Mock complicado innecesario
const mockRepo = {
  guardar: jest.fn().mockImplementation(async (p) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return p;
  }),
};
```

---

## 🎓 Aprende Más

### Recursos
- [Jest Documentation](https://jestjs.io/)
- [Testing NestJS](https://docs.nestjs.com/fundamentals/testing)
- [Hexagonal Architecture Testing](https://herbertograca.com/2017/09/28/ports-adapters-architecture/)

---

## ✅ Tests Actuales Implementados

```
✅ producto.entidad.spec.ts        (20 tests) - ~200ms
✅ precio.vo.spec.ts                (15 tests) - ~75ms
✅ crear-producto.use-case.spec.ts  (10 tests) - ~300ms
✅ obtener-productos.use-case.spec.ts (8 tests) - ~240ms

Total: 53 tests en ~815ms ⚡

Próximos:
⏳ actualizar-producto.use-case.spec.ts
⏳ eliminar-producto.use-case.spec.ts
⏳ producto.repositorio.prisma.spec.ts (integración)
⏳ productos.controller.spec.ts (E2E)
```

---

## 🚀 Ejecuta Tus Tests Ahora

```bash
cd C:\Users\MARLON\Desktop\Tienda\backend

# Ejecutar todos los tests creados
npm run test

# Ver coverage
npm run test:cov
```

---

## 🎉 Ventajas de Esta Estrategia

✅ **Rapidez**: Tests de dominio corren en milisegundos  
✅ **Confiabilidad**: Tests independientes, no se afectan entre sí  
✅ **Mantenibilidad**: Fácil de entender y modificar  
✅ **Cobertura**: Alta cobertura sin sacrificar velocidad  
✅ **Feedback Rápido**: Detectas errores inmediatamente  
✅ **CI/CD Ready**: Perfectos para integración continua  

---

**¡Tests rápidos = Desarrollo rápido! ⚡**
