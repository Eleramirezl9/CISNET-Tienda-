# 🔒 Guía de Seguridad

## ⚠️ Archivos que NUNCA debes commitear

### ✅ YA Protegidos en .gitignore:

- ✅ `.env` - Variables de entorno con credenciales
- ✅ `.env.local` - Variables locales
- ✅ `.env.production` - Credenciales de producción
- ✅ `node_modules/` - Dependencias
- ✅ `dist/` - Código compilado
- ✅ `*.db`, `*.sqlite` - Bases de datos locales
- ✅ `docker-compose.override.yml` - Configuración local de Docker
- ✅ `*.pem`, `*.key`, `*.cert` - Certificados y llaves

## 🛡️ Archivos de Ejemplo (SEGUROS para commitear)

Estos archivos NO contienen credenciales reales:

- ✅ `.env.example` - Template de variables de entorno
- ✅ `docker-compose.yml` - Configuración base de Docker (usa valores de ejemplo)
- ✅ `README.md`, `DOCKER_SETUP.md` - Documentación

## 🔐 Credenciales Actuales en el Proyecto

### Base de Datos (Docker - Solo Desarrollo)
- **Usuario:** postgres
- **Contraseña:** postgres
- **Base de datos:** tienda_ecommerce
- **Puerto:** 5432
- ⚠️ **IMPORTANTE:** Estas son credenciales de DESARROLLO. Cámbialas en producción.

### pgAdmin (Solo Desarrollo)
- **Email:** admin@tienda.com
- **Contraseña:** admin123
- **URL:** http://localhost:5050
- ⚠️ Solo para desarrollo local.

### JWT Secret (Backend)
- **Actual:** `tienda_ecommerce_secret_key_change_in_production`
- ⚠️ **CRÍTICO:** Cambia esto en producción usando:
  ```bash
  openssl rand -base64 32
  ```

## 📋 Checklist de Seguridad para Producción

Antes de hacer deploy a producción:

### Backend

- [ ] Cambiar `DATABASE_URL` con credenciales seguras
- [ ] Generar nuevo `JWT_SECRET` aleatorio
- [ ] Configurar `NODE_ENV=production`
- [ ] Usar base de datos en servidor seguro (no localhost)
- [ ] Cambiar password de PostgreSQL
- [ ] Configurar CORS solo para tu dominio
- [ ] Habilitar HTTPS
- [ ] Configurar rate limiting
- [ ] Revisar que `.env` esté en `.gitignore`

### Frontend

- [ ] Actualizar `NEXT_PUBLIC_API_URL` a tu API en producción
- [ ] Configurar `NEXT_PUBLIC_APP_URL` con tu dominio
- [ ] Revisar que no haya API keys expuestas en el código

### Docker

- [ ] NO usar docker-compose.yml en producción (usar Kubernetes, ECS, etc.)
- [ ] Cambiar todas las credenciales de los servicios
- [ ] Usar secrets management (Docker Secrets, AWS Secrets Manager, etc.)
- [ ] No exponer pgAdmin en producción

## 🚨 ¿Qué hacer si expusiste credenciales?

Si accidentalmente commiteaste archivos con credenciales:

1. **INMEDIATAMENTE** cambia todas las credenciales expuestas
2. Revoca tokens y API keys comprometidos
3. Usa `git-filter-repo` o `BFG Repo-Cleaner` para limpiar el historial
4. Notifica a tu equipo
5. Documenta el incidente

## 🔍 Verificar antes de cada commit

```bash
# Ver qué archivos vas a commitear
git status

# Revisar el contenido de cada archivo
git diff --staged

# Buscar posibles secrets
git diff --staged | grep -i "password\|secret\|key\|token"
```

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)

---

**Regla de Oro:** Si tienes duda de si un archivo contiene información sensible, NO lo commitees.
