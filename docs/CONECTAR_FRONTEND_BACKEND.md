# 🔗 Guía: Conectar Frontend con Backend

## 🎯 Objetivo

Hacer que el frontend (Next.js) consuma la API real del backend (NestJS) para mostrar productos reales desde la base de datos.

---

## 📋 Pre-requisitos

### 1. Backend corriendo
```bash
cd C:\Users\MARLON\Desktop\Tienda\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

✅ Deberías ver: `🚀 Servidor corriendo en http://localhost:3001`

### 2. Frontend corriendo
```bash
cd C:\Users\MARLON\Desktop\Tienda\frontend
npm install
npm run dev
```

✅ Deberías ver: `Ready on http://localhost:3000`

---

## 🔧 Pasos de Integración

### Paso 1: Verificar que el Backend Funcione

Abre en tu navegador o usa curl:

```bash
# Ver documentación Swagger
http://localhost:3001/api

# Listar productos (debería devolver array vacío o productos si los hay)
curl http://localhost:3001/api/productos
```

**Respuesta esperada**:
```json
{
  "productos": [],
  "total": 0,
  "pagina": 1,
  "limite": 20,
  "totalPaginas": 0
}
```

---

### Paso 2: Crear Productos de Prueba

Usa Swagger o curl para crear productos:

```bash
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alto rendimiento con procesador Intel i7 y 16GB RAM",
    "slug": "laptop-dell-xps-15",
    "precio": 12500,
    "precioAnterior": 15000,
    "stock": 5,
    "imagenPrincipal": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    "categoriaId": "123e4567-e89b-12d3-a456-426614174000",
    "categoria": "Computadoras",
    "etiquetas": ["laptop", "dell", "gaming"],
    "caracteristicas": {
      "procesador": "Intel i7",
      "ram": "16GB",
      "almacenamiento": "512GB SSD"
    },
    "destacado": true
  }'
```

Crea 2-3 productos más para tener datos.

---

### Paso 3: Actualizar el Frontend

El frontend ya está preparado para consumir el backend. Solo necesitas verificar la configuración.

#### 3.1 Verificar `.env.local` en Frontend

**Archivo**: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 3.2 El archivo `api-client.ts` ya está configurado

**Archivo**: `frontend/src/compartido/lib/api-client.ts`

Ya está listo para usar. Usa la variable `NEXT_PUBLIC_API_URL`.

#### 3.3 El servicio de productos ya usa el API Client

**Archivo**: `frontend/src/caracteristicas/catalogo-productos/infraestructura/productos.service.ts`

Ya implementado con Server Actions. ✅

---

### Paso 4: Usar Datos Reales en la Página

**Archivo a modificar**: `frontend/src/app/productos/page.tsx`

**ANTES** (con datos mock):
```typescript
const productosEjemplo: Producto[] = [
  // ... datos hardcodeados
];

export default function ProductosPage() {
  return (
    <ProductosGrid productos={productosEjemplo} />
  );
}
```

**DESPUÉS** (con datos reales):
```typescript
import { obtenerProductos } from '@/caracteristicas/catalogo-productos';

export default async function ProductosPage() {
  // Obtener productos reales del backend
  const resultado = await obtenerProductos({
    disponibles: true,
    limite: 20,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
          <p className="mt-2 text-gray-600">
            {resultado.total} productos disponibles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProductosGrid productos={resultado.productos} />
      </div>
    </main>
  );
}
```

---

### Paso 5: Probar la Integración

1. Asegúrate de que ambos servidores estén corriendo:
   - Backend: http://localhost:3001
   - Frontend: http://localhost:3000

2. Abre en el navegador:
   ```
   http://localhost:3000/productos
   ```

3. Deberías ver:
   - ✅ Los productos que creaste en el backend
   - ✅ Imágenes reales (de Unsplash)
   - ✅ Precios formateados en GTQ
   - ✅ Badges de descuento funcionando
   - ✅ Indicadores de stock

---

## 🐛 Troubleshooting

### Error: CORS

Si ves errores de CORS en la consola:

**Solución**: Verifica en `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

Y en `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

### Error: Cannot connect to backend

**Verifica**:
1. Backend está corriendo en puerto 3001
2. Frontend tiene `NEXT_PUBLIC_API_URL=http://localhost:3001/api` en `.env.local`
3. No hay firewall bloqueando

### Error: No products found

**Solución**: Crea productos usando Swagger o curl (ver Paso 2)

### Imágenes no cargan

**Solución**: Agrega el dominio en `frontend/next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
},
```

---

## 📊 Flujo Completo

```
┌──────────────────────────────────────────────────────────┐
│                    NAVEGADOR                             │
│              http://localhost:3000/productos             │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│                FRONTEND (Next.js)                        │
│                                                          │
│  app/productos/page.tsx (Server Component)              │
│         ↓                                                │
│  obtenerProductos() (Server Action)                     │
│         ↓                                                │
│  apiClient.get('/productos')                            │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ HTTP Request
                         ↓
┌──────────────────────────────────────────────────────────┐
│            BACKEND (NestJS) - Port 3001                  │
│                                                          │
│  ProductosController                                     │
│         ↓                                                │
│  ObtenerProductosUseCase                                │
│         ↓                                                │
│  ProductoRepositorioPrisma                              │
│         ↓                                                │
│  Prisma Client                                          │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│              BASE DE DATOS (PostgreSQL)                  │
│                                                          │
│  SELECT * FROM productos WHERE activo = true             │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Verificación Final

Una vez conectado, deberías poder:

- ✅ Ver productos reales del backend
- ✅ Los productos tienen datos de la base de datos
- ✅ Las imágenes cargan correctamente
- ✅ Los precios se formatean en GTQ
- ✅ Los badges de descuento se calculan automáticamente
- ✅ El stock se muestra correctamente
- ✅ Agregar al carrito funciona (frontend only por ahora)

---

## 🎯 Próximos Pasos

### 1. Crear Página de Detalle
```
frontend/src/app/productos/[slug]/page.tsx
```

Usa:
```typescript
const producto = await obtenerProductoPorSlug(params.slug);
```

### 2. Implementar Búsqueda
```typescript
const resultado = await obtenerProductos({
  busqueda: searchTerm,
});
```

### 3. Agregar Filtros
```typescript
const resultado = await obtenerProductos({
  categoriaId: selectedCategory,
  precioMin: minPrice,
  precioMax: maxPrice,
});
```

### 4. Integrar Carrito con Backend
Crear endpoints para guardar el carrito en el backend (próximo).

---

## 📚 Recursos Útiles

- **Swagger UI**: http://localhost:3001/api
- **Prisma Studio**: `npx prisma studio` (puerto 5555)
- **Frontend**: http://localhost:3000
- **Backend Logs**: Consola donde corre `npm run start:dev`

---

## 🎉 ¡Listo!

Ahora tienes un **Full Stack E-commerce** completamente funcional con:

✅ Frontend consumiendo API real  
✅ Backend sirviendo datos desde PostgreSQL  
✅ Arquitectura enterprise-grade  
✅ TypeScript end-to-end  
✅ Documentación completa  

**¡Empieza a construir! 🚀**
