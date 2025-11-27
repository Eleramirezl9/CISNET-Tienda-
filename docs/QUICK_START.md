# 🚀 Quick Start Guide

Guía rápida para empezar a desarrollar en el proyecto.

## 1️⃣ Instalación Inicial (Primera vez)

```bash
# 1. Instalar pnpm globalmente (si no lo tienes)
npm install -g pnpm

# 2. Instalar dependencias
pnpm install

# 3. Instalar dependencias del backend
cd backend
pnpm install
cd ..

# 4. Configurar variables de ambiente
# Copiar archivos de ejemplo
cp .env.example .env.local
cp backend/.env.example backend/.env.local

# 5. Editar .env.local con tus valores locales
```

## 2️⃣ Desarrollo Diario

**Terminal 1 - Frontend:**
```bash
pnpm run dev
# Se abrirá en http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd backend
pnpm run start:dev
# Escuchará en http://localhost:3001
```

## 3️⃣ Comandos Útiles

```bash
# Instalar paquete nuevo
pnpm add nombre-paquete

# Dev dependency
pnpm add -D nombre-paquete

# Eliminar paquete
pnpm remove nombre-paquete

# Ejecutar comando específico
pnpm dlx <comando>

# Prisma (Backend)
cd backend
pnpm dlx prisma migrate dev  # Crear migración
pnpm dlx prisma studio      # Abrir DB UI
```

## 4️⃣ Estructura del Proyecto

```
Tienda/
├── frontend/              # Next.js 14 App
├── backend/               # NestJS API
├── docs/                  # Documentación
├── .env.example           # Variables de ejemplo
├── .npmrc                 # Configuración pnpm
├── package.json           # Dependencias raíz
└── README.md              # Documentación principal
```

## 📚 Documentación

- **README.md** - Visión general del proyecto
- **/docs/MIGRACION_PNPM.md** - Guía completa de pnpm
- **/docs/** - Toda la documentación centralizada

## ⚠️ Importante

- **NO commits .env** - Usar .env.example como template
- **pnpm-lock.yaml** - Siempre commitear para reproducibilidad
- **node_modules/** - Ignorado en Git, se regenera con `pnpm install`

---

¿Preguntas? Consulta la documentación en `/docs` o revisa el README.md principal.
