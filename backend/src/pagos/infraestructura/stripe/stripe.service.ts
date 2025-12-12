/**
 * SERVICIO - Stripe
 *
 * Integración con el procesador de pagos Stripe (Pagos Internacionales)
 * Permite procesar pagos con tarjetas de crédito/débito en USD
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

interface CrearCheckoutDto {
  monto: number;
  moneda: string;
  numeroOrden: string;
  descripcion?: string;
  urlExito?: string;
  urlCancelacion?: string;
}

interface CheckoutResponse {
  id: string;
  url: string;
  estado: string;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly publicKey: string;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.publicKey =
      this.configService.get<string>('STRIPE_PUBLIC_KEY') || '';
    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';

    if (!secretKey) {
      this.logger.error('STRIPE_SECRET_KEY no está configurada');
      throw new Error('Las credenciales de Stripe no están configuradas');
    }

    // Validar webhook secret en producción
    const mode = this.configService.get<string>('STRIPE_MODE', 'test');
    if (mode === 'live' && !this.webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET es requerido en modo producción');
      throw new Error('STRIPE_WEBHOOK_SECRET es requerido en modo producción');
    }

    if (!this.webhookSecret) {
      this.logger.warn(
        'STRIPE_WEBHOOK_SECRET no configurado - webhooks no serán validados',
      );
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });

    this.logger.log(`Stripe inicializado en modo ${mode.toUpperCase()}`);
  }

  /**
   * Obtener la clave pública de Stripe para el frontend
   */
  obtenerClavePublica(): string {
    return this.publicKey;
  }

  /**
   * Crear una sesión de checkout de Stripe
   */
  async crearCheckout(datos: CrearCheckoutDto): Promise<CheckoutResponse> {
    try {
      const frontendUrl = this.configService.get<string>(
        'FRONTEND_URL',
        'http://localhost:3000',
      );

      this.logger.log(
        `Creando checkout en Stripe para orden ${datos.numeroOrden}`,
      );

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: datos.moneda.toLowerCase(),
              product_data: {
                name: datos.descripcion || `Orden ${datos.numeroOrden}`,
                description: `Pago de orden ${datos.numeroOrden}`,
              },
              unit_amount: Math.round(datos.monto * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url:
          datos.urlExito ||
          `${frontendUrl}/checkout/confirmacion?orden=${datos.numeroOrden}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: datos.urlCancelacion || `${frontendUrl}/checkout`,
        metadata: {
          numeroOrden: datos.numeroOrden,
        },
      });

      this.logger.log(`Checkout de Stripe creado: ${session.id}`);

      return {
        id: session.id,
        url: session.url || '',
        estado: session.payment_status,
      };
    } catch (error) {
      this.logger.error(
        'Error al crear checkout en Stripe:',
        error instanceof Error ? error.message : error,
      );
      throw new Error('No se pudo crear la sesión de pago con Stripe');
    }
  }

  /**
   * Obtener detalles de una sesión de checkout
   */
  async obtenerSesion(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      this.logger.error(
        `Error al obtener sesión de Stripe ${sessionId}:`,
        error instanceof Error ? error.message : error,
      );
      throw new Error('No se pudieron obtener los detalles de la sesión');
    }
  }

  /**
   * Obtener detalles de un PaymentIntent
   */
  async obtenerPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Error al obtener PaymentIntent ${paymentIntentId}:`,
        error instanceof Error ? error.message : error,
      );
      throw new Error('No se pudieron obtener los detalles del pago');
    }
  }

  /**
   * Validar webhook signature de Stripe
   */
  validarWebhookSignature(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event | null {
    if (!this.webhookSecret) {
      this.logger.warn('STRIPE_WEBHOOK_SECRET no está configurado');
      return null;
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );
      return event;
    } catch (error) {
      this.logger.error(
        'Error al validar firma de webhook de Stripe:',
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  }

  /**
   * Crear un reembolso
   */
  async crearReembolso(
    paymentIntentId: string,
    monto?: number,
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (monto) {
        refundParams.amount = Math.round(monto * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);
      this.logger.log(`Reembolso creado: ${refund.id}`);
      return refund;
    } catch (error) {
      this.logger.error(
        'Error al crear reembolso en Stripe:',
        error instanceof Error ? error.message : error,
      );
      throw new Error('No se pudo procesar el reembolso');
    }
  }
}
