/**
 * ENTIDAD DE DOMINIO - Orden
 *
 * Esta es la representación pura del concepto de negocio "Orden"
 * No tiene dependencias de frameworks ni infraestructura
 */

export enum EstadoOrden {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  EN_PROCESO = 'en_proceso',
  ENVIADA = 'enviada',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada',
}

export enum MetodoPago {
  PAYPAL = 'paypal',
  RECURRENTE = 'recurrente',
  TARJETA_GT = 'tarjeta_gt',
  BILLETERA_FRI = 'billetera_fri',
  CONTRA_ENTREGA = 'contra_entrega',
  TARJETA_INTERNACIONAL = 'tarjeta_internacional',
}

/**
 * Item de una orden
 */
export class ItemOrden {
  constructor(
    public readonly productoId: string,
    public readonly nombreProducto: string,
    public readonly cantidad: number,
    public readonly precioUnitario: number,
    public readonly subtotal: number,
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.cantidad <= 0) {
      throw new Error('La cantidad debe ser positiva');
    }

    if (this.precioUnitario <= 0) {
      throw new Error('El precio unitario debe ser positivo');
    }

    if (this.subtotal !== this.cantidad * this.precioUnitario) {
      throw new Error('El subtotal no coincide con cantidad × precio');
    }
  }
}

/**
 * Dirección de envío
 */
export class DireccionEnvio {
  constructor(
    public readonly direccion: string,
    public readonly departamento: string,
    public readonly municipio: string,
    public readonly zonaOColonia: string,
    public readonly referencia?: string,
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.direccion || this.direccion.trim().length < 10) {
      throw new Error('La dirección debe ser específica');
    }

    if (!this.departamento || this.departamento.trim().length === 0) {
      throw new Error('El departamento es requerido');
    }

    if (!this.municipio || this.municipio.trim().length === 0) {
      throw new Error('El municipio es requerido');
    }

    if (!this.zonaOColonia || this.zonaOColonia.trim().length === 0) {
      throw new Error('La zona o colonia es requerida');
    }
  }

  public obtenerDireccionCompleta(): string {
    const partes = [
      this.direccion,
      this.zonaOColonia,
      this.municipio,
      this.departamento,
    ];

    if (this.referencia) {
      partes.push(`(Ref: ${this.referencia})`);
    }

    return partes.join(', ');
  }
}

/**
 * Información del cliente
 */
export class Cliente {
  constructor(
    public readonly nombreCompleto: string,
    public readonly telefono: string,
    public readonly email?: string,
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.nombreCompleto || this.nombreCompleto.trim().length < 3) {
      throw new Error('El nombre completo debe tener al menos 3 caracteres');
    }

    if (!/^[0-9]{8}$/.test(this.telefono)) {
      throw new Error('El teléfono debe tener 8 dígitos');
    }

    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('El email no es válido');
    }
  }
}

/**
 * Orden - Entidad raíz del agregado
 */
export class Orden {
  constructor(
    public readonly id: string,
    public readonly numeroOrden: string,
    public readonly cliente: Cliente,
    public readonly direccionEnvio: DireccionEnvio,
    public readonly items: ItemOrden[],
    public readonly metodoPago: MetodoPago,
    public readonly subtotal: number,
    public readonly impuestos: number,
    public readonly envio: number,
    public readonly total: number,
    public estado: EstadoOrden,
    public readonly notas: string | null,
    public readonly fechaCreacion: Date,
    public fechaActualizacion: Date,
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

    if (this.items.length === 0) {
      throw new Error('La orden debe tener al menos un producto');
    }

    if (this.subtotal <= 0) {
      throw new Error('El subtotal debe ser positivo');
    }

    if (this.impuestos < 0) {
      throw new Error('Los impuestos no pueden ser negativos');
    }

    if (this.envio < 0) {
      throw new Error('El envío no puede ser negativo');
    }

    if (this.total <= 0) {
      throw new Error('El total debe ser positivo');
    }

    // Validar que el total sea correcto
    const totalCalculado = this.subtotal + this.impuestos + this.envio;
    const diferencia = Math.abs(this.total - totalCalculado);

    // Permitir diferencia de 0.01 por redondeo
    if (diferencia > 0.01) {
      throw new Error(
        `El total (${this.total}) no coincide con la suma de subtotal + impuestos + envío (${totalCalculado})`,
      );
    }

    // Validar que el subtotal coincida con la suma de items
    const subtotalItems = this.items.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );

    const diferenciaItems = Math.abs(this.subtotal - subtotalItems);

    if (diferenciaItems > 0.01) {
      throw new Error(
        `El subtotal (${this.subtotal}) no coincide con la suma de items (${subtotalItems})`,
      );
    }
  }

  /**
   * Métodos de negocio
   */

  public puedeSerCancelada(): boolean {
    return (
      this.estado === EstadoOrden.PENDIENTE ||
      this.estado === EstadoOrden.CONFIRMADA
    );
  }

  public cancelar(): void {
    if (!this.puedeSerCancelada()) {
      throw new Error(
        `No se puede cancelar una orden en estado ${this.estado}`,
      );
    }

    this.estado = EstadoOrden.CANCELADA;
    this.fechaActualizacion = new Date();
  }

  public confirmar(): void {
    if (this.estado !== EstadoOrden.PENDIENTE) {
      throw new Error(
        `No se puede confirmar una orden en estado ${this.estado}`,
      );
    }

    this.estado = EstadoOrden.CONFIRMADA;
    this.fechaActualizacion = new Date();
  }

  public marcarComoEnProceso(): void {
    if (this.estado !== EstadoOrden.CONFIRMADA) {
      throw new Error(
        `No se puede procesar una orden en estado ${this.estado}`,
      );
    }

    this.estado = EstadoOrden.EN_PROCESO;
    this.fechaActualizacion = new Date();
  }

  public marcarComoEnviada(): void {
    if (this.estado !== EstadoOrden.EN_PROCESO) {
      throw new Error(
        `No se puede enviar una orden en estado ${this.estado}`,
      );
    }

    this.estado = EstadoOrden.ENVIADA;
    this.fechaActualizacion = new Date();
  }

  public marcarComoEntregada(): void {
    if (this.estado !== EstadoOrden.ENVIADA) {
      throw new Error(
        `No se puede marcar como entregada una orden en estado ${this.estado}`,
      );
    }

    this.estado = EstadoOrden.ENTREGADA;
    this.fechaActualizacion = new Date();
  }

  public obtenerCantidadTotal(): number {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  public esPagoContraEntrega(): boolean {
    return this.metodoPago === MetodoPago.CONTRA_ENTREGA;
  }

  public requiereEnvio(): boolean {
    return true; // Por ahora todas las órdenes requieren envío
  }

  public obtenerResumen(): string {
    return `Orden ${this.numeroOrden} - ${this.items.length} productos - Q${this.total.toFixed(2)} - ${this.estado}`;
  }
}
