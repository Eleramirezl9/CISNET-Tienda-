/**
 * Toaster - Toast Notification Component
 * Wrapper para Sonner con configuración personalizada
 */

'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'bg-white border border-zinc-200 text-zinc-900 shadow-lg rounded-lg',
          title: 'text-sm font-semibold',
          description: 'text-sm text-zinc-600',
          actionButton: 'bg-zinc-900 text-white',
          cancelButton: 'bg-zinc-100 text-zinc-900',
          closeButton: 'bg-zinc-100 text-zinc-900 border-zinc-200',
          success: 'bg-green-50 border-green-200 text-green-900',
          error: 'bg-red-50 border-red-200 text-red-900',
          warning: 'bg-amber-50 border-amber-200 text-amber-900',
          info: 'bg-blue-50 border-blue-200 text-blue-900',
        },
      }}
    />
  );
}
