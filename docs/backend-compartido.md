# Módulo Compartido (Shared Kernel)

Este módulo contiene servicios y utilidades compartidas por todo el sistema siguiendo el patrón de Arquitectura Hexagonal.

## Estructura

```
compartido/
├── aplicacion/          # Capa de Aplicación
│   ├── decorators/      # Decoradores personalizados
│   └── filters/         # Filtros de excepciones
├── dominio/             # Capa de Dominio
│   ├── excepciones/     # Excepciones de negocio
│   └── value-objects/   # Objetos de valor compartidos
├── infraestructura/     # Capa de Infraestructura
│   ├── adaptadores/     # Implementaciones de puertos
│   └── prisma/          # Cliente de base de datos
├── puertos/             # Interfaces (Ports)
└── utilidades/          # Helpers y utilidades
```

## Puertos (Interfaces)

### `servicio-almacenamiento.port.ts`
Define el contrato para servicios de almacenamiento de archivos.

```typescript
export interface IServicioAlmacenamiento {
  subirImagen(archivo: Express.Multer.File, carpeta?: string): Promise<string>;
  eliminarImagen(idPublico: string): Promise<void>;
  extraerIdPublico(url: string): string;
}
```

**Token de inyección:**
```typescript
export const SERVICIO_ALMACENAMIENTO = Symbol('SERVICIO_ALMACENAMIENTO');
```

## Adaptadores (Implementaciones)

### `cloudinary.servicio.ts`
Implementación del servicio de almacenamiento usando Cloudinary.

**Características:**
- Upload usando `upload_stream` (compatible con serverless)
- Optimización automática de imágenes (1000x1000, quality:auto, webp)
- Organización en carpetas (`tienda/{carpeta}/`)
- Conversión de Buffer a Stream usando `streamifier`

**Uso:**
```typescript
constructor(
  @Inject(SERVICIO_ALMACENAMIENTO)
  private readonly servicioAlmacenamiento: IServicioAlmacenamiento,
) {}

// Subir imagen
const url = await this.servicioAlmacenamiento.subirImagen(archivo, 'productos');

// Eliminar imagen
const idPublico = this.servicioAlmacenamiento.extraerIdPublico(url);
await this.servicioAlmacenamiento.eliminarImagen(idPublico);
```

## Configuración

### Variables de Entorno
```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Registro del Servicio
El servicio está registrado globalmente en `compartido.module.ts`:

```typescript
@Global()
@Module({
  providers: [
    {
      provide: SERVICIO_ALMACENAMIENTO,
      useClass: CloudinaryServicio,
    },
  ],
  exports: [SERVICIO_ALMACENAMIENTO],
})
export class CompartidoModule {}
```

## Ventajas de esta Arquitectura

1. **Inversión de dependencias**: El dominio no depende de Cloudinary
2. **Fácil testing**: Se pueden crear mocks del puerto
3. **Intercambiable**: Cambiar de Cloudinary a S3 solo requiere un nuevo adaptador
4. **Reutilizable**: Cualquier módulo puede inyectar el servicio
5. **Serverless-ready**: Usa streams en memoria, no disco

## Seguridad

- ✅ Validación de tipos de archivo (JPG, PNG, WEBP)
- ✅ Límite de tamaño (5MB)
- ✅ Credenciales en variables de entorno
- ✅ URLs seguras (HTTPS)
- ✅ Transformaciones en servidor

## Ejemplo Completo

Ver `productos/infraestructura/http/productos.controller.ts` para un ejemplo de uso completo con:
- Upload de imágenes en creación
- Reemplazo de imágenes en actualización
- Eliminación de imágenes al borrar producto
