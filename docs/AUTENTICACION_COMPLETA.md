# Flujo de Autenticación Completo

## 📋 Resumen

Este documento explica cómo funciona el flujo de autenticación desde el frontend hasta el backend, incluyendo la protección del carrito y el manejo de tokens JWT.

## 🏗️ Arquitectura

```
Frontend (Next.js + Zustand)
├── useAuth Hook (Zustand store)
├── apiClient (Fetch + Token injection)
├── LoginPage (/login)
├── RegistroPage (/registro)
├── CarritoPage (/carrito) - PROTEGIDA
└── InitAuth (Inicializa sesión desde localStorage)

Backend (NestJS)
├── AutenticacionModule
├── AutenticacionServicio (Casos de uso)
├── AutenticacionControlador (Endpoints)
├── Passport Strategies (JWT, RT)
├── Guards (GuardJWT, GuardRoles)
└── Argon2 Hashing
```

## 🔑 Conceptos Clave

### 1. **Access Token (JWT)**
- **Duración**: 15 minutos
- **Almacenamiento**: `localStorage`
- **Envío**: Header `Authorization: Bearer <token>`
- **Uso**: Autenticar requests al API

### 2. **Refresh Token**
- **Duración**: 7 días
- **Almacenamiento**: Cookie HttpOnly + SameSite=Strict
- **Envío**: Automático en requests (cookies)
- **Uso**: Renovar access token cuando expira

### 3. **Usuario en Storage**
- **Almacenamiento**: `localStorage` (JSON stringificado)
- **Contiene**: `id`, `email`, `nombre`, `apellido`, `rol`, `activo`
- **Uso**: Mostrar info en UI sin hacer request al API

## 📱 Flujos Principales

### ✅ Flujo 1: Registro

```
Usuario → Formulario /registro
    ↓
useAuth.registrar(datos)
    ↓
apiClient.post('/auth/register', datos)
    ↓
Backend valida y crea usuario
    ↓
Respuesta: { accessToken, usuario }
    ↓
Frontend guarda en localStorage
    ↓
Zustand actualiza estado
    ↓
Redirige a / (auto porque estaAutenticado=true)
```

**Datos requeridos:**
```json
{
  "email": "usuario@ejemplo.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "password": "MiPassword123" // Min 8 chars, mayús, número
}
```

### ✅ Flujo 2: Login

```
Usuario → Formulario /login
    ↓
useAuth.login(email, password)
    ↓
apiClient.post('/auth/login', datos)
    ↓
Backend verifica credenciales
    ↓
Respuesta: { accessToken, usuario }
    ↓
RefreshToken enviado en cookie HttpOnly
    ↓
Frontend guarda accessToken en localStorage
    ↓
Zustand actualiza estado
    ↓
Redirige a returnUrl o / (login?returnUrl=/carrito)
```

### ✅ Flujo 3: Acceso al Carrito Protegido

```
Usuario (no autenticado) → Click en /carrito
    ↓
useAutenticacionRequerida() detecta !estaAutenticado
    ↓
Redirige a /login?returnUrl=/carrito
    ↓
Usuario completa login
    ↓
LoginPage detecta estaAutenticado=true
    ↓
router.push(returnUrl) → /carrito
    ↓
CarritoPage se carga protegido ✅
```

### ✅ Flujo 4: Renovación de Token (Auto)

```
Usuario hace request a API con accessToken expirado
    ↓
Backend responde 401 Unauthorized
    ↓
apiClient interceptor detecta 401
    ↓
Intenta POST /auth/refresh con cookie de RT
    ↓
Backend genera nuevo accessToken
    ↓
Frontend guarda nuevo token en localStorage
    ↓
Reintenta request original con nuevo token
    ↓
Request se completa exitosamente ✅
```

**Ventaja**: El usuario no se da cuenta, la renovación es transparente

### ✅ Flujo 5: Logout

```
Usuario → Click en Logout (futuro botón)
    ↓
useAuth.logout()
    ↓
apiClient.post('/auth/logout', {})
    ↓
Backend invalida refreshToken (si Prisma)
    ↓
Frontend limpia localStorage
    ↓
Zustand resetea estado
    ↓
Redirige a / (página pública)
```

## 🛠️ Endpoints del Backend

### POST /auth/register
Crear nuevo usuario.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "password": "MiPassword123"
  }'
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "email": "nuevo@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "activo": true
  }
}
```

---

### POST /auth/login
Iniciar sesión con email y contraseña.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123"
  }'
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "activo": true
  }
}
```

**Headers Response:**
```
Set-Cookie: refreshToken=eyJ...; HttpOnly; SameSite=Strict; Path=/api/auth; Max-Age=604800
```

---

### POST /auth/refresh
Renovar access token usando refresh token.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Cookie: refreshToken=eyJ..." \
  --cookie-jar cookies.txt
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... }
}
```

---

### POST /auth/logout
Cerrar sesión e invalidar refresh token.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer eyJ..." \
  -H "Cookie: refreshToken=eyJ..."
```

**Response (200):**
```json
{ "mensaje": "Sesión cerrada exitosamente" }
```

---

### POST /auth/profile
Obtener perfil del usuario autenticado.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJ..."
```

**Response (200):**
```json
{
  "usuario": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "activo": true
  }
}
```

---

## 🔒 Seguridad Implementada

### Frontend
✅ **Token en localStorage**: Accesible a JS pero en dominio específico
✅ **Refresh token en cookies**: HttpOnly + SameSite=Strict
✅ **Interceptor automático**: Inyecta JWT en headers
✅ **Auto-refresh**: Renovación transparente de tokens
✅ **Validación de formularios**: Email, contraseña, confirmación

### Backend
✅ **Argon2**: Hashing OWASP-recomendado (65MB, 3 iteraciones)
✅ **Helmet**: Headers de seguridad HTTP
✅ **CORS estricto**: Solo `http://localhost:3000`
✅ **Validación WhiteList**: Solo campos esperados
✅ **Rate Limiting**: Próximamente (100 req/15min)
✅ **JWT Rotation**: Refresh tokens con expiración
✅ **HttpOnly Cookies**: Previene XSS

## 🧪 Testing Manual

### 1. Crear Usuario

```
1. Ir a http://localhost:3000/registro
2. Llenar formulario:
   - Email: test@ejemplo.com
   - Nombre: Juan
   - Apellido: Pérez
   - Password: MiPassword123
3. Click "Crear Cuenta"
4. ✅ Debe redirigir a / (autenticado)
5. Verificar localStorage: dev tools → Storage → localStorage
```

### 2. Acceder a Carrito Protegido

```
1. Abrir nueva pestaña (limpia cache de sesión)
2. Ir a http://localhost:3000/carrito
3. ❌ Debe redirigir a /login?returnUrl=/carrito
4. Login con credentials anteriores
5. ✅ Debe redirigir automáticamente a /carrito
```

### 3. Refresh Token Automático

```
1. Estar autenticado en http://localhost:3000
2. En dev tools → Application → Cookies → refreshToken
   - Ver expiración (7 días)
3. Ir a http://localhost:3000/carrito (requiere token válido)
4. Abrir Network tab
5. Ver que hay POST a /api/auth/refresh (automático)
6. ✅ Carrito carga sin error
```

### 4. Test de Error (Credenciales Inválidas)

```
1. Ir a http://localhost:3000/login
2. Intentar login con email incorrecto
3. ❌ Debe mostrar error: "Usuario no encontrado"
4. Intentar login con password incorrecta
5. ❌ Debe mostrar error: "Credenciales inválidas"
```

## 📦 Dependencias Instaladas

### Frontend
```
axios@^1.13.2         - Cliente HTTP
zustand               - State management
next@16.0.4          - Framework
react@18.3.0         - Librería UI
```

### Backend
```
@nestjs/jwt@^11.0.1          - JWT para NestJS
@nestjs/passport@^11.0.5     - Passport integration
passport@^0.7.0              - Autenticación
passport-jwt@^4.0.1          - Estrategia JWT
argon2@^0.44.0               - Hashing
helmet@^8.1.0                - Security headers
@nestjs/throttler@^6.4.0     - Rate limiting
cookie-parser@^1.4.7         - Parse cookies
```

## 🚀 Próximos Pasos

### Corto Plazo (1-2 horas)
- [ ] **Rate Limiting Middleware**: Limitar intentos de login/registro
- [ ] **Prisma Schema**: Crear tabla `usuarios` en BD
- [ ] **Usuario Repository**: Reemplazar mock con Prisma
- [ ] **Migrations**: Crear y ejecutar migraciones

### Mediano Plazo (3-4 horas)
- [ ] **Admin Dashboard**: Rutas protegidas con @Roles('ADMIN')
- [ ] **User Profile**: Editar datos del perfil
- [ ] **Email Verification**: Validar email antes de usar cuenta
- [ ] **Reset Password**: Cambiar contraseña

### Largo Plazo (5+ horas)
- [ ] **OAuth2**: Login con Google, GitHub
- [ ] **2FA**: Two-factor authentication
- [ ] **Audit Logs**: Registrar intentos de login
- [ ] **JWT Blacklist**: Mejorar logout (base de datos)

## 📚 Archivos Clave

### Frontend
```
src/compartido/hooks/use-auth.ts                    - Store de autenticación
src/compartido/hooks/use-autenticacion-requerida.ts - Guard para rutas
src/compartido/lib/api-client.ts                   - Cliente HTTP
src/app/login/page.tsx                             - Página de login
src/app/registro/page.tsx                          - Página de registro
src/app/carrito/page.tsx                           - Carrito protegido
src/app/init-auth.tsx                              - Inicialización
```

### Backend
```
src/autenticacion/autenticacion.module.ts                 - Módulo principal
src/autenticacion/dominio/entidades/usuario.entity.ts    - Entity
src/autenticacion/dominio/tipos/rol.enum.ts              - Roles
src/autenticacion/aplicacion/casos-uso/autenticacion.servicio.ts - Lógica
src/autenticacion/infraestructura/http/autenticacion.controlador.ts - Endpoints
src/autenticacion/infraestructura/seguridad/argon2.servicio.ts - Hashing
src/autenticacion/infraestructura/passport/*.ts          - Estrategias
src/autenticacion/infraestructura/http/*.ts              - Guards/Decorators
```

---

**Estado**: ✅ Implementación completa de autenticación  
**Última actualización**: 2024  
**Próximo checkpoint**: Integración con Prisma
