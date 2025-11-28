import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { InitAuth } from './init-auth';
import { Navbar } from '@/compartido/componentes/navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CISNET - Tu plataforma de software especializada',
  description: 'Descarga las mejores herramientas de desarrollo, productividad y creatividad',
  keywords: ['software', 'herramientas', 'desarrollo', 'productividad'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="antialiased">
      <body className={`${inter.variable} font-sans bg-white text-zinc-900`}>
        <InitAuth>
          <Navbar />
          {children}
        </InitAuth>
      </body>
    </html>
  );
}
