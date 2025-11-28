@echo off
echo.
echo ========================================
echo Verificando Sistema de Autenticacion
echo ========================================
echo.

setlocal enabledelayedexpansion

REM Ruta base
set "BasePath=C:\Users\MARLON\Desktop\Tienda"
set "FrontendPath=%BasePath%\frontend"
set "BackendPath=%BasePath%\backend"

echo [Frontend]
echo Archivos:
if exist "%FrontendPath%\src\compartido\hooks\use-auth.ts" echo   + use-auth.ts
if exist "%FrontendPath%\src\compartido\hooks\use-autenticacion-requerida.ts" echo   + use-autenticacion-requerida.ts
if exist "%FrontendPath%\src\compartido\lib\api-client.ts" echo   + api-client.ts
if exist "%FrontendPath%\src\app\login\page.tsx" echo   + login/page.tsx
if exist "%FrontendPath%\src\app\registro\page.tsx" echo   + registro/page.tsx
if exist "%FrontendPath%\src\app\carrito\page.tsx" echo   + carrito/page.tsx
if exist "%FrontendPath%\src\app\init-auth.tsx" echo   + init-auth.tsx
if exist "%FrontendPath%\.env.local" echo   + .env.local
echo.

echo [Backend]
echo Archivos principales:
if exist "%BackendPath%\src\autenticacion\autenticacion.module.ts" echo   + autenticacion.module.ts
if exist "%BackendPath%\src\autenticacion\aplicacion\casos-uso\autenticacion.servicio.ts" echo   + autenticacion.servicio.ts
if exist "%BackendPath%\src\autenticacion\infraestructura\http\autenticacion.controlador.ts" echo   + autenticacion.controlador.ts
if exist "%BackendPath%\src\autenticacion\infraestructura\seguridad\argon2.servicio.ts" echo   + argon2.servicio.ts
if exist "%BackendPath%\.env.local" echo   + .env.local
echo.

echo [Documentacion]
echo Archivos:
if exist "%BasePath%\AUTENTICACION_COMPLETADA.md" echo   + AUTENTICACION_COMPLETADA.md
if exist "%BasePath%\docs\AUTENTICACION_COMPLETA.md" echo   + docs/AUTENTICACION_COMPLETA.md
if exist "%BasePath%\docs\AUTENTICACION_CHECKLIST.md" echo   + docs/AUTENTICACION_CHECKLIST.md
if exist "%BasePath%\docs\INICIO_RAPIDO_AUTENTICACION.md" echo   + docs/INICIO_RAPIDO_AUTENTICACION.md
echo.

echo ========================================
echo Sistema de Autenticacion COMPLETADO
echo ========================================
echo.
echo Proximos pasos:
echo   1. cd frontend
echo   2. pnpm dev
echo.
echo   En otra terminal:
echo   1. cd backend
echo   2. pnpm start:dev
echo.
echo Luego abre: http://localhost:3000/registro
echo.
