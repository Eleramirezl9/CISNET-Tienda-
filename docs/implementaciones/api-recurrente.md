# 📋 Instrucciones para Completar la Integración con Recurrente API

## ⚠️ Estado Actual

La integración de Recurrente está **funcionando en MODO DEMO** con un mock que simula las respuestas del API. Para activar la integración real, necesitas obtener la URL correcta del API de Recurrente.

---

## 🔍 Cómo Obtener la URL del API de Recurrente

### Opción 1: Dashboard de Recurrente

1. Inicia sesión en tu cuenta de Recurrente: https://www.recurrente.com/
2. Ve a **"Configuración"** o **"Developers"** / **"API"**
3. Busca la sección de **"Credenciales de API"** o **"API Keys"**
4. Ahí deberías encontrar:
   - ✅ Base URL del API (ej: `https://api.recurrente.com` o `https://recurrente.com/api`)
   - ✅ Endpoint para crear checkouts
   - ✅ Formato de los parámetros requeridos

### Opción 2: Documentación Oficial

1. Visita: https://docs.recurrente.com/
2. Busca la sección de **"API Reference"** o **"Checkout API"**
3. Documenta:
   - Base URL
   - Endpoint de checkout (probablemente `/v1/checkout` o `/api/checkouts`)
   - Método HTTP (POST)
   - Headers requeridos
   - Formato del body

### Opción 3: Soporte de Recurrente

Contacta a soporte de Recurrente:
- Email: soporte@recurrente.com (verificar en su sitio)
- Pregunta específicamente por:
  - **"URL base del API para entorno de prueba"**
  - **"URL base del API para producción"**
  - **"Endpoint para crear sesiones de checkout"**
  - **"Documentación de integración para e-commerce"**

---

## 🛠️ Cómo Activar la Integración Real

Una vez que tengas la información del API:

### Paso 1: Actualizar la URL del API

Edita `backend/.env`:

```env
# Cambiar de:
RECURRENTE_API_URL=https://api.recurrente.com

# A la URL real (ejemplo):
RECURRENTE_API_URL=https://api.recurrente.com/v1
# O
RECURRENTE_API_URL=https://recurrente.com/api
```

### Paso 2: Actualizar el Código del Servicio

Edita [`backend/src/pagos/infraestructura/recurrente/recurrente.service.ts`](backend/src/pagos/infraestructura/recurrente/recurrente.service.ts:81)

**Descomentar el código real y comentar el mock:**

```typescript
async crearCheckout(datos: CrearCheckoutDto): Promise<CheckoutResponse> {
  // Comentar o eliminar el mock:
  /*
  this.logger.warn('⚠️  MODO DEMO...');
  const checkoutId = `checkout_test_${Date.now()}`;
  ...
  */

  // Descomentar este código:
  try {
    const response = await this.httpClient.post('/v1/checkout', {  // <-- Verificar el endpoint correcto
      amount: datos.monto,
      currency: datos.moneda,
      description: datos.descripcion || `Orden ${datos.numeroOrden}`,
      metadata: {
        numeroOrden: datos.numeroOrden,
      },
      success_url: datos.urlExito,
      cancel_url: datos.urlCancelacion,
      webhook_url: datos.urlWebhook,
    });

    return {
      id: response.data.id,
      url: response.data.checkout_url || response.data.url,
      estado: response.data.status || 'pendiente',
    };
  } catch (error) {
    this.logger.error('Error al crear checkout en Recurrente', error);
    throw new Error('No se pudo crear la sesión de pago con Recurrente');
  }
}
```

### Paso 3: Verificar Estructura de la Respuesta

Posiblemente necesites ajustar los campos de la respuesta según la documentación real:

```typescript
// Ajustar según lo que retorne el API real:
return {
  id: response.data.id,           // O response.data.checkout_id
  url: response.data.checkout_url || response.data.url || response.data.payment_url,
  estado: response.data.status || response.data.state || 'pendiente',
};
```

---

## 📚 Información de Referencia

### Credenciales Actuales (Test)

```
Public Key: pk_test_uWS5SBTkEnhI1o8f0E1Lyzvfn89Qadqumwkj5e6Gk1BQ8rFNxUMe3IAnK
Secret Key: sk_test_OU2MXDwhlS46lZzLxn81D9QoGiZeRmMZcLl7ZQJrLZDJwoV5EjFON7kLd
Signing Secret: whsec_Hv1cSdIHthQs/A+Z6dZG7k5y2di+oUvR
```

Estas credenciales ya están configuradas en el `.env`.

### URLs de Documentación

- **Sitio Oficial**: [Recurrente.com](https://www.recurrente.com/)
- **Documentación**: [docs.recurrente.com](https://docs.recurrente.com/)
- **Postman Collection**: [Documentación Postman](https://documenter.getpostman.com/view/10340859/2sA2rFQf5R)
- **GitHub Wrapper .NET**: [TipiCode/recurrente](https://github.com/TipiCode/recurrente)

### Ejemplo de Implementación (basado en otros APIs similares)

```typescript
// Ejemplo típico de creación de checkout:
const response = await axios.post('https://api.recurrente.com/v1/checkouts', {
  amount: 100.00,
  currency: 'GTQ',
  description: 'Orden #12345',
  success_url: 'https://mitienda.com/success',
  cancel_url: 'https://mitienda.com/cancel',
}, {
  headers: {
    'Authorization': `Bearer ${SECRET_KEY}`,
    // O tal vez:
    'X-Public-Key': PUBLIC_KEY,
    'X-Secret-Key': SECRET_KEY,
  }
});
```

---

## ✅ Verificación de la Integración

### 1. Probar Creación de Checkout

```bash
# Desde el backend
curl -X POST http://localhost:3001/api/pagos/recurrente/crear-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "numeroOrden": "ORD-TEST-001",
    "monto": 100,
    "moneda": "GTQ"
  }'
```

Deberías recibir:
```json
{
  "checkoutId": "ch_xxxxx",
  "checkoutUrl": "https://recurrente.com/checkout/ch_xxxxx",
  "estado": "pendiente"
}
```

### 2. Verificar Webhook

El webhook ya está configurado en:
- **Endpoint Local**: `http://localhost:3001/api/pagos/recurrente/webhook`
- **Endpoint Público (ngrok)**: `https://95f605432f52.ngrok-free.app/api/pagos/recurrente/webhook`
- **Svix Dashboard**: https://app.svix.com/app_33XcY4Chs114cZNNipPVZhAHbt7/endpoints

---

## 🚀 Modo Demo Actual

Mientras tanto, el sistema funciona en **MODO DEMO**:

1. ✅ Puedes seleccionar "Recurrente" en el checkout
2. ✅ Se crea la orden en la base de datos
3. ✅ Se guarda el `recurrenteCheckoutId`
4. ⚠️  Te redirige a `www.recurrente.com` con parámetros demo
5. ⚠️  No se procesa pago real
6. ✅ El webhook está listo para recibir notificaciones

Para completar un flujo de prueba en modo demo:
1. Después de ser redirigido, puedes simular el webhook manualmente
2. O actualizar manualmente el estado de la orden en la BD

---

## 📞 Siguiente Paso

**Acción Requerida**: Obtén la URL correcta del API de Recurrente desde tu dashboard o contactando a su soporte, luego actualiza `backend/.env` y activa el código real en `recurrente.service.ts`.

Una vez tengas la información, la integración completa tomará menos de 5 minutos en activarse.

---

**Estado**: ⚠️ PENDIENTE DE URL DEL API
**Documentación**: [IMPLEMENTACION_RECURRENTE_COMPLETADA.md](IMPLEMENTACION_RECURRENTE_COMPLETADA.md)
**Configuración**: [CONFIGURACION_WEBHOOK_NGROK.md](CONFIGURACION_WEBHOOK_NGROK.md)
