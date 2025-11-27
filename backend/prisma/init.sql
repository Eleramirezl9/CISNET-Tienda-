-- Script de inicialización de la base de datos
-- Se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto más rápidas

-- Configurar la zona horaria para Guatemala
SET timezone = 'America/Guatemala';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos tienda_ecommerce inicializada correctamente';
    RAISE NOTICE 'Zona horaria: America/Guatemala';
    RAISE NOTICE 'Extensiones instaladas: uuid-ossp, pg_trgm';
END $$;
