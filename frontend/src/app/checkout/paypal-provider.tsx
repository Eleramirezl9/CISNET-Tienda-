'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import type { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    if (process.env.NODE_ENV === 'development') {
      console.error('PayPal Client ID no está configurado');
    }
    return <>{children}</>;
  }

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: clientId,
    currency: 'USD',
    intent: 'capture',
    dataPageType: 'checkout',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
