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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
      }
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
