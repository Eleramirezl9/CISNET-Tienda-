# Componentes Compartidos

Componentes reutilizables del sistema con diseño minimalista premium.

## ImageUpload

Componente de carga de imágenes con drag-and-drop.

**Ubicación:** `compartido/componentes/ImageUpload.tsx`

### Características
- ✅ Drag & drop de archivos
- ✅ Preview de imagen antes de subir
- ✅ Validación de tipos (JPG, PNG, WEBP)
- ✅ Límite de tamaño (5MB)
- ✅ Diseño premium minimalista
- ✅ Estados de hover y disabled
- ✅ Opción de remover imagen

### Uso

```tsx
import { ImageUpload } from '@/compartido/componentes/ImageUpload';

function MiFormulario() {
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState<string>('');

  return (
    <ImageUpload
      value={imagenUrl}
      onChange={setImagen}
      disabled={false}
    />
  );
}
```

### Props

```typescript
interface ImageUploadProps {
  value: string | null;      // URL de imagen actual (para preview)
  onChange: (file: File | null) => void;  // Callback al seleccionar archivo
  disabled?: boolean;        // Deshabilitar el componente
}
```

### Validaciones

- **Tipos permitidos**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Tamaño máximo**: 5MB
- **Cantidad**: 1 archivo a la vez

### Estilo

El componente usa:
- Tailwind CSS con palette zinc
- Iconos de lucide-react
- Transiciones suaves
- Feedback visual en todos los estados

---

## ProductImage

Componente para mostrar imágenes de productos optimizadas.

**Ubicación:** `caracteristicas/productos/componentes/ProductImage.tsx`

### Características
- ✅ Optimización automática con Next.js Image
- ✅ Aspect ratio cuadrado (1:1)
- ✅ Hover zoom effect
- ✅ Lazy loading
- ✅ Responsive sizes
- ✅ Soporte para prioridad (LCP)

### Uso

```tsx
import { ProductImage } from '@/caracteristicas/productos/componentes/ProductImage';

function ProductCard({ producto }) {
  return (
    <ProductImage
      src={producto.imagenPrincipal}
      alt={producto.nombre}
      priority={false}
    />
  );
}
```

### Props

```typescript
interface ProductImageProps {
  src: string;               // URL de la imagen (Cloudinary)
  alt: string;               // Texto alternativo
  className?: string;        // Clases CSS adicionales
  priority?: boolean;        // Prioridad de carga (para LCP)
}
```

### Optimizaciones

- **Sizes**: Responsive breakpoints automáticos
  - Mobile: 100vw
  - Tablet: 50vw
  - Desktop: 33vw
- **Fill**: Usa object-fit: cover
- **Formato**: Next.js elige automáticamente WebP cuando es posible

---

## Configuración Next.js

Las imágenes de Cloudinary están configuradas en `next.config.js`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
}
```

## Flujo de Upload

1. Usuario selecciona/arrastra imagen → `ImageUpload`
2. Preview local (ObjectURL) → Mostrar en UI
3. Submit del formulario → Enviar File en FormData
4. Backend procesa → Sube a Cloudinary
5. Respuesta con URL → Guardar en DB
6. Mostrar imagen → `ProductImage` con URL de Cloudinary

## Mejores Prácticas

### Performance
- Usar `priority={true}` solo para imágenes above-the-fold
- Dejar lazy loading por defecto para el resto
- Next.js optimiza automáticamente el formato y calidad

### Accesibilidad
- Siempre proporcionar `alt` descriptivo
- No usar decorativo como alt=""
- Mantener aspect ratio constante

### UX
- Mostrar preview inmediato al seleccionar
- Indicar progreso durante upload
- Manejar errores de forma clara
- Permitir remover/cambiar imagen fácilmente
