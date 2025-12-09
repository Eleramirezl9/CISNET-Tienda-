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

    // Si es PayPal o Recurrente, solo validar el formulario y mostrar el botón
    if (data.metodoPago === MetodoPago.PAYPAL || data.metodoPago === MetodoPago.RECURRENTE) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

              {/* Botón de submit / PayPal (móvil) */}
              <div className="lg:hidden">
                {mostrarPayPal && metodoPago === MetodoPago.PAYPAL ? (
                  <div className="bg-white rounded-lg border border-zinc-200 p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                      Completa tu pago con PayPal
                    </h3>
                    {!ordenCreada ? (
                      <Button
                        onClick={crearOrdenYMostrarPayPal}
                        size="lg"
                        className="w-full"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Creando orden...
                          </>
                        ) : (
                          'Continuar con PayPal'
                        )}
                      </Button>
                    ) : (
                      <PayPalButtonManual
                        numeroOrden={ordenCreada}
                        monto={total}
                        onApprove={handlePayPalSuccess}
                        onError={handlePayPalError}
                      />
                    )}
                  </div>
                ) : mostrarPayPal && metodoPago === MetodoPago.RECURRENTE ? (
                  <div className="bg-white rounded-lg border border-zinc-200 p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                      Completa tu pago con Tarjeta
                    </h3>
                    {!ordenCreada ? (
                      <Button
                        onClick={crearOrdenYMostrarPayPal}
                        size="lg"
                        className="w-full"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Creando orden...
                          </>
                        ) : (
                          'Continuar con Tarjeta'
                        )}
                      </Button>
                    ) : (
                      <RecurrenteButton
                        numeroOrden={ordenCreada}
                        monto={total}
                        moneda="GTQ"
                        onSuccess={() => {
                          toast.success('¡Pago completado con tarjeta!', {
                            description: 'Tu pedido ha sido confirmado y procesado.',
                            duration: 5000,
                          });
                          limpiarCarrito();
                          router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
                        }}
                        onError={(error) => {
                          toast.error('Error en el pago', {
                            description: 'No se pudo procesar el pago. Intenta nuevamente.',
                          });
                          setError('Error al procesar el pago con Recurrente');
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Procesando pedido...
                      </>
                    ) : (
                      'Confirmar Pedido'
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Columna Derecha - Resumen (1/3) */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <ResumenOrden />

                {/* Botón de submit / PayPal (desktop) */}
                <div className="hidden lg:block">
                  {mostrarPayPal && metodoPago === MetodoPago.PAYPAL ? (
                    <div className="bg-white rounded-lg border border-zinc-200 p-6">
                      <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                        Completa tu pago con PayPal
                      </h3>
                      {!ordenCreada ? (
                        <Button
                          onClick={crearOrdenYMostrarPayPal}
                          size="lg"
                          className="w-full"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Creando orden...
                            </>
                          ) : (
                            'Continuar con PayPal'
                          )}
                        </Button>
                      ) : (
                        <PayPalButtonManual
                          numeroOrden={ordenCreada}
                          monto={total}
                          onApprove={handlePayPalSuccess}
                          onError={handlePayPalError}
                        />
                      )}
                    </div>
                  ) : mostrarPayPal && metodoPago === MetodoPago.RECURRENTE ? (
                    <div className="bg-white rounded-lg border border-zinc-200 p-6">
                      <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                        Completa tu pago con Tarjeta
                      </h3>
                      {!ordenCreada ? (
                        <Button
                          onClick={crearOrdenYMostrarPayPal}
                          size="lg"
                          className="w-full"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Creando orden...
                            </>
                          ) : (
                            'Continuar con Tarjeta'
                          )}
                        </Button>
                      ) : (
                        <RecurrenteButton
                          numeroOrden={ordenCreada}
                          monto={total}
                          moneda="GTQ"
                          onSuccess={() => {
                            toast.success('¡Pago completado con tarjeta!', {
                              description: 'Tu pedido ha sido confirmado y procesado.',
                              duration: 5000,
                            });
                            limpiarCarrito();
                            router.push(`/checkout/confirmacion?orden=${ordenCreada}`);
                          }}
                          onError={(error) => {
                            toast.error('Error en el pago', {
                              description: 'No se pudo procesar el pago. Intenta nuevamente.',
                            });
                            setError('Error al procesar el pago con Recurrente');
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : (
                        'Confirmar Pedido'
                      )}
                    </Button>
                  )}
                </div>

                {/* Garantías */}
                <div className="bg-zinc-50 rounded-lg p-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-zinc-900">
                        Compra Protegida
                      </p>
                      <p className="text-zinc-600 text-xs mt-1">
                        Tus datos están seguros con encriptación SSL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
