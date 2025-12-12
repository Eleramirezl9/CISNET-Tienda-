/**
 * PaymentMethodSelector - Selector Visual de Métodos de Pago
 * Tarjetas interactivas para selección de método de pago
 */

'use client';

import { MetodoPago } from '../dominio/checkout.types';
import { RadioGroup, RadioGroupItem, Label } from '@/compartido/ui';
import { CreditCard, Smartphone, Truck, Globe, Wallet } from 'lucide-react';
import { cn } from '@/compartido/lib/cn';

interface PaymentMethod {
  id: MetodoPago;
  nombre: string;
  descripcion: string;
  icon: React.ComponentType<{ className?: string }>;
  disponible: boolean;
}

const METODOS_PAGO: PaymentMethod[] = [
  {
    id: MetodoPago.PAYPAL,
    nombre: 'PayPal',
    descripcion: 'Pago seguro con PayPal',
    icon: Wallet,
    disponible: true,
  },
  {
    id: MetodoPago.RECURRENTE,
    nombre: 'Tarjeta Crédito/Débito',
    descripcion: 'Procesado por Recurrente (Visacuotas)',
    icon: CreditCard,
    disponible: true,
  },
  {
    id: MetodoPago.BILLETERA_FRI,
    nombre: 'Billetera Fri',
    descripcion: 'Pago rápido con QR/Enlace',
    icon: Smartphone,
    disponible: false,
  },
  {
    id: MetodoPago.CONTRA_ENTREGA,
    nombre: 'Pago Contra Entrega',
    descripcion: 'Paga en efectivo al recibir',
    icon: Truck,
    disponible: true,
  },
  {
    id: MetodoPago.TARJETA_INTERNACIONAL,
    nombre: 'Tarjeta Internacional',
    descripcion: 'Pago seguro con Stripe (USD)',
    icon: Globe,
    disponible: true,
  },
];

interface PaymentMethodSelectorProps {
  value: MetodoPago | undefined;
  onChange: (value: MetodoPago) => void;
  error?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold text-zinc-900">
          Método de Pago
        </Label>
        <p className="text-sm text-zinc-600">
          Selecciona cómo deseas pagar tu pedido
        </p>
      </div>

      <RadioGroup
        value={value || ''}
        onValueChange={onChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {METODOS_PAGO.map((metodo) => {
          const Icon = metodo.icon;
          const isSelected = value === metodo.id;

          return (
            <div key={metodo.id} className="relative">
              <RadioGroupItem
                value={metodo.id}
                id={`payment-method-${metodo.id}`}
                disabled={!metodo.disponible}
                className="peer sr-only"
              />
              <Label
                htmlFor={`payment-method-${metodo.id}`}
                className={cn(
                  'flex flex-col gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200',
                  'hover:border-zinc-300 hover:shadow-sm',
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 shadow-md'
                    : 'border-zinc-200 bg-white',
                  !metodo.disponible && 'opacity-50 cursor-not-allowed'
                )}
              >
                {/* Header con icono */}
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      'p-3 rounded-lg transition-colors',
                      isSelected ? 'bg-zinc-900' : 'bg-zinc-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6 transition-colors',
                        isSelected ? 'text-white' : 'text-zinc-700'
                      )}
                    />
                  </div>

                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-900 text-base">
                    {metodo.nombre}
                  </h3>
                  <p className="text-sm text-zinc-600 font-light">
                    {metodo.descripcion}
                  </p>
                </div>

                {/* Badge de disponibilidad */}
                {!metodo.disponible && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-zinc-200 text-zinc-600 text-xs font-medium rounded">
                      Próximamente
                    </span>
                  </div>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-red-600 font-medium mt-2">{error}</p>
      )}
    </div>
  );
}
