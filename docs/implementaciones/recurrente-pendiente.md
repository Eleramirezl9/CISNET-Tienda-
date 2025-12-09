# 🔄 IMPLEMENTACIÓN DE RECURRENTE - PENDIENTE

## ✅ YA COMPLETADO

1. ✅ Credenciales agregadas en `backend/.env`
2. ✅ Servicio de Recurrente creado en `backend/src/pagos/infraestructura/recurrente/recurrente.service.ts`

---

## 📋 PASOS PENDIENTES

### 1. Actualizar el Controlador de Pagos

**Archivo:** `backend/src/pagos/infraestructura/http/pagos.controller.ts`

**Agregar:**

```typescript
// En el constructor
constructor(
  private readonly paypalService: PayPalService,
  private readonly recurrenteService: RecurrenteService, // AGREGAR
  private readonly buscarOrdenPorNumero: BuscarOrdenPorNumeroUseCase,
  //...
)

// NUEVOS ENDPOINTS:

@Post('recurrente/crear-checkout')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Crear checkout de Recurrente',
  description: 'Crea una sesión de pago con Recurrente para tarjetas',
})
async crearCheckoutRecurrente(
  @Body() datos: { numeroOrden: string; monto: number; moneda?: string },
) {
  // 1. Validar que la orden exista
  const ordenBD = await this.buscarOrdenPorNumero.ejecutar(datos.numeroOrden);

  // 2. Validar monto (usar tipo de cambio si es necesario)
  const tipoCambio = Number(
    this.configService.get('EXCHANGE_RATE_GTQ_TO_USD', '7.80'),
  );

  // Si el monto viene en USD pero la orden está en GTQ
  const montoEsperado = datos.moneda === 'USD'
    ? Number((ordenBD.total / tipoCambio).toFixed(2))
    : ordenBD.total;

  const diferencia = Math.abs(datos.monto - montoEsperado);

  if (diferencia > 1.00) {  // Tolerancia de Q1.00 o $0.10
    throw new BadRequestException(
      `El monto no coincide con la orden. Esperado: ${montoEsperado}, Recibido: ${datos.monto}`,
    );
  }

  // 3. Crear checkout en Recurrente
  const checkout = await this.recurrenteService.crearCheckout({
    monto: montoEsperado,
    moneda: datos.moneda || 'GTQ',
    numeroOrden: datos.numeroOrden,
    urlExito: `${process.env.FRONTEND_URL}/checkout/confirmacion?orden=${datos.numeroOrden}`,
    urlCancelacion: `${process.env.FRONTEND_URL}/checkout`,
    urlWebhook: `${process.env.BACKEND_URL}/api/pagos/recurrente/webhook`,
  });

  // 4. Guardar checkout ID en la BD
  await this.prisma.orden.update({
    where: { numeroOrden: datos.numeroOrden },
    data: {
      recurrenteCheckoutId: checkout.id,
    },
  });

  return {
    checkoutId: checkout.id,
    checkoutUrl: checkout.url,
    estado: checkout.estado,
  };
}

@Post('recurrente/webhook')
@HttpCode(HttpStatus.OK)
async webhookRecurrente(
  @Body() payload: any,
  @Headers('x-signature') signature: string,
) {
  // 1. Validar la firma del webhook
  const isValid = this.recurrenteService.validarWebhookSignature(
    JSON.stringify(payload),
    signature,
  );

  if (!isValid) {
    throw new BadRequestException('Firma de webhook inválida');
  }

  // 2. Procesar evento según el tipo
  if (payload.event === 'payment.succeeded' || payload.status === 'completed') {
    const transaccion = payload.data || payload;

    // 3. Buscar orden asociada
    const ordenBD = await this.prisma.orden.findFirst({
      where: { recurrenteCheckoutId: transaccion.id },
    });

    if (ordenBD) {
      // 4. Actualizar estado de la orden
      await this.prisma.orden.update({
        where: { numeroOrden: ordenBD.numeroOrden },
        data: {
          estadoPago: 'COMPLETADO',
          estado: EstadoOrden.CONFIRMADA,
          recurrenteTransactionId: transaccion.id,
          fechaActualizacion: new Date(),
        },
      });
    }
  }

  return { received: true };
}
```

### 2. Actualizar el Módulo de Pagos

**Archivo:** `backend/src/pagos/pagos.module.ts`

```typescript
import { RecurrenteService } from './infraestructura/recurrente/recurrente.service';

@Module({
  imports: [ConfigModule, CompartidoModule],
  controllers: [PagosController],
  providers: [
    PayPalService,
    RecurrenteService, // AGREGAR
    BuscarOrdenPorNumeroUseCase,
    ActualizarEstadoOrdenUseCase,
  ],
  exports: [PayPalService, RecurrenteService], // AGREGAR
})
export class PagosModule {}
```

### 3. Actualizar el Schema de Prisma

**Archivo:** `backend/prisma/schema.prisma`

```prisma
model Orden {
  id              String    @id @default(uuid())
  numeroOrden     String    @unique @map("numero_orden")

  // ... campos existentes ...

  // Campos PayPal (ya existen)
  paypalOrderId   String?   @map("paypal_order_id")
  paypalCaptureId String?   @map("paypal_capture_id")

  // AGREGAR: Campos Recurrente
  recurrenteCheckoutId     String?   @map("recurrente_checkout_id")
  recurrenteTransactionId  String?   @map("recurrente_transaction_id")

  // ... resto de campos ...
}
```

**Correr migración:**
```bash
cd backend
npx prisma migrate dev --name add_recurrente_fields
```

### 4. Frontend - Agregar Variable de Entorno

**Archivo:** `frontend/.env.local`

```env
# Recurrente (Test)
NEXT_PUBLIC_RECURRENTE_PUBLIC_KEY=pk_test_uWS5SBTkEnhI1o8f0E1Lyzvfn89Qadqumwkj5e6Gk1BQ8rFNxUMe3IAnK
```

### 5. Frontend - Actualizar Enums

**Archivo:** `frontend/src/caracteristicas/checkout/dominio/checkout.types.ts`

```typescript
export enum MetodoPago {
  CONTRA_ENTREGA = 'CONTRA_ENTREGA',
  PAYPAL = 'PAYPAL',
  RECURRENTE = 'RECURRENTE', // AGREGAR
}
```

### 6. Frontend - Crear Componente de Tarjeta

**Archivo:** `frontend/src/caracteristicas/checkout/ui/RecurrenteButton.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/compartido/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

interface RecurrenteButtonProps {
  numeroOrden: string;
  monto: number;
  moneda?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: any) => void;
}

export function RecurrenteButton({
  numeroOrden,
  monto,
  moneda = 'GTQ',
  onSuccess,
  onError,
}: RecurrenteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Crear checkout
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pagos/recurrente/crear-checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numeroOrden, monto, moneda }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear checkout');
      }

      // Redirigir a la página de pago de Recurrente
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Error:', error);
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar con Tarjeta (Recurrente)
        </>
      )}
    </Button>
  );
}
```

### 7. Frontend - Integrar en Checkout

**Archivo:** `frontend/src/app/checkout/page.tsx`

```typescript
import { RecurrenteButton } from '@/caracteristicas/checkout/ui/RecurrenteButton';

// En el formulario, donde muestras los botones de pago:
{metodoPago === MetodoPago.RECURRENTE && ordenCreada && (
  <div className="mt-6">
    <RecurrenteButton
      numeroOrden={ordenCreada}
      monto={total}
      moneda="GTQ"
      onSuccess={() => {
        toast.success('¡Pago completado!');
        limpiarCarrito();
        router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
      }}
      onError={(error) => {
        toast.error('Error en el pago');
        setError(error.message);
      }}
    />
  </div>
)}
```

---

## 🔐 CONFIGURACIÓN DE WEBHOOKS EN SVIX

1. Ve a: https://app.svix.com/app_33XcY4Chs114cZNNipPVZhAHbt7/endpoints

2. Agregar endpoint:
   - **URL:** `https://tu-dominio.com/api/pagos/recurrente/webhook`
   - **Events:** Selecciona `payment.succeeded`, `payment.failed`
   - **Secret:** Usa el `RECURRENTE_SIGNING_SECRET` que ya configuramos

3. Para desarrollo local, usa ngrok:
   ```bash
   ngrok http 3001
   # Luego usa: https://xxxxx.ngrok.io/api/pagos/recurrente/webhook
   ```

---

## 🧪 TESTING

1. **Tarjetas de prueba de Recurrente:**
   - Visa: `4242424242424242`
   - Mastercard: `5555555555554444`
   - CVV: cualquier 3 dígitos
   - Fecha: cualquier fecha futura

2. **Flujo de prueba:**
   1. Crear orden desde el frontend
   2. Seleccionar método de pago "Recurrente"
   3. Click en "Pagar con Tarjeta"
   4. Completar datos de tarjeta en Recurrente
   5. Verificar webhook recibido
   6. Verificar que orden se actualiza a CONFIRMADA

---

## ⚠️ SEGURIDAD - PUNTOS CRÍTICOS

✅ **Ya implementados:**
- Validación de montos contra la BD
- Credenciales en variables de entorno
- Validación de webhook signature
- No exponer claves secretas en frontend

❌ **Pendientes:**
- Implementar validación HMAC real en `validarWebhookSignature()`
- Agregar rate limiting a endpoints de webhooks
- Considerar autenticación JWT para crear checkouts

---

## 📚 REFERENCIAS

- [Recurrente Documentación](https://docs.recurrente.com/)
- [Recurrente API Postman](https://documenter.getpostman.com/view/10340859/2sA2rFQf5R)
- [Svix Webhooks](https://docs.svix.com/)

---

## ✅ CHECKLIST FINAL

- [ ] Actualizar controlador de pagos
- [ ] Actualizar módulo de pagos
- [ ] Correr migración de Prisma
- [ ] Agregar variable de entorno en frontend
- [ ] Crear componente RecurrenteButton
- [ ] Integrar en página de checkout
- [ ] Configurar webhooks en Svix
- [ ] Probar flujo completo con tarjeta de prueba
- [ ] Revisar logs y validaciones
- [ ] Documentar en README del proyecto
