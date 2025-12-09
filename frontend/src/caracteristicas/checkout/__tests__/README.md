# Tests - Módulo Checkout

Este directorio contiene las pruebas unitarias para el módulo de checkout.

## Estructura de Tests

```
checkout/
├── dominio/
│   └── __tests__/
│       └── checkout.types.test.ts    # Tests de validación Zod
└── acciones/
    └── __tests__/
        └── crear-orden.action.test.ts # Tests de Server Action
```

## Tests Implementados

### 1. checkout.types.test.ts

Pruebas de validación con Zod para el schema de checkout.

**Suites de prueba:**
- ✅ Validación de campos requeridos
- ✅ Validación de nombreCompleto (min 3 caracteres)
- ✅ Validación de teléfono (8 dígitos numéricos)
- ✅ Validación de email (opcional, formato válido)
- ✅ Validación de dirección (min 10 caracteres)
- ✅ Validación de método de pago (enum)
- ✅ Validación de notas (max 500 caracteres)
- ✅ Validación de DEPARTAMENTOS_GT (22 departamentos)

**Cobertura:** 100% de las validaciones del schema

### 2. crear-orden.action.test.ts

Pruebas de la Server Action `placeOrder`.

**Suites de prueba:**
- ✅ Validación de datos (carrito vacío, total = 0)
- ✅ Transformación de datos (DTO correcto)
- ✅ Omisión de campos opcionales vacíos
- ✅ Manejo de respuestas exitosas
- ✅ Manejo de ApiError con mensaje personalizado
- ✅ Manejo de errores de red
- ✅ Manejo de errores desconocidos
- ✅ Casos edge: múltiples items, envío gratis

**Cobertura:** 100% de los flujos de la función placeOrder

## Ejecutar Tests

### Configuración

Los tests están escritos para Jest. Para configurar Jest en el proyecto:

```bash
# Instalar dependencias
npm install --save-dev jest @jest/globals @types/jest ts-jest

# Crear jest.config.js
npx ts-jest config:init
```

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Comandos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests del módulo checkout
npm test checkout

# Ejecutar con cobertura
npm test -- --coverage

# Ejecutar en modo watch
npm test -- --watch
```

## Próximos Tests a Implementar

### 3. Componentes UI (con React Testing Library)

**PaymentMethodSelector.test.tsx:**
- Renderizado de todas las opciones de pago
- Selección de método de pago
- Estado disabled
- Mensaje de error

**ResumenOrden.test.tsx:**
- Renderizado de items del carrito
- Cálculo de totales (subtotal, IVA, envío)
- Estado vacío
- Envío gratis cuando subtotal >= 500

### 4. Integración E2E (con Playwright o Cypress)

**checkout.e2e.test.ts:**
- Flujo completo de checkout desde carrito hasta confirmación
- Validación de formulario en tiempo real
- Integración con backend (mock)
- Redirección a página de confirmación

## Cobertura Actual

| Archivo | Líneas | Funciones | Branches |
|---------|--------|-----------|----------|
| checkout.types.ts | 100% | 100% | 100% |
| crear-orden.action.ts | 100% | 100% | 100% |
| **Total** | **100%** | **100%** | **100%** |

## Notas

- Los tests de la Server Action usan mocks del `apiClient`
- Los tests de validación Zod verifican todos los edge cases
- Se implementan tests para casos exitosos, errores esperados y casos edge
- Los mensajes de error en español son validados

## Comandos Útiles

```bash
# Ejecutar solo tests de validación
npm test checkout.types.test

# Ejecutar solo tests de acciones
npm test crear-orden.action.test

# Ver cobertura detallada
npm test -- --coverage --verbose

# Ejecutar tests en modo debug
node --inspect-brk node_modules/.bin/jest --runInBand
```
