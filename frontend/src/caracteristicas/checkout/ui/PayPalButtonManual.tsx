'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PayPalButtonManualProps {
  numeroOrden: string;
  monto: number;
  onApprove: (details: any) => Promise<void>;
  onError: (error: any) => void;
}

export function PayPalButtonManual({
  numeroOrden,
  monto,
  onApprove,
  onError,
}: PayPalButtonManualProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      setError('PayPal Client ID no configurado');
      setIsLoading(false);
      return;
    }

    const renderButton = () => {
      // Si ya se renderizaron los botones, no volver a renderizar
      if (buttonsRendered.current) {
        return;
      }

      if (!paypalRef.current) {
        return;
      }

      // Acceder al SDK de PayPal desde window de forma segura
      const paypalSDK = (window as any).paypal;

      if (typeof paypalSDK?.Buttons !== 'function') {
        setError('SDK de PayPal no disponible');
        setIsLoading(false);
        return;
      }

      // Limpiar contenedor solo si está vacío
      if (paypalRef.current.children.length === 0) {
        paypalRef.current.innerHTML = '';
      } else {
        return;
      }

      paypalSDK
        .Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        },
        createOrder: async () => {
          try {
            // Obtener tipo de cambio desde variable de entorno
            const TIPO_CAMBIO_GTQ_USD = Number(
              process.env.NEXT_PUBLIC_EXCHANGE_RATE_GTQ_TO_USD || '7.80'
            );
            const montoUSD = Number((monto / TIPO_CAMBIO_GTQ_USD).toFixed(2));

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/pagos/paypal/crear-orden`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  numeroOrden,
                  monto: montoUSD,
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
        },
        onApprove: async (data: any) => {
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
            if (process.env.NODE_ENV === 'development') {
              console.error('Error en onApprove:', error);
            }
            onError(error);
          }
        },
        onError: (error: any) => {
          console.error('Error de PayPal:', error);
          onError(error);
        },
        onCancel: () => {
          console.log('Pago cancelado por el usuario');
        },
      })
        .render(paypalRef.current)
        .then(() => {
          buttonsRendered.current = true;
          setIsLoading(false);
        })
        .catch((err: any) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error al renderizar botones de PayPal:', err);
          }
          buttonsRendered.current = false;
          setError('Error al renderizar botones de PayPal');
          setIsLoading(false);
        });
    };

    // Verificar si el script ya está cargado
    const existingScript = document.querySelector(
      `script[src*="paypal.com/sdk/js"]`
    );

    if (existingScript && typeof (window as any).paypal?.Buttons === 'function') {
      renderButton();
      return;
    }

    // Si existe el script pero aún no se cargó, esperar
    if (existingScript) {
      existingScript.addEventListener('load', renderButton);
      return;
    }

    // Cargar el script de PayPal
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.setAttribute('data-namespace', 'paypal_sdk');

    script.onload = () => {
      // Esperar un momento para que el SDK se inicialice completamente
      setTimeout(() => {
        if (typeof (window as any).paypal?.Buttons === 'function') {
          renderButton();
        } else {
          setError('Error al inicializar PayPal');
          setIsLoading(false);
        }
      }, 100);
    };

    script.onerror = () => {
      setError('Error al cargar PayPal');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remover el script cuando el componente se desmonte
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [numeroOrden, monto]);

  if (error) {
    return (
      <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
          <p className="ml-2 text-sm text-zinc-600">Cargando PayPal...</p>
        </div>
      )}
      <div ref={paypalRef} />
    </div>
  );
}
