# Configuración de Webhook con ngrok para Recurrente

## ✅ Estado Actual

- **ngrok configurado y corriendo**
- **URL pública**: `https://7b2fac94b4b2.ngrok-free.app`
- **Puerto local**: 3001 (backend)

---

## 📝 Pasos para completar la configuración

### 1. Iniciar el Backend

Abre una terminal en el proyecto y ejecuta:

```bash
cd backend
pnpm run start:dev
```

Verifica que esté corriendo visitando: http://localhost:3001/api

### 2. Actualizar Webhook en Svix

Ve a: https://app.svix.com/app_33XcY4Chs114cZNNipPVZhAHbt7/endpoints

**Edita el endpoint actual** y cambia la URL a:

```
https://7b2fac94b4b2.ngrok-free.app/api/pagos/recurrente/webhook
```

**⚠️ IMPORTANTE**: Cada vez que reinicies ngrok, la URL cambiará y deberás actualizarla en Svix.

### 3. Verificar que el Webhook funciona

Prueba que el endpoint es accesible:

```bash
curl https://7b2fac94b4b2.ngrok-free.app/api/pagos/recurrente/webhook
```

Deberías recibir un error de autenticación (es normal, significa que el endpoint está accesible).

---

## 🧪 Probar el Flujo Completo de Recurrente

### Paso 1: Crear una orden
1. Ve a http://localhost:3000/checkout
2. Llena el formulario de checkout
3. Selecciona **"Recurrente"** como método de pago
4. Click en **"Confirmar Pedido"**

### Paso 2: Continuar con el pago
1. Click en **"Continuar con Tarjeta"**
2. Serás redirigido a la página de pago de Recurrente

### Paso 3: Completar el pago
Usa estas tarjetas de prueba:

**Visa**
- Número: `4242424242424242`
- CVV: `123`
- Fecha: `12/26`
- Nombre: Cualquier nombre

**Mastercard**
- Número: `5555555555554444`
- CVV: `123`
- Fecha: `12/26`
- Nombre: Cualquier nombre

### Paso 4: Verificar el webhook
Después de completar el pago:

1. **En Svix**: Revisa la pestaña "Message Attempts" para ver si el webhook fue enviado
2. **En el backend**: Revisa los logs de NestJS para ver si recibió el webhook
3. **En la base de datos**: Verifica que la orden cambió a estado "CONFIRMADA"

---

## 🔍 Debugging

### Ver logs del backend
Revisa la terminal donde corre el backend para ver:
- Peticiones entrantes
- Validación de webhook signature
- Actualización de estado de orden

### Ver logs en Svix
En la interfaz de Svix puedes ver:
- Si el webhook fue enviado
- El payload completo
- La respuesta del servidor
- Intentos de reenvío

### Verificar orden en base de datos

```bash
cd backend
pnpm prisma studio
```

Ve a la tabla `ordenes` y busca tu orden por `numeroOrden`.

---

## 🚨 Troubleshooting

### Error: "ngrok agent failed to establish connection"
**Causa**: El backend no está corriendo en puerto 3001
**Solución**: Inicia el backend con `pnpm run start:dev`

### Error: "Invalid webhook signature"
**Causa**: El signing secret no coincide
**Solución**: Verifica que `RECURRENTE_SIGNING_SECRET` en `.env` sea: `whsec_Hv1cSdIHthQs/A+Z6dZG7k5y2di+oUvR`

### El webhook no llega
**Causa**: La URL en Svix no está actualizada
**Solución**: Actualiza la URL en Svix con la URL actual de ngrok

### La orden no se actualiza
**Causa**: El evento no coincide con los esperados
**Solución**: Revisa en Svix qué evento está enviando Recurrente (`payment_intent.succeeded` o `payment.succeeded`)

---

## 📌 Notas Importantes

1. **ngrok URL cambia**: Cada vez que reinicies ngrok, obtendrás una URL diferente. Deberás actualizarla en Svix.

2. **ngrok gratuito tiene límites**:
   - Máximo 40 conexiones/minuto
   - La sesión expira después de 2 horas de inactividad
   - Puedes upgrade a una cuenta paga para obtener URLs permanentes

3. **Para producción**:
   - Configura el webhook con tu dominio real
   - Ejemplo: `https://tudominio.com/api/pagos/recurrente/webhook`

4. **Svix reintenta webhooks**: Si el webhook falla, Svix lo reintentará automáticamente con backoff exponencial.

---

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3001
- [ ] ngrok corriendo y mostrando URL pública
- [ ] URL de webhook actualizada en Svix
- [ ] Signing secret correcto en `.env`
- [ ] Frontend corriendo en puerto 3000
- [ ] Método de pago "Recurrente" visible en checkout
- [ ] Puedes crear una orden de prueba
- [ ] Botón de pago de Recurrente aparece correctamente

---

## 🎉 ¿Todo listo?

Si completaste todos los pasos, **¡estás listo para probar el flujo completo de Recurrente con webhooks funcionando!**

Cualquier problema, revisa los logs del backend y de Svix para identificar dónde está fallando el proceso.
