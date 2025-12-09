# 🚀 GUÍA DE INICIO RÁPIDO - AUTENTICACIÓN

## 📌 Resumen Ejecutivo

Se ha implementado un **sistema de autenticación completo** con arquitectura hexagonal/DDD, siguiendo estándares OWASP y mejores prácticas de seguridad.

**Lo que funciona:**
- ✅ Registro de usuarios (frontend + backend)
- ✅ Login con email/password (frontend + backend)
- ✅ Carrito protegido (requiere autenticación)
- ✅ Token JWT (15 min) + Refresh Token (7 días)
- ✅ Auto-renovación de tokens (transparente)
- ✅ Argon2 hashing (OWASP compliant)
- ✅ Helmet security headers
- ✅ CORS restringido
- ✅ HttpOnly cookies para refresh tokens

---

## 🎯 Flujo de Usuario

```
No autenticado
    ↓
Visita http://localhost:3000/registro
    ↓
Crea cuenta (email, nombre, apellido, password)
    ↓
Backend crea usuario + genera tokens
    ↓
Frontend almacena tokens
    ↓
Usuario autenticado → Ver /carrito sin problemas
    ↓
Si intenta /login cuando ya está autenticado → Redirige a /
    ↓
Access token expira (15 min) → Se renueva automáticamente (transparente)
    ↓
User hace logout → Todo se limpia
```

---

## 🛠️ Instalación y Setup

### 1️⃣ **Verificación de Sistema** (Opcional)

```powershell
# En C:\Users\MARLON\Desktop\Tienda
.\verificar-autenticacion.ps1
```

Esto te mostrará:
- ✓ Todos los archivos implementados
- ✓ Dependencias instaladas
- ✓ Archivos .env.local configurados

### 2️⃣ **Iniciar Frontend**

```powershell
cd C:\Users\MARLON\Desktop\Tienda\frontend
pnpm install  # Solo si no está hecho
pnpm dev
```

Abre: **http://localhost:3000**

### 3️⃣ **Iniciar Backend** (en otra terminal)

```powershell
cd C:\Users\MARLON\Desktop\Tienda\backend
pnpm install  # Solo si no está hecho
pnpm start:dev
```

El backend corre en: **http://localhost:3001**

---

## ✅ Pruebas Rápidas

### Test 1: Crear Cuenta

```
1. Abre http://localhost:3000/registro
2. Completa:
   - Email: tu_email@ejemplo.com
   - Nombre: Juan
   - Apellido: Pérez
   - Password: MiPassword123 (8+ chars, mayús, número)
3. Click "Crear Cuenta"
4. ✅ Debe redirigir a / (estarás autenticado)
```

**Verifica en DevTools (F12):**
- Application → Local Storage → `accessToken` (JWT)
- Application → Cookies → `refreshToken` (HttpOnly)

### Test 2: Login

```
1. Abre http://localhost:3000/login
2. Completa:
   - Email: tu_email@ejemplo.com
   - Password: MiPassword123
3. Click "Iniciar Sesión"
4. ✅ Debe redirigir a / (autenticado)
```

### Test 3: Carrito Protegido

```
1. Abre nueva pestaña (limpia)
2. Ve a http://localhost:3000/carrito
3. ❌ Debe redirigir a /login?returnUrl=/carrito
4. Completa login
5. ✅ Debe redirigir automáticamente a /carrito
6. Carrito se carga correctamente
```

### Test 4: Error en Credenciales

```
1. Abre http://localhost:3000/login
2. Intenta:
   - Email incorrecto → Error "Usuario no encontrado"
   - Password incorrecto → Error "Credenciales inválidas"
```

### Test 5: Logout

```
1. (Futuro) Habrá botón de logout en navbar
2. Click logout
3. Serás redirigido a /
4. Si intentas /carrito → Redirigido a login
```

---

## 📁 Estructura de Archivos

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Envuelve con InitAuth
│   │   ├── init-auth.tsx           ← Inicializa sesión
│   │   ├── login/page.tsx          ← Formulario login
│   │   ├── registro/page.tsx       ← Formulario registro
│   │   └── carrito/page.tsx        ← Protegido ⚠️
│   └── compartido/
│       ├── hooks/
│       │   ├── use-auth.ts         ← Store Zustand
│       │   └── use-autenticacion-requerida.ts  ← Guard
│       └── lib/
│           └── api-client.ts       ← Cliente HTTP + JWT
├── .env.local                      ← Configuración local
└── package.json
```

### Backend
```
backend/
├── src/
│   ├── autenticacion/
│   │   ├── dominio/
│   │   │   ├── entidades/usuario.entity.ts
│   │   │   ├── tipos/rol.enum.ts
│   │   │   └── puertos/
│   │   │       ├── hashing.service.ts
│   │   │       └── usuario.repositorio.ts
│   │   ├── aplicacion/
│   │   │   ├── casos-uso/autenticacion.servicio.ts
│   │   │   └── dto/*.ts            ← 3 DTOs
│   │   ├── infraestructura/
│   │   │   ├── seguridad/argon2.servicio.ts
│   │   │   ├── passport/            ← 2 estrategias
│   │   │   ├── http/
│   │   │   │   ├── autenticacion.controlador.ts  ← 5 endpoints
│   │   │   │   ├── guard-*.ts       ← 3 guards
│   │   │   │   └── decoradores/     ← 3 decoradores
│   │   │   └── persistencia/usuario.repositorio.mock.ts
│   │   └── autenticacion.module.ts  ← Configuración
│   ├── app.module.ts                ← Importa Auth
│   └── main.ts                      ← Helmet + CORS
├── .env.local                       ← Configuración local
└── package.json
```

---

## 🔐 Seguridad Implementada

### En el Frontend
✅ **Token en localStorage**: Acceso de JS pero seguro a nivel dominio  
✅ **Refresh token en HttpOnly cookies**: No accesible a JS (XSS safe)  
✅ **SameSite=Strict**: Protección contra CSRF  
✅ **Validación de formularios**: Email, contraseña fuerte, confirmación  
✅ **Auto-refresh transparente**: Usuario no se da cuenta  
✅ **Auto-logout**: Si token expira y no se puede refrescar  

### En el Backend
✅ **Argon2**: Hashing OWASP-recomendado  
✅ **Helmet**: Headers HTTP de seguridad  
✅ **CORS estricto**: Solo `http://localhost:3000`  
✅ **Validación WhiteList**: Solo campos esperados en DTOs  
✅ **JWT Rotation**: Tokens con expiración diferente  
✅ **Passwords nunca se retornan**: Ni en respuestas ni en logs  
✅ **Rate limiting**: Próximamente (config lista)  

---

## 📋 Endpoints Disponibles

| Método | Ruta | Público | Descripción |
|--------|------|---------|-------------|
| POST | `/auth/register` | ✅ | Crear nuevo usuario |
| POST | `/auth/login` | ✅ | Iniciar sesión |
| POST | `/auth/refresh` | ⚠️ Opcional | Renovar token |
| POST | `/auth/logout` | ❌ Requiere JWT | Cerrar sesión |
| POST | `/auth/profile` | ❌ Requiere JWT | Obtener perfil |

**Cómo probar con curl:**

```bash
# Registrarse
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "password": "MiPassword123"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "MiPassword123"
  }'

# Usar token (copiar del response anterior)
curl -X POST http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer <tu-access-token>"
```

---

## 🐛 Debugging

### DevTools (F12)
- **Application** → Local Storage: Ver `accessToken` y `usuario`
- **Application** → Cookies: Ver `refreshToken` (HttpOnly)
- **Network**: Ver requests con Authorization header
- **Console**: Ver logs de errores (login fallido, etc.)

### Terminal Backend
- Verás logs de cada request
- Errores de validación
- Cambios de estado

### Test Manual de Token

```javascript
// En Console del DevTools (frontend)
localStorage.getItem('accessToken')  // Ver token
localStorage.getItem('usuario')      // Ver usuario JSON
```

---

## ⚠️ Cosas Importantes

1. **Las contraseñas no se guardan en plain text** - Usan Argon2
2. **El refresh token en cookies es HttpOnly** - No se puede acceder con JS (seguro)
3. **Access token expira en 15 minutos** - Se renueva automáticamente
4. **CORS solo permite frontend** - Backend solo acepta requests de `http://localhost:3000`
5. **El usuario se guarda en localStorage** - Para no hacer request extra por cada carga

---

## 🚀 Próximos Pasos (TODO)

### Fase 1: Base de Datos (1-2 horas)
```
1. Crear schema Prisma con tabla `usuarios`
2. Ejecutar migraciones
3. Reemplazar mock repository con Prisma
4. Probar flujo completo con BD real
```

### Fase 2: Features Adicionales (2-3 horas)
```
1. Rate limiting en login/register
2. Email verification
3. Reset password
4. Admin dashboard (@Roles('ADMIN'))
5. Edit profile
```

### Fase 3: Producción (3-4 horas)
```
1. Generar JWT_SECRET seguro
2. Configurar SSL/HTTPS
3. Configurar BD remota
4. Testing E2E
5. Deployment
```

---

## 📚 Documentación Completa

- **AUTENTICACION_COMPLETA.md** - Guía detallada de flujos y endpoints
- **AUTENTICACION_CHECKLIST.md** - Verificación de implementación

---

## ✅ Checklist de Verificación Final

```
Frontend:
 ☐ http://localhost:3000/registro - Crear cuenta
 ☐ http://localhost:3000/login - Login
 ☐ http://localhost:3000/carrito - Protegido
 ☐ DevTools - Ver tokens en localStorage y cookies
 ☐ Logout (futuro) - Si existe botón

Backend:
 ☐ http://localhost:3001/api/auth/register - POST funciona
 ☐ http://localhost:3001/api/auth/login - POST funciona
 ☐ http://localhost:3001/api/auth/profile - JWT requiere token
 ☐ Token refresh automático - Probar esperando 1 minuto
 ☐ Rate limiting - Próximamente
```

---

## 🆘 Ayuda Rápida

### "El frontend no conecta con el backend"
→ Verificar `.env.local` en frontend: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### "Tokens no se guardan"
→ Verificar que cookies estén habilitadas en navegador

### "Error al crear cuenta: email existe"
→ Normal. Backend previene duplicados. Usar otro email.

### "401 Unauthorized en cualquier endpoint"
→ Verificar que `Authorization: Bearer <token>` esté en headers

### "CORS error"
→ Backend solo acepta `http://localhost:3000`. Verificar que frontend corra en ese puerto.

---

## 📞 Soporte

Si tienes problemas:
1. Verifica logs en terminal (frontend + backend)
2. Usa DevTools para inspeccionar tokens
3. Comprueba que ambas apps estén corriendo
4. Verifica .env.local en ambas carpetas

---

**Estado**: ✅ Sistema funcional y listo para testing  
**Próxima revisión**: Después de probar flujos  
**Mantenedor**: Senior Security Engineer (AI)

---

**¡Listo para empezar! 🎉**

Ahora ejecuta:
```powershell
cd frontend && pnpm dev
# En otra terminal
cd backend && pnpm start:dev
```

Luego abre **http://localhost:3000/registro** y prueba la creación de cuenta.
