/**
 * ENTIDAD DE DOMINIO - Pago
 *
 * Representa un pago en el sistema
 * No tiene dependencias de frameworks ni infraestructura
 */

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  PROCESANDO = 'PROCESANDO',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
  CANCELADO = 'CANCELADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

export enum MetodoPagoEnum {
  PAYPAL = 'paypal',
  RECURRENTE = 'recurrente',
  TARJETA_GT = 'tarjeta_gt',
  BILLETERA_FRI = 'billetera_fri',
  CONTRA_ENTREGA = 'contra_entrega',
  TARJETA_INTERNACIONAL = 'tarjeta_internacional',
}

/**
 * Información de transacción externa (PayPal, Recurrente, etc.)
 */
export class TransaccionExterna {
  constructor(
    public readonly transaccionId: string,
    public readonly proveedor: string, // 'paypal', 'recurrente'
    public readonly estado: string,
    public readonly metadatos?: Record<string, unknown>,
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.transaccionId || this.transaccionId.trim().length === 0) {
      throw new Error('El ID de transacción es requerido');
    }

    if (!this.proveedor || this.proveedor.trim().length === 0) {
      throw new Error('El proveedor es requerido');
    }
  }
}

/**
 * Pago - Entidad raíz
 */
export class Pago {
  constructor(
    public readonly id: string,
    public readonly numeroOrden: string,
    public readonly metodoPago: MetodoPagoEnum,
    public readonly monto: number,
    public readonly moneda: string,
    public estado: EstadoPago,
    public transaccionExterna: TransaccionExterna | null,
    public readonly fechaCreacion: Date,
    public fechaActualizacion: Date,
    public motivoFallo?: string,
  ) {
    this.validar();
  }

  /**
   * Validaciones de reglas de negocio
   */
  private validar(): void {
    if (!this.numeroOrden || this.numeroOrden.trim().length === 0) {
      throw new Error('El número de orden es requerido');
    }

    if (this.monto <= 0) {
      throw new Error('El monto debe ser positivo');
    }

    if (!this.moneda || this.moneda.trim().length === 0) {
      throw new Error('La moneda es requerida');
    }
  }

  /**
   * Métodos de negocio
   */

  public marcarComoProcesando(): void {
    if (this.estado !== EstadoPago.PENDIENTE) {
      throw new Error(
        `No se puede procesar un pago en estado ${this.estado}`,
      );
    }

    this.estado = EstadoPago.PROCESANDO;
    this.fechaActualizacion = new Date();
  }

  public marcarComoCompletado(transaccion: TransaccionExterna): void {
    if (
      this.estado !== EstadoPago.PENDIENTE &&
      this.estado !== EstadoPago.PROCESANDO
    ) {
      throw new Error(
        `No se puede completar un pago en estado ${this.estado}`,
      );
    }

    this.estado = EstadoPago.COMPLETADO;
    this.transaccionExterna = transaccion;
    this.fechaActualizacion = new Date();
  }

  public marcarComoFallido(motivo: string): void {
    if (this.estado === EstadoPago.COMPLETADO) {
      throw new Error('No se puede marcar como fallido un pago completado');
    }

    this.estado = EstadoPago.FALLIDO;
    this.motivoFallo = motivo;
    this.fechaActualizacion = new Date();
  }

  public marcarComoCancelado(): void {
    if (this.estado === EstadoPago.COMPLETADO) {
      throw new Error('No se puede cancelar un pago completado');
    }

    this.estado = EstadoPago.CANCELADO;
    this.fechaActualizacion = new Date();
  }

  public puedeSerReembolsado(): boolean {
    return this.estado === EstadoPago.COMPLETADO;
  }

  public reembolsar(): void {
    if (!this.puedeSerReembolsado()) {
      throw new Error(
        `No se puede reembolsar un pago en estado ${this.estado}`,
      );
    }

    this.estado = EstadoPago.REEMBOLSADO;
    this.fechaActualizacion = new Date();
  }

  public esPagoElectronico(): boolean {
    return (
      this.metodoPago === MetodoPagoEnum.PAYPAL ||
      this.metodoPago === MetodoPagoEnum.RECURRENTE ||
      this.metodoPago === MetodoPagoEnum.TARJETA_GT ||
      this.metodoPago === MetodoPagoEnum.TARJETA_INTERNACIONAL
    );
  }

  public obtenerResumen(): string {
    return `Pago ${this.id} - ${this.metodoPago} - ${this.moneda} ${this.monto.toFixed(2)} - ${this.estado}`;
  }
}
