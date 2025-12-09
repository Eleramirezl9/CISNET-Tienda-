import { PayPalProvider } from './paypal-provider';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PayPalProvider>{children}</PayPalProvider>;
}
