# 🐳 Guía de Configuración de Docker para PostgreSQL

Esta guía te ayudará a levantar PostgreSQL usando Docker para el desarrollo local.

## 📋 Prerrequisitos

- **Docker Desktop** instalado y corriendo
  - Windows: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Verifica con: `docker --version`

## 🚀 Inicio Rápido

### 1. Levantar PostgreSQL con Docker

```bash
# Desde la raíz del proyecto
pnpm run docker:up
```

Este comando:
- ✅ Descarga la imagen de PostgreSQL 16 Alpine
- ✅ Crea un contenedor llamado `tienda-postgres`
- ✅ Expone el puerto 5432
- ✅ Crea la base de datos `tienda_ecommerce`
- ✅ Configura usuario: `postgres` / password: `postgres`
- ✅ Levanta pgAdmin en `http://localhost:5050` (opcional)

### 2. Ejecutar las Migraciones de Prisma

```bash
# Crear las tablas en la base de datos
pnpm run db:push
```

**O si quieres crear una migración con nombre:**

```bash
pnpm run db:migrate
# Te pedirá un nombre, ejemplo: "init"
```

### 3. Verificar que todo funciona

```bash
# Ver los logs de PostgreSQL
pnpm run docker:logs

# Deberías ver algo como:
# ✅ database system is ready to accept connections
```

### 4. Levantar el Backend

```bash
# En una nueva terminal
pnpm run dev:backend

# Deberías ver:
# ✅ Base de datos conectada
# 🚀 Aplicación corriendo en http://localhost:3001
```

## 🛠️ Comandos Útiles

### Docker

```bash
# Levantar contenedores
pnpm run docker:up

# Detener contenedores
pnpm run docker:down

# Ver logs de PostgreSQL en tiempo real
pnpm run docker:logs

# Reiniciar todo (borra los datos)
pnpm run docker:reset
```

### Base de Datos (Prisma)

```bash
# Aplicar cambios del schema a la DB (rápido, para desarrollo)
pnpm run db:push

# Crear una migración (para producción)
pnpm run db:migrate

# Abrir Prisma Studio (interfaz visual de la DB)
pnpm run db:studio

# Reiniciar la DB (borra todo y vuelve a crear)
pnpm run db:reset

# Llenar con datos de prueba (cuando esté configurado)
pnpm run db:seed
```

### Stack Completo

```bash
# Levantar Frontend + Backend simultáneamente
pnpm run dev:all
```

## 🎯 pgAdmin - Interfaz Gráfica

Si quieres ver la base de datos visualmente:

1. Abre: `http://localhost:5050`
2. Login:
   - Email: `admin@tienda.com`
   - Password: `admin123`
3. Agregar servidor:
   - Host: `postgres` (nombre del contenedor)
   - Port: `5432`
   - Database: `tienda_ecommerce`
   - Username: `postgres`
   - Password: `postgres`

## 🔍 Verificar Conexión

### Desde la terminal de Docker:

```bash
docker exec -it tienda-postgres psql -U postgres -d tienda_ecommerce
```

Comandos útiles de PostgreSQL:
```sql
-- Ver todas las tablas
\dt

-- Ver estructura de una tabla
\d productos

-- Ver todos los productos
SELECT * FROM productos;

-- Salir
\q
```

## 🐛 Troubleshooting

### Error: "puerto 5432 ya está en uso"

Ya tienes PostgreSQL corriendo localmente. Opciones:

1. **Detener tu PostgreSQL local**
   ```bash
   # Windows (en PowerShell como admin)
   Stop-Service postgresql-x64-XX
   ```

2. **Cambiar el puerto en docker-compose.yml**
   ```yaml
   ports:
     - '5433:5432'  # Usa 5433 en lugar de 5432
   ```
   Y actualiza el `.env`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tienda_ecommerce"
   ```

### Error: "Cannot connect to Docker daemon"

Docker Desktop no está corriendo. Ábrelo desde el menú de inicio.

### Error: "prisma command not found"

```bash
pnpm install
```

## 🗂️ Estructura de Archivos Creados

```
Tienda/
├── docker-compose.yml          # ← Configuración de Docker
├── backend/
│   ├── .env                    # ← Variables de entorno (DB_URL)
│   └── prisma/
│       ├── schema.prisma       # ← Esquema de la base de datos
│       └── init.sql            # ← Script de inicialización
└── DOCKER_SETUP.md             # ← Esta guía
```

## 📚 Próximos Pasos

1. ✅ Levantar Docker: `pnpm run docker:up`
2. ✅ Aplicar schema: `pnpm run db:push`
3. ✅ Verificar conexión
4. ✅ Levantar backend: `pnpm run dev:backend`
5. 🚀 Empezar a desarrollar

---

**¿Listo para empezar?** Ejecuta:

```bash
pnpm run docker:up && pnpm run db:push && pnpm run dev:backend
```
