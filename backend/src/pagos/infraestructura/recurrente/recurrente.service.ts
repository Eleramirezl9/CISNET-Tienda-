/**
 * SERVICIO - Recurrente
 *
 * Integración con el procesador de pagos Recurrente (Guatemala)
 * Permite procesar pagos con tarjetas de crédito/débito
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface CrearCheckoutDto {
  monto: number;
  moneda: string;
  numeroOrden: string;
  descripcion?: string;
  urlExito?: string;
  urlCancelacion?: string;
  urlWebhook?: string;
}

interface CheckoutResponse {
  id: string;
  url: string;
  estado: string;
}

interface TransaccionResponse {
  id: string;
  estado: string;
  monto: number;
  moneda: string;
  numeroOrden: string;
  tarjeta?: {
    marca: string;
    ultimos4Digitos: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

@Injectable()
export class RecurrenteService {
  private readonly logger = new Logger(RecurrenteService.name);
  private readonly httpClient: AxiosInstance;
  private readonly baseURL: string;
  private readonly publicKey: string;
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseURL = this.configService.get<string>(
      'RECURRENTE_API_URL',
      'https://app.recurrente.com/api',
    );
    this.publicKey = this.configService.get<string>('RECURRENTE_PUBLIC_KEY') || '';
    this.secretKey = this.configService.get<string>('RECURRENTE_SECRET_KEY') || '';

    if (!this.publicKey || !this.secretKey) {
      throw new Error('Las credenciales de Recurrente no están configuradas');
    }

    // Cliente HTTP con configuración base
    // Recurrente requiere ambas claves en los headers
    this.httpClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-PUBLIC-KEY': this.publicKey,
        'X-SECRET-KEY': this.secretKey,
      },
      timeout: 30000,
    });
  }

  /**
   * Crear un checkout/sesión de pago
   *
   * TODO: Reemplazar con llamada real al API de Recurrente
   * Consultar documentación oficial en: https://docs.recurrente.com/
   * o en tu dashboard de Recurrente para obtener la URL correcta del API
   */
  async crearCheckout(datos: CrearCheckoutDto): Promise<CheckoutResponse> {
    try {
      // Según la documentación de Recurrente, usar endpoint /checkouts con items
      const checkoutPayload = {
        items: [
          {
            name: datos.descripcion || `Orden ${datos.numeroOrden}`,
            description: `Pago de orden ${datos.numeroOrden}`,
            amount_in_cents: Math.round(datos.monto * 100),
            currency: datos.moneda,
            quantity: 1,
          },
        ],
        success_url: datos.urlExito,
        cancel_url: datos.urlCancelacion,
        metadata: {
          numeroOrden: datos.numeroOrden,
        },
      };

      this.logger.log(`Creando checkout en Recurrente para orden ${datos.numeroOrden}`);
      this.logger.debug(`Payload: ${JSON.stringify(checkoutPayload, null, 2)}`);
      this.logger.debug(`URL: ${this.baseURL}/checkouts`);
      this.logger.debug(`Headers: X-PUBLIC-KEY=${this.publicKey.substring(0, 10)}..., X-SECRET-KEY=${this.secretKey.substring(0, 10)}...`);

      const response = await this.httpClient.post('/checkouts', checkoutPayload);

      // Log completo de la respuesta para debugging
      this.logger.debug(`Respuesta completa: ${JSON.stringify(response.data, null, 2)}`);

      const checkoutUrl = response.data.checkout_url || response.data.url || response.data.payment_url;
      const checkoutId = response.data.id;

      if (!checkoutUrl) {
        this.logger.error('No se pudo obtener URL de checkout de la respuesta');
        this.logger.error(`Respuesta: ${JSON.stringify(response.data)}`);
        throw new Error('No se pudo obtener URL de checkout');
      }

      this.logger.log(`Checkout creado: ${checkoutId} | URL: ${checkoutUrl}`);

      return {
        id: checkoutId,
        url: checkoutUrl,
        estado: response.data.status || 'pending',
      };
    } catch (error) {
      if (error.response) {
        this.logger.error('Error de Recurrente API:');
        this.logger.error(`Status: ${error.response.status}`);
        this.logger.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
        this.logger.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
      } else {
        this.logger.error('Error al crear checkout en Recurrente:', error.message);
      }
      throw new Error('No se pudo crear la sesión de pago con Recurrente');
    }
  }

  /**
   * Obtener detalles de una transacción
   */
  async obtenerTransaccion(
    transaccionId: string,
  ): Promise<TransaccionResponse> {
    try {
      const response = await this.httpClient.get(
        `/v1/transactions/${transaccionId}`,
      );

      return {
        id: response.data.id,
        estado: response.data.status,
        monto: response.data.amount,
        moneda: response.data.currency,
        numeroOrden: response.data.metadata?.numeroOrden,
        tarjeta: response.data.card
          ? {
              marca: response.data.card.brand,
              ultimos4Digitos: response.data.card.last4,
            }
          : undefined,
        fechaCreacion: response.data.created_at,
        fechaActualizacion: response.data.updated_at,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener transacción ${transaccionId} de Recurrente`,
        error,
      );
      throw new Error('No se pudieron obtener los detalles de la transacción');
    }
  }

  /**
   * Validar webhook signature para seguridad usando HMAC SHA256
   *
   * IMPORTANTE: Esta validación protege contra webhooks maliciosos
   * Recurrente firma los webhooks con HMAC-SHA256
   */
  validarWebhookSignature(payload: string, signature: string): boolean {
    const signingSecret = this.configService.get<string>(
      'RECURRENTE_SIGNING_SECRET',
    );

    if (!signingSecret) {
      this.logger.error('❌ RECURRENTE_SIGNING_SECRET no está configurado');
      return false;
    }

    if (!signature) {
      this.logger.warn('⚠️ Webhook sin firma - rechazado por seguridad');
      return false;
    }

    try {
      // Importar crypto de Node.js para HMAC
      const crypto = require('crypto');

      // Calcular HMAC SHA256 del payload
      const expectedSignature = crypto
        .createHmac('sha256', signingSecret)
        .update(payload)
        .digest('hex');

      // Comparación segura contra timing attacks
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );

      if (!isValid) {
        this.logger.warn('⚠️ Firma de webhook inválida - posible ataque');
      }

      return isValid;
    } catch (error) {
      this.logger.error('❌ Error al validar firma de webhook:', error.message);
      return false;
    }
  }
}
