/**
 * USE CASE - Crear Pago con PayPal
 *
 * Crea una orden de pago en PayPal y registra el pago en el sistema
 */

import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
  Pago,
  EstadoPago,
  MetodoPagoEnum,
} from '@/pagos/dominio/entidades/pago.entidad';
import {
  PAGO_REPOSITORIO,
  PagoRepositorio,
} from '@/pagos/dominio/repositorios/pago.repositorio';
import { PayPalService } from '@/pagos/infraestructura/paypal/paypal.service';
import {
  ORDEN_REPOSITORIO,
  OrdenRepositorio,
} from '@/ordenes/dominio/repositorios/orden.repositorio';

export interface CrearPagoPayPalDto {
  numeroOrden: string;
  monto: number;
  moneda?: string;
  descripcion?: string;
}

@Injectable()
export class CrearPagoPayPalUseCase {
  constructor(
    @Inject(PAGO_REPOSITORIO)
    private readonly pagoRepositorio: PagoRepositorio,
    @Inject(ORDEN_REPOSITORIO)
    private readonly ordenRepositorio: OrdenRepositorio,
    private readonly paypalService: PayPalService,
    private readonly configService: ConfigService,
  ) {}

  async ejecutar(dto: CrearPagoPayPalDto): Promise<{
    pagoId: string;
    paypalOrderId: string;
    approveUrl: string;
  }> {
    // 1. Validar que la orden exista
    const orden = await this.ordenRepositorio.buscarPorNumeroOrden(dto.numeroOrden);

    if (!orden) {
      throw new BadRequestException(
        `Orden con número ${dto.numeroOrden} no encontrada`,
      );
    }

    // 2. Validar que el monto coincida con la orden
    const tipoCambio = Number(
      this.configService.get<string>('EXCHANGE_RATE_GTQ_TO_USD', '7.80'),
    );
    const montoEsperadoUSD = Number((orden.total / tipoCambio).toFixed(2));
    const diferencia = Math.abs(dto.monto - montoEsperadoUSD);

    // Permitir diferencia máxima de 0.02 USD debido a redondeos
    if (diferencia > 0.02) {
      throw new BadRequestException(
        `El monto no coincide con la orden. Esperado: $${montoEsperadoUSD} USD, Recibido: $${dto.monto} USD`,
      );
    }

    // 3. Crear orden en PayPal
    const ordenPayPal = await this.paypalService.crearOrden({
      monto: montoEsperadoUSD,
      moneda: dto.moneda || 'USD',
      numeroOrden: dto.numeroOrden,
      descripcion: dto.descripcion,
    });

    // 4. Crear entidad de Pago
    const pago = new Pago(
      uuidv4(),
      dto.numeroOrden,
      MetodoPagoEnum.PAYPAL,
      montoEsperadoUSD,
      dto.moneda || 'USD',
      EstadoPago.PENDIENTE,
      null, // Aún no hay transacción completada
      new Date(),
      new Date(),
    );

    // 5. Guardar pago en BD
    await this.pagoRepositorio.guardar(pago);

    // 6. Buscar el enlace de aprobación
    const approveLink = ordenPayPal.links.find((link) => link.rel === 'approve');

    return {
      pagoId: pago.id,
      paypalOrderId: ordenPayPal.id,
      approveUrl: approveLink?.href || '',
    };
  }
}
