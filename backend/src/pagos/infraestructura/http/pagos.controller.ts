/**
 * CONTROLADOR HTTP - Pagos
 *
 * Maneja las peticiones HTTP relacionadas con procesamiento de pagos
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  BadRequestException,
  NotFoundException,
  Headers,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PayPalService } from '@/pagos/infraestructura/paypal/paypal.service';
import { RecurrenteService } from '@/pagos/infraestructura/recurrente/recurrente.service';
import { BuscarOrdenPorNumeroUseCase } from '@/ordenes/aplicacion/casos-uso/buscar-orden-por-numero.use-case';
import { ActualizarEstadoOrdenUseCase } from '@/ordenes/aplicacion/casos-uso/actualizar-estado-orden.use-case';
import { ConfigService } from '@nestjs/config';
import { EstadoOrden } from '@/ordenes/dominio/entidades/orden.entidad';
import { PrismaService } from '@/compartido/infraestructura/prisma/prisma.service';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
  private readonly logger = new Logger(PagosController.name);

  constructor(
    private readonly paypalService: PayPalService,
    private readonly recurrenteService: RecurrenteService,
    private readonly buscarOrdenPorNumero: BuscarOrdenPorNumeroUseCase,
    private readonly actualizarEstadoOrden: ActualizarEstadoOrdenUseCase,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('paypal/crear-orden')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Crear orden de pago en PayPal',
    description:
      'Crea una orden de pago en PayPal y retorna el ID y enlaces de aprobación',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden de PayPal creada exitosamente',
    schema: {
      example: {
        id: '8JK12345678901234',
        status: 'CREATED',
        approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=8JK12345678901234',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
  })
  async crearOrdenPayPal(
    @Body()
    datos: {
      monto: number;
      numeroOrden: string;
      moneda?: string;
      descripcion?: string;
    },
  ) {
    if (!datos.monto || datos.monto <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    if (!datos.numeroOrden) {
      throw new BadRequestException('El número de orden es requerido');
    }

    // SEGURIDAD: Validar que la orden exista en nuestra BD
    const ordenBD = await this.buscarOrdenPorNumero.ejecutar(datos.numeroOrden);

    // SEGURIDAD: Validar que el monto coincida con la orden
    const tipoCambio = Number(
      this.configService.get<string>('EXCHANGE_RATE_GTQ_TO_USD', '7.80'),
    );
    const montoEsperadoUSD = Number((ordenBD.total / tipoCambio).toFixed(2));
    const diferencia = Math.abs(datos.monto - montoEsperadoUSD);

    // Permitir diferencia máxima de 0.02 USD debido a redondeos
    if (diferencia > 0.02) {
      throw new BadRequestException(
        `El monto no coincide con la orden. Esperado: $${montoEsperadoUSD} USD, Recibido: $${datos.monto} USD`,
      );
    }

    const orden = await this.paypalService.crearOrden({
      monto: montoEsperadoUSD, // Usar el monto validado de la BD
      moneda: datos.moneda || 'USD',
      numeroOrden: datos.numeroOrden,
      descripcion: datos.descripcion,
    });

    // Guardar el PayPal Order ID en la BD
    await this.prisma.orden.update({
      where: { numeroOrden: datos.numeroOrden },
      data: {
        paypalOrderId: orden.id,
      },
    });

    // Buscar el enlace de aprobación
    const approveLink = orden.links.find((link) => link.rel === 'approve');

    return {
      id: orden.id,
      status: orden.status,
      approveUrl: approveLink?.href || null,
    };
  }

  @Post('paypal/capturar/:ordenId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Capturar pago de PayPal',
    description:
      'Captura el pago de una orden de PayPal después de que el usuario la apruebe',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago capturado exitosamente',
    schema: {
      example: {
        id: '8JK12345678901234',
        status: 'COMPLETED',
        payer: {
          email_address: 'buyer@example.com',
          name: {
            given_name: 'John',
            surname: 'Doe',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID de orden inválido o pago no puede ser capturado',
  })
  async capturarPagoPayPal(@Param('ordenId') ordenId: string) {
    if (!ordenId) {
      throw new BadRequestException('El ID de orden es requerido');
    }

    try {
      // 1. Buscar la orden en nuestra BD que tiene este PayPal Order ID
      const ordenBD = await this.prisma.orden.findFirst({
        where: { paypalOrderId: ordenId },
      });

      if (!ordenBD) {
        throw new NotFoundException(
          'No se encontró una orden asociada a este pago de PayPal',
        );
      }

      // 2. Capturar el pago en PayPal
      const captura = await this.paypalService.capturarPago(ordenId);

      // 3. SEGURIDAD: Validar que el monto capturado coincida con la orden
      const tipoCambio = Number(
        this.configService.get<string>('EXCHANGE_RATE_GTQ_TO_USD', '7.80'),
      );
      const montoEsperadoUSD = Number(
        (Number(ordenBD.total) / tipoCambio).toFixed(2),
      );
      const montoPagadoUSD = Number(
        captura.purchase_units[0]?.payments?.captures?.[0]?.amount?.value ||
          '0',
      );
      const diferencia = Math.abs(montoPagadoUSD - montoEsperadoUSD);

      if (diferencia > 0.02) {
        throw new BadRequestException(
          `El monto pagado no coincide. Esperado: $${montoEsperadoUSD}, Pagado: $${montoPagadoUSD}`,
        );
      }

      // 4. Actualizar la orden en nuestra BD con los datos de PayPal
      const transactionId =
        captura.purchase_units[0]?.payments?.captures?.[0]?.id || null;

      await this.prisma.orden.update({
        where: { numeroOrden: ordenBD.numeroOrden },
        data: {
          paypalCaptureId: transactionId,
          estadoPago: captura.status === 'COMPLETED' ? 'COMPLETADO' : 'PENDIENTE',
          estado:
            captura.status === 'COMPLETED'
              ? EstadoOrden.CONFIRMADA
              : ordenBD.estado,
          fechaActualizacion: new Date(),
        },
      });

      return {
        id: captura.id,
        status: captura.status,
        payer: captura.payer,
        transactionId,
        numeroOrden: ordenBD.numeroOrden,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'No se pudo capturar el pago. Verifica que la orden esté aprobada.',
      );
    }
  }

  @Post('paypal/detalles/:ordenId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener detalles de orden PayPal',
    description: 'Obtiene los detalles completos de una orden de PayPal',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles obtenidos exitosamente',
  })
  async obtenerDetallesPayPal(@Param('ordenId') ordenId: string) {
    if (!ordenId) {
      throw new BadRequestException('El ID de orden es requerido');
    }

    try {
      const detalles = await this.paypalService.obtenerDetallesOrden(ordenId);
      return detalles;
    } catch (error) {
      throw new BadRequestException('No se pudieron obtener los detalles de la orden');
    }
  }

  @Post('recurrente/crear-checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Crear checkout de Recurrente',
    description: 'Crea una sesión de pago con Recurrente para tarjetas',
  })
  async crearCheckoutRecurrente(
    @Body() datos: { numeroOrden: string; monto: number; moneda?: string },
  ) {
    // 1. Validar que la orden exista
    const ordenBD = await this.buscarOrdenPorNumero.ejecutar(datos.numeroOrden);

    // 2. Validar monto (usar tipo de cambio si es necesario)
    const tipoCambio = Number(
      this.configService.get('EXCHANGE_RATE_GTQ_TO_USD', '7.80'),
    );

    // Si el monto viene en USD pero la orden está en GTQ
    const montoEsperado =
      datos.moneda === 'USD'
        ? Number((ordenBD.total / tipoCambio).toFixed(2))
        : ordenBD.total;

    const diferencia = Math.abs(datos.monto - montoEsperado);

    if (diferencia > 1.0) {
      // Tolerancia de Q1.00 o $0.10
      throw new BadRequestException(
        `El monto no coincide con la orden. Esperado: ${montoEsperado}, Recibido: ${datos.monto}`,
      );
    }

    // 3. Crear checkout en Recurrente
    const checkout = await this.recurrenteService.crearCheckout({
      monto: montoEsperado,
      moneda: datos.moneda || 'GTQ',
      numeroOrden: datos.numeroOrden,
      urlExito: `${process.env.FRONTEND_URL}/checkout/confirmacion?orden=${datos.numeroOrden}`,
      urlCancelacion: `${process.env.FRONTEND_URL}/checkout`,
      urlWebhook: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/pagos/recurrente/webhook`,
    });

    // 4. Guardar checkout ID en la BD
    await this.prisma.orden.update({
      where: { numeroOrden: datos.numeroOrden },
      data: {
        recurrenteCheckoutId: checkout.id,
      },
    });

    return {
      checkoutId: checkout.id,
      checkoutUrl: checkout.url,
      estado: checkout.estado,
    };
  }

  @Post('recurrente/webhook')
  @HttpCode(HttpStatus.OK)
  async webhookRecurrente(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log(`Webhook Recurrente recibido: ${payload.event_type}`);

    // 1. Validar la firma del webhook
    const isValid = this.recurrenteService.validarWebhookSignature(
      JSON.stringify(payload),
      signature,
    );

    if (!isValid) {
      this.logger.warn('Firma de webhook inválida');
      throw new BadRequestException('Firma de webhook inválida');
    }

    // 2. Extraer información del producto/orden
    const productMetadata = payload.products?.[0]?.metadata;
    const numeroOrden = productMetadata?.numeroOrden;
    const checkoutId = payload.checkout?.id;
    const paymentIntentId = payload.id;

    if (!numeroOrden && !checkoutId) {
      this.logger.warn('Webhook sin información de orden');
      return { received: true };
    }

    // 3. Buscar orden asociada
    let ordenBD;
    if (numeroOrden) {
      ordenBD = await this.prisma.orden.findFirst({
        where: { numeroOrden },
      });
    } else if (checkoutId) {
      ordenBD = await this.prisma.orden.findFirst({
        where: { recurrenteCheckoutId: checkoutId },
      });
    }

    if (!ordenBD) {
      this.logger.warn(`Orden no encontrada: ${numeroOrden || checkoutId}`);
      return { received: true };
    }

    // 4. Procesar evento según el tipo
    switch (payload.event_type) {
      case 'payment_intent.succeeded':
      case 'payment.succeeded':
        this.logger.log(`Pago exitoso para orden ${ordenBD.numeroOrden}`);
        await this.prisma.orden.update({
          where: { numeroOrden: ordenBD.numeroOrden },
          data: {
            estadoPago: 'COMPLETADO',
            estado: EstadoOrden.CONFIRMADA,
            recurrenteTransactionId: paymentIntentId,
            fechaActualizacion: new Date(),
          },
        });
        break;

      case 'payment_intent.failed':
      case 'payment.failed':
        this.logger.log(
          `Pago fallido para orden ${ordenBD.numeroOrden}: ${payload.failure_reason}`,
        );
        await this.prisma.orden.update({
          where: { numeroOrden: ordenBD.numeroOrden },
          data: {
            estadoPago: 'FALLIDO',
            recurrenteTransactionId: paymentIntentId,
            fechaActualizacion: new Date(),
          },
        });
        break;

      case 'payment_intent.canceled':
      case 'payment.canceled':
        this.logger.log(`Pago cancelado para orden ${ordenBD.numeroOrden}`);
        await this.prisma.orden.update({
          where: { numeroOrden: ordenBD.numeroOrden },
          data: {
            estadoPago: 'CANCELADO',
            recurrenteTransactionId: paymentIntentId,
            fechaActualizacion: new Date(),
          },
        });
        break;

      default:
        this.logger.log(`Evento no manejado: ${payload.event_type}`);
    }

    return { received: true };
  }
}
