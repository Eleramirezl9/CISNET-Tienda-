import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tienda E-commerce - Guatemala',
  description: 'E-commerce enterprise-grade construido con Next.js 14, TypeScript y NestJS',
  keywords: ['ecommerce', 'tienda online', 'guatemala', 'compras'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
