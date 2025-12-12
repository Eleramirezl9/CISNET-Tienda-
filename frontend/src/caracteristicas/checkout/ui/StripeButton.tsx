'use client';

import { useState } from 'react';
import { Button } from '@/compartido/ui/button';
import { Loader2, Globe } from 'lucide-react';

interface StripeButtonProps {
  numeroOrden: string;
  monto: number;
  moneda?: string;
  onSuccess: (sessionId: string) => void;
  onError: (error: Error) => void;
}

export function StripeButton({
  numeroOrden,
  monto,
  moneda = 'USD',
  onSuccess,
  onError,
}: StripeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pagos/stripe/crear-checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numeroOrden, monto, moneda }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear checkout de Stripe');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No se recibió la URL de checkout');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error Stripe:', error);
      }
      onError(error instanceof Error ? error : new Error('Error desconocido'));
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-indigo-600 hover:bg-indigo-700"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <Globe className="mr-2 h-4 w-4" />
          Pagar con Tarjeta Internacional (Stripe)
        </>
      )}
    </Button>
  );
}
