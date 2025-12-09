/**
 * SERVICIO - PayPal
 *
 * Maneja la integración con PayPal para procesamiento de pagos
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paypal = require('@paypal/checkout-server-sdk');

// Tipos para PayPal SDK (no tiene tipados oficiales) - EXPORTADOS para uso en controllers
export type PayPalClient = {
  execute: (request: unknown) => Promise<{ result: Record<string, unknown> }>;
};

export type PayPalEnvironment = unknown;

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalPayer {
  email_address?: string;
  payer_id?: string;
  name?: {
    given_name?: string;
    surname?: string;
  };
}

export interface PayPalPurchaseUnit {
  payments?: {
    captures?: Array<{
      id: string;
      amount: {
        value: string;
        currency_code: string;
      };
    }>;
  };
}

@Injectable()
export class PayPalService {
  private readonly logger = new Logger(PayPalService.name);
  private client: PayPalClient;

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  /**
   * Inicializar el cliente de PayPal
   */
  private initializeClient(): void {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const mode = this.configService.get<string>('PAYPAL_MODE', 'sandbox');

    if (!clientId || !clientSecret) {
      this.logger.error('❌ Credenciales de PayPal no configuradas');
      throw new Error('Credenciales de PayPal no configuradas');
    }

    // Configurar entorno (sandbox o production)
    let environment: PayPalEnvironment;
    if (mode === 'production') {
      environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
      this.logger.log('✅ PayPal inicializado en modo PRODUCTION');
    } else {
      environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
      this.logger.log('✅ PayPal inicializado en modo SANDBOX');
    }

    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  /**
   * Crear una orden de PayPal
   */
  async crearOrden(datos: {
    monto: number;
    moneda: string;
    numeroOrden: string;
    descripcion?: string;
  }): Promise<{ id: string; status: string; links: PayPalLink[] }> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: datos.numeroOrden,
          description: datos.descripcion || `Orden ${datos.numeroOrden}`,
          amount: {
            currency_code: datos.moneda,
            value: datos.monto.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'Tienda E-commerce',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${this.configService.get<string>('FRONTEND_URL')}/checkout/confirmacion`,
        cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/checkout`,
      },
    });

    try {
      this.logger.log(`Creando orden PayPal para ${datos.numeroOrden} - ${datos.moneda} ${datos.monto}`);
      const response = await this.client.execute(request);

      this.logger.log(`✅ Orden PayPal creada: ${response.result.id}`);

      return {
        id: response.result.id as string,
        status: response.result.status as string,
        links: response.result.links as PayPalLink[],
      };
    } catch (error) {
      this.logger.error('❌ Error al crear orden PayPal:', error.message);
      this.logger.debug(error.stack);
      throw error;
    }
  }

  /**
   * Capturar el pago de una orden de PayPal
   */
  async capturarPago(
    ordenId: string,
  ): Promise<{
    id: string;
    status: string;
    payer: PayPalPayer;
    purchase_units: PayPalPurchaseUnit[];
  }> {
    const request = new paypal.orders.OrdersCaptureRequest(ordenId);
    request.requestBody({});

    try {
      this.logger.log(`Capturando pago PayPal: ${ordenId}`);
      const response = await this.client.execute(request);

      this.logger.log(`✅ Pago PayPal capturado: ${response.result.id} - Estado: ${response.result.status}`);

      return {
        id: response.result.id as string,
        status: response.result.status as string,
        payer: response.result.payer as PayPalPayer,
        purchase_units: response.result.purchase_units as PayPalPurchaseUnit[],
      };
    } catch (error) {
      this.logger.error(`❌ Error al capturar pago PayPal ${ordenId}:`, error.message);
      this.logger.debug(error.stack);
      throw error;
    }
  }

  /**
   * Obtener detalles de una orden de PayPal
   */
  async obtenerDetallesOrden(ordenId: string): Promise<Record<string, unknown>> {
    const request = new paypal.orders.OrdersGetRequest(ordenId);

    try {
      this.logger.debug(`Obteniendo detalles de orden PayPal: ${ordenId}`);
      const response = await this.client.execute(request);
      return response.result as Record<string, unknown>;
    } catch (error) {
      this.logger.error(`❌ Error al obtener detalles de orden PayPal ${ordenId}:`, error.message);
      this.logger.debug(error.stack);
      throw error;
    }
  }
}
