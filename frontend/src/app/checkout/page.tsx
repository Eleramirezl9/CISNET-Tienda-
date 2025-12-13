/**
 * Página de Checkout - Finalizar Compra
 * Diseño optimizado para conversión con Swiss Style
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  checkoutFormSchema,
  type CheckoutFormData,
  MetodoPago,
  DEPARTAMENTOS_GT,
  placeOrder,
} from '@/caracteristicas/checkout';
import { PaymentMethodSelector } from '@/caracteristicas/checkout/ui/PaymentMethodSelector';
import { ResumenOrden } from '@/caracteristicas/checkout/ui/ResumenOrden';
import { PayPalButtonManual } from '@/caracteristicas/checkout/ui/PayPalButtonManual';
import { RecurrenteButton } from '@/caracteristicas/checkout/ui/RecurrenteButton';
import { StripeButton } from '@/caracteristicas/checkout/ui/StripeButton';
import { useCarrito } from '@/caracteristicas/carrito-compras';
import {
  Input,
  Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/compartido/ui';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { convertirGTQaUSD } from '@/compartido/lib/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    limpiarCarrito,
    subtotal,
    impuestos,
    envio,
    total,
  } = useCarrito();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mostrarPayPal, setMostrarPayPal] = useState(false);
  const [ordenCreada, setOrdenCreada] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      nombreCompleto: 'Juan José Pérez García',
      telefono: '12345678',
      email: 'juan.perez@ejemplo.com',
      direccion: 'Calle principal 10-25, casa con portón verde',
      departamento: 'Guatemala',
      municipio: 'Guatemala',
      zonaOColonia: 'Zona 10',
      referencia: 'Frente a la gasolinera Puma, casa de dos pisos',
      metodoPago: MetodoPago.PAYPAL,
      notas: '',
    },
  });

  const metodoPago = watch('metodoPago');

  const onSubmit = (data: CheckoutFormData) => {
    setError(null);

    // Si es PayPal, Recurrente o Stripe, solo validar el formulario y mostrar el botón
    if (
      data.metodoPago === MetodoPago.PAYPAL ||
      data.metodoPago === MetodoPago.RECURRENTE ||
      data.metodoPago === MetodoPago.TARJETA_INTERNACIONAL
    ) {
      setMostrarPayPal(true);
      return;
    }

    // Para otros métodos de pago, crear la orden directamente
    startTransition(async () => {
      try {
        // Llamar a la Server Action para crear la orden
        const resultado = await placeOrder(data, items, {
          subtotal,
          impuestos,
          envio,
          total,
        });

        if (resultado.success) {
          // Mostrar toast de éxito
          toast.success('¡Pedido confirmado!', {
            description: `Tu pedido #${resultado.data?.numeroOrden} ha sido recibido y está siendo procesado.`,
            duration: 5000,
          });

          // Limpiar carrito
          limpiarCarrito();

          // Redirigir a página de confirmación con el número de orden
          router.push(`/checkout/confirmacion?orden=${resultado.data?.numeroOrden}`);
        } else {
          // Mostrar toast de error
          toast.error('Error al procesar el pedido', {
            description: resultado.error || 'Ocurrió un error inesperado',
            duration: 5000,
          });

          setError(resultado.error || 'Error al procesar el pedido');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al procesar el pedido';

        toast.error('Error al procesar el pedido', {
          description: errorMessage,
          duration: 5000,
        });

        setError(errorMessage);
      }
    });
  };

  const crearOrdenYMostrarPayPal = async () => {
    const formData = watch();

    startTransition(async () => {
      try {
        const resultado = await placeOrder(formData, items, {
          subtotal,
          impuestos,
          envio,
          total,
        });

        if (resultado.success) {
          setOrdenCreada(resultado.data?.numeroOrden || null);
        } else {
          toast.error('Error al crear la orden', {
            description: resultado.error || 'Ocurrió un error inesperado',
          });
          setError(resultado.error || 'Error al crear la orden');
          setMostrarPayPal(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al crear la orden';
        toast.error('Error al crear la orden', {
          description: errorMessage,
        });
        setError(errorMessage);
        setMostrarPayPal(false);
      }
    });
  };

  const handlePayPalSuccess = async (details: any) => {
    try {
      toast.success('¡Pago completado con PayPal!', {
        description: 'Tu pedido ha sido confirmado y procesado.',
        duration: 5000,
      });

      limpiarCarrito();
      router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en handlePayPalSuccess:', error);
      }
    }
  };

  const handlePayPalError = (error: any) => {
    toast.error('Error en el pago', {
      description: 'No se pudo procesar el pago con PayPal. Intenta nuevamente.',
    });
    setError('Error al procesar el pago con PayPal');
  };

  // Mostrar mensaje si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-zinc-100 mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-zinc-600 mb-8">
              Agrega productos a tu carrito para continuar con el proceso de
              compra
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/productos"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar comprando
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                Finalizar Compra
              </h1>
              <p className="text-zinc-600 mt-1">
                Completa tu información para procesar el pedido
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-600">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span>Compra segura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-6">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Formulario (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Error global */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Sección: Datos Personales */}
              <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">
                  Datos Personales
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                    <Input
                      id="nombreCompleto"
                      {...register('nombreCompleto')}
                      placeholder="Juan José Pérez García"
                      className="mt-2"
                      disabled={isPending}
                    />
                    {errors.nombreCompleto && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.nombreCompleto.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        {...register('telefono')}
                        placeholder="12345678"
                        type="tel"
                        maxLength={8}
                        className="mt-2"
                        disabled={isPending}
                      />
                      {errors.telefono && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.telefono.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email (Opcional)</Label>
                      <Input
                        id="email"
                        {...register('email')}
                        placeholder="correo@ejemplo.com"
                        type="email"
                        className="mt-2"
                        disabled={isPending}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Dirección de Envío */}
              <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">
                  Dirección de Envío
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="direccion">Dirección Exacta *</Label>
                    <Input
                      id="direccion"
                      {...register('direccion')}
                      placeholder="Calle principal, casa #10"
                      className="mt-2"
                      disabled={isPending}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Incluye calle, número de casa, edificio, apartamento,
                      etc.
                    </p>
                    {errors.direccion && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.direccion.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="departamento">Departamento *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('departamento', value)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecciona departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTAMENTOS_GT.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.departamento && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.departamento.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="municipio">Municipio *</Label>
                      <Input
                        id="municipio"
                        {...register('municipio')}
                        placeholder="Guatemala"
                        className="mt-2"
                        disabled={isPending}
                      />
                      {errors.municipio && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.municipio.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zonaOColonia">Zona o Colonia *</Label>
                    <Input
                      id="zonaOColonia"
                      {...register('zonaOColonia')}
                      placeholder="Zona 10, Colonia Primavera"
                      className="mt-2"
                      disabled={isPending}
                    />
                    {errors.zonaOColonia && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.zonaOColonia.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="referencia">Referencia (Opcional)</Label>
                    <Input
                      id="referencia"
                      {...register('referencia')}
                      placeholder="Frente a la gasolinera, portón verde"
                      className="mt-2"
                      disabled={isPending}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Ayuda al repartidor a encontrar tu dirección más fácil
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección: Método de Pago */}
              <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8">
                <PaymentMethodSelector
                  value={metodoPago}
                  onChange={(value) => setValue('metodoPago', value)}
                  error={errors.metodoPago?.message}
                />
              </div>

              {/* Sección: Notas Adicionales */}
              <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">
                  Notas Adicionales (Opcional)
                </h2>

                <div>
                  <Label htmlFor="notas">
                    ¿Tienes alguna indicación especial?
                  </Label>
                  <textarea
                    id="notas"
                    {...register('notas')}
                    rows={4}
                    placeholder="Ej: Entregar después de las 2pm"
                    className="mt-2 w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all disabled:bg-zinc-50"
                    disabled={isPending}
                  />
                </div>
              </div>

            </div>

            {/* Columna Derecha - Resumen (1/3) - Solo visible en desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20">
                <ResumenOrden>
                  {/* Botón de pago integrado con efecto visual */}
                  <div className="relative">
                    {mostrarPayPal && metodoPago === MetodoPago.PAYPAL ? (
                      !ordenCreada ? (
                        <Button
                          onClick={crearOrdenYMostrarPayPal}
                          size="lg"
                          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          disabled={isPending}
                        >
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                          <span className="relative flex items-center justify-center gap-2">
                            {isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creando orden...
                              </>
                            ) : (
                              'Pagar con PayPal'
                            )}
                          </span>
                        </Button>
                      ) : (
                        <PayPalButtonManual
                          numeroOrden={ordenCreada}
                          monto={total}
                          onApprove={handlePayPalSuccess}
                          onError={handlePayPalError}
                        />
                      )
                    ) : mostrarPayPal && metodoPago === MetodoPago.RECURRENTE ? (
                      !ordenCreada ? (
                        <Button
                          onClick={crearOrdenYMostrarPayPal}
                          size="lg"
                          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          disabled={isPending}
                        >
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                          <span className="relative flex items-center justify-center gap-2">
                            {isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creando orden...
                              </>
                            ) : (
                              'Pagar con Tarjeta'
                            )}
                          </span>
                        </Button>
                      ) : (
                        <RecurrenteButton
                          numeroOrden={ordenCreada}
                          monto={total}
                          moneda="GTQ"
                          onSuccess={() => {
                            toast.success('¡Pago completado!');
                            limpiarCarrito();
                            router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
                          }}
                          onError={() => {
                            toast.error('Error en el pago');
                            setError('Error al procesar el pago');
                          }}
                        />
                      )
                    ) : mostrarPayPal && metodoPago === MetodoPago.TARJETA_INTERNACIONAL ? (
                      !ordenCreada ? (
                        <Button
                          onClick={crearOrdenYMostrarPayPal}
                          size="lg"
                          className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg transition-all duration-200"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Creando orden...
                            </>
                          ) : (
                            'Pagar con Stripe'
                          )}
                        </Button>
                      ) : (
                        <StripeButton
                          numeroOrden={ordenCreada}
                          monto={convertirGTQaUSD(total)}
                          moneda="USD"
                          onSuccess={() => {
                            toast.success('¡Pago completado!');
                            limpiarCarrito();
                            router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
                          }}
                          onError={() => {
                            toast.error('Error en el pago');
                            setError('Error al procesar el pago');
                          }}
                        />
                      )
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                        disabled={isPending}
                      >
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          {isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            'Confirmar Pedido'
                          )}
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Garantía compacta */}
                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mt-3">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Compra segura</span>
                  </div>
                </ResumenOrden>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Barra fija inferior para móviles */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-zinc-500">Total</p>
            <p className="text-lg font-bold text-zinc-900">Q {total.toFixed(2)}</p>
          </div>
          {mostrarPayPal ? (
            metodoPago === MetodoPago.PAYPAL ? (
              !ordenCreada ? (
                <Button
                  onClick={crearOrdenYMostrarPayPal}
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Pagar con PayPal'
                  )}
                </Button>
              ) : (
                <div className="flex-1">
                  <PayPalButtonManual
                    numeroOrden={ordenCreada}
                    monto={total}
                    onApprove={handlePayPalSuccess}
                    onError={handlePayPalError}
                  />
                </div>
              )
            ) : metodoPago === MetodoPago.RECURRENTE ? (
              !ordenCreada ? (
                <Button
                  onClick={crearOrdenYMostrarPayPal}
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Pagar con Tarjeta'
                  )}
                </Button>
              ) : (
                <div className="flex-1">
                  <RecurrenteButton
                    numeroOrden={ordenCreada}
                    monto={total}
                    moneda="GTQ"
                    onSuccess={() => {
                      toast.success('¡Pago completado!');
                      limpiarCarrito();
                      router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
                    }}
                    onError={() => {
                      toast.error('Error en el pago');
                      setError('Error al procesar el pago');
                    }}
                  />
                </div>
              )
            ) : metodoPago === MetodoPago.TARJETA_INTERNACIONAL ? (
              !ordenCreada ? (
                <Button
                  onClick={crearOrdenYMostrarPayPal}
                  size="lg"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Pagar con Stripe'
                  )}
                </Button>
              ) : (
                <div className="flex-1">
                  <StripeButton
                    numeroOrden={ordenCreada}
                    monto={convertirGTQaUSD(total)}
                    moneda="USD"
                    onSuccess={() => {
                      toast.success('¡Pago completado!');
                      limpiarCarrito();
                      router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
                    }}
                    onError={() => {
                      toast.error('Error en el pago');
                      setError('Error al procesar el pago');
                    }}
                  />
                </div>
              )
            ) : (
              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Confirmar Pedido'
                )}
              </Button>
            )
          ) : (
            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
