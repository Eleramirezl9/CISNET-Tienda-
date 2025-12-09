# 📦 Guía de Migración a pnpm

## Decisión Arquitectónica: Next.js 14 vs 15

### Recomendación: **Mantener Next.js 14** (Por ahora)

**Razones:**
- ✅ **Estabilidad**: Next.js 14 es LTS (Long Term Support) y está completamente estable
- ✅ **Compatibilidad**: Todas las librerías, componentes y herramientas funcionan perfectamente
- ✅ **Documentación**: Abundante documentación y ejemplos disponibles
- ⚠️ **Next.js 15**: Es muy reciente, algunos paquetes aún no están 100% optimizados
- 📅 **Upgrade futuro**: Podrás migrar a Next.js 15 en 6-12 meses cuando todo esté más maduro

**Plan**: Usa Next.js 14 ahora con pnpm, y planifica la migración a Next.js 15 cuando el ecosistema esté más establecido.

---

## ¿Qué es pnpm?

**pnpm** (Performant NPM) es un gestor de paquetes moderno que:

| Ventaja | Descripción |
|---------|------------|
| ⚡ **2-3x más rápido** | Instala dependencias mucho más rápido que npm/yarn |
| 💾 **Ahorra espacio** | Usa symlinks en lugar de duplicar archivos |
| 🔒 **Más seguro** | Evita "phantom dependencies" (dependencias fantasma) |
| 📦 **Monorepo ready** | Perfecto para proyectos con múltiples carpetas |

---

## Plan de Migración

### Fase 1: Preparación (5 min)

```bash
# 1. Instalar pnpm globalmente
npm install -g pnpm

# 2. Verificar instalación
pnpm --version
```

### Fase 2: Limpiar el Entorno (2 min)

```bash
# 1. Eliminar node_modules actuales (usa tu manejador de archivos)
# O desde PowerShell:
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "pnpm-lock.yaml" -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -ErrorAction SilentlyContinue
Remove-Item -Path "yarn.lock" -ErrorAction SilentlyContinue

# Hacer lo mismo en backend/
cd backend
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "pnpm-lock.yaml" -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -ErrorAction SilentlyContinue
cd ..
```

### Fase 3: Instalar con pnpm (3-5 min)

```bash
# 1. Instalar dependencias del proyecto raíz
pnpm install

# 2. Instalar dependencias del backend
cd backend
pnpm install
cd ..
```

### Fase 4: Verificar que Todo Funciona

```bash
# Frontend
pnpm run dev
# Debe abrir http://localhost:3000

# Backend (en otra terminal)
cd backend
pnpm run start:dev
# Debe escuchar en puerto 3001
```

---

## Comandos Migrados

### Antes (npm) → Después (pnpm)

```bash
# Instalar todo
npm install          →  pnpm install
npm ci               →  pnpm install --frozen-lockfile

# Instalar paquete
npm install express  →  pnpm add express

# Dev dependency
npm install -D vite  →  pnpm add -D vite

# Ejecutar scripts
npm run dev          →  pnpm run dev
npm run build        →  pnpm run build
npm run test         →  pnpm run test

# Ejecutar binarios (npx → pnpm dlx)
npx prisma init      →  pnpm dlx prisma init
npx create-next-app  →  pnpm dlx create-next-app
```

---

## Configuración de Despliegue

### Vercel (Frontend)

✅ **Automático**: Vercel detecta `pnpm-lock.yaml` automáticamente.

**Pasos:**
1. Sube el archivo `pnpm-lock.yaml` a GitHub
2. No necesitas cambiar configuración en Vercel
3. Vercel automáticamente usará pnpm

### Render (Backend)

⚙️ **Manual**: Render necesita configuración explícita.

**Pasos:**
1. Ve a **Settings** → **Build & Deploy**
2. Cambia **Build Command** a:
   ```bash
   npm install -g pnpm && pnpm install && pnpm run build
   ```
3. Cambia **Start Command** a:
   ```bash
   pnpm run start:prod
   ```
4. Guarda cambios

---

## Troubleshooting

### ❌ Error: "pnpm: command not found"

```bash
# Reinstala pnpm globalmente
npm install -g pnpm@latest

# Verifica
pnpm --version
```

### ❌ Error: "Cannot find module"

```bash
# Limpia y reinstala
pnpm store prune
pnpm install
```

### ❌ Prisma no funciona

```bash
# Regenera cliente Prisma
pnpm dlx prisma generate

# O migra la BD
pnpm dlx prisma migrate dev
```

### ❌ Diferencias entre desarrollo y producción

```bash
# Usa frozen-lockfile en producción
pnpm install --frozen-lockfile
```

---

## Checklist de Migración

- [ ] ✅ Instalar pnpm globalmente
- [ ] ✅ Eliminar node_modules antiguos
- [ ] ✅ Ejecutar `pnpm install` en raíz
- [ ] ✅ Ejecutar `pnpm install` en `/backend`
- [ ] ✅ Verificar `pnpm-lock.yaml` se creó
- [ ] ✅ Ejecutar `pnpm run dev` (frontend)
- [ ] ✅ Ejecutar `pnpm run start:dev` (backend)
- [ ] ✅ Subir `pnpm-lock.yaml` a Git
- [ ] ✅ Verificar despliegue en Vercel
- [ ] ✅ Actualizar Render (si es aplicable)

---

## Próximos Pasos

### Corto Plazo (Esta semana)
1. Completar migración a pnpm
2. Verificar que todo funciona localmente
3. Hacer commit con `pnpm-lock.yaml`

### Mediano Plazo (Este mes)
1. Monitorear que no haya conflictos con dependencias
2. Optimizar `node_modules` usando `pnpm prune`

### Largo Plazo (Próximos meses)
1. Evaluar migración a Next.js 15 (cuando sea stable)
2. Implementar monorepo más avanzado con `pnpm workspaces`

---

## Recursos

- 📚 [Documentación oficial de pnpm](https://pnpm.io/)
- 📖 [Next.js 14 con pnpm](https://nextjs.org/)
- 🎯 [NestJS con pnpm](https://docs.nestjs.com/)
- 🗂️ [pnpm Workspaces](https://pnpm.io/workspaces)

---

**Última actualización**: 25 de Noviembre de 2025
