# 🛒 Tienda - Proyecto E-commerce

## 📋 Descripción General

Proyecto de e-commerce desarrollado con arquitectura de monorepo que integra:

- **Frontend**: Next.js 14 con TypeScript y Tailwind CSS
- **Backend**: NestJS con arquitectura hexagonal y Prisma ORM

---

## 📁 Estructura del Proyecto

```
Tienda/
├── frontend/                    # Aplicación Next.js
│   └── src/
│       ├── app/                # App router (Next.js 14+)
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── globals.css
│       │   └── productos/       # Módulo de productos
│       ├── caracteristicas/     # Features del frontend
│       │   ├── carrito-compras/
│       │   ├── catalogo-productos/
│       │   └── ...
│       ├── compartido/          # Código compartido
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── tipos/
│       │   └── ui/
│       └── design/              # Sistema de diseño
│           ├── fuentes/
│           └── tokens/
│
├── backend/                     # Aplicación NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── compartido/          # Módulo compartido
│   │   │   ├── aplicacion/
│   │   │   ├── dominio/
│   │   │   ├── infraestructura/
│   │   │   └── utilidades/
│   │   └── productos/           # Módulo de productos
│   ├── prisma/
│   │   └── schema.prisma        # Esquema de BD
│   └── package.json
│
├── docs/                        # Documentación del proyecto
│   ├── ARQUITECTURA.md
│   ├── ARQUITECTURA_RESUMEN_FINAL.txt
│   ├── CHECKLIST.md
│   ├── COMPLETADO.md
│   ├── CONECTAR_FRONTEND_BACKEND.md
│   ├── DESARROLLO.md
│   ├── EMPEZAR_AQUI.txt
│   ├── ESTRUCTURA_VISUAL.md
│   ├── PROYECTO_COMPLETO.md
│   ├── PROYECTO_FINAL.md
│   ├── RESUMEN_FINAL.md
│   ├── RESUMEN_VISUAL.txt
│   ├── SESION_COMPLETADA.md
│   ├── SIGUIENTE_PASO.md
│   └── guia completa de como lo quiero la estructuracion.txt
│
├── package.json                 # Dependencias del proyecto
├── tsconfig.json                # Configuración TypeScript
├── tailwind.config.ts           # Configuración Tailwind CSS
├── postcss.config.js            # Configuración PostCSS
├── next.config.js               # Configuración Next.js
├── components.json              # Configuración de componentes
└── node_modules/                # Dependencias instaladas
```

---

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- **pnpm 8.0+** (gestor de paquetes oficial)
- **Docker Desktop** (para la base de datos)

### 1. Instalar pnpm

```bash
npm install -g pnpm
pnpm --version
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Levantar PostgreSQL con Docker

```bash
pnpm run docker:up
```

### 4. Aplicar schema de base de datos

```bash
pnpm run db:push
```

### 5. Levantar el proyecto

```bash
# Todo junto (frontend + backend)
pnpm run dev:all

# O por separado:
pnpm run dev:frontend  # Puerto 3000
pnpm run dev:backend   # Puerto 3001
```

📖 **Guía completa:** Ver [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md)

### Build

```bash
# Compilar para producción (Frontend)
pnpm run build

# Backend
cd backend
pnpm run build
```

### Comandos Comunes con pnpm

```bash
# Instalar paquete nuevo
pnpm add nombre-paquete

# Instalar como dev dependency
pnpm add -D nombre-paquete

# Ejecutar comando con dlx (equivalente a npx)
pnpm dlx <comando>

# Remover paquete
pnpm remove nombre-paquete
```

---

## 📚 Documentación

Encuentra documentación detallada en la carpeta `/docs`:

| Archivo                      | Descripción                                    |
| ---------------------------- | ---------------------------------------------- |
| **[QUICK_START.md](docs/QUICK_START.md)**   | Guía rápida de inicio                          |
| **[DOCKER_SETUP.md](docs/DOCKER_SETUP.md)** | Configuración completa de Docker y PostgreSQL  |
| **[SECURITY.md](docs/SECURITY.md)**         | Guía de seguridad y mejores prácticas          |

---

## 🏗️ Arquitectura

### Frontend (Next.js)

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: Gestión de estado (a definir)
- **Características**:
  - Catálogo de productos
  - Carrito de compras
  - Sistema de diseño compartido

### Backend (NestJS)

- **Framework**: NestJS
- **Arquitectura**: Hexagonal
- **ORM**: Prisma
- **BD**: PostgreSQL (configurable)
- **Módulos**:
  - Productos
  - Compartido (utilidades, excepciones, decoradores, filtros)

---

## 📝 Características Principales

- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Sistema de autenticación
- ✅ API REST completa
- ✅ Base de datos relacional
- ✅ Validación de datos
- ✅ Manejo de excepciones
- ✅ Sistema de paginación

---

## 🔧 Tecnologías Utilizadas

**Frontend:**

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- PostCSS

**Backend:**

- NestJS
- Prisma
- PostgreSQL
- TypeScript

**Herramientas:**

- Node.js 18+
- pnpm 8.0+
- Git

---

## 📞 Contacto y Soporte

Para más información, consulta la documentación en `/docs` o revisa los archivos específicos de configuración.

---

**Última actualización**: 25 de Noviembre de 2025
