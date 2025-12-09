'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  numeroOrden: string;
  monto: number;
  onApprove: (details: any) => Promise<void>;
  onError: (error: any) => void;
}

export function PayPalButton({
  numeroOrden,
  monto,
  onApprove,
  onError,
}: PayPalButtonProps) {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  console.log('PayPal Button - Estado:', { isPending, isResolved, isRejected });
  console.log('PayPal Button - window.paypal disponible:', typeof window !== 'undefined' && !!(window as any).paypal);
  console.log('PayPal Button - window.paypal.Buttons disponible:', typeof window !== 'undefined' && !!(window as any).paypal?.Buttons);
  if (typeof window !== 'undefined' && (window as any).paypal) {
    console.log('PayPal Button - Contenido de window.paypal:', Object.keys((window as any).paypal));
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
        <p className="ml-2 text-sm text-zinc-600">Cargando PayPal...</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">
        Error al cargar PayPal. Por favor recarga la página.
      </div>
    );
  }

  // Verificar que el SDK esté completamente cargado antes de renderizar
  if (!isResolved || typeof window === 'undefined' || !(window as any).paypal?.Buttons) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
        <p className="ml-2 text-sm text-zinc-600">Inicializando PayPal...</p>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
      }}
      createOrder={async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pagos/paypal/crear-orden`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                numeroOrden,
                monto,
                moneda: 'USD',
                descripcion: `Orden ${numeroOrden}`,
              }),
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Error al crear la orden de PayPal');
          }

          return data.id;
        } catch (error) {
          console.error('Error al crear orden PayPal:', error);
          onError(error);
          throw error;
        }
      }}
      onApprove={async (data) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pagos/paypal/capturar/${data.orderID}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          const details = await response.json();

          if (!response.ok) {
            throw new Error(details.message || 'Error al capturar el pago');
          }

          await onApprove(details);
        } catch (error) {
          console.error('Error al capturar pago:', error);
          onError(error);
        }
      }}
      onError={(error) => {
        console.error('Error de PayPal:', error);
        onError(error);
      }}
      onCancel={() => {
        console.log('Pago cancelado por el usuario');
      }}
    />
  );
}
