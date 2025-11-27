/**
 * VALUE OBJECT - Precio
 * 
 * Representa un precio monetario con sus reglas de negocio
 */

export class Precio {
  private readonly _valor: number;

  constructor(valor: number) {
    this.validar(valor);
    this._valor = this.redondear(valor);
  }

  get valor(): number {
    return this._valor;
  }

  private validar(valor: number): void {
    if (typeof valor !== 'number' || isNaN(valor)) {
      throw new Error('El precio debe ser un número válido');
    }

    if (valor < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (valor > 999999.99) {
      throw new Error('El precio excede el máximo permitido');
    }
  }

  private redondear(valor: number): number {
    return Math.round(valor * 100) / 100;
  }

  /**
   * Métodos de negocio
   */

  public equals(otro: Precio): boolean {
    return this._valor === otro._valor;
  }

  public esMayorQue(otro: Precio): boolean {
    return this._valor > otro._valor;
  }

  public esMenorQue(otro: Precio): boolean {
    return this._valor < otro._valor;
  }

  public sumar(otro: Precio): Precio {
    return new Precio(this._valor + otro._valor);
  }

  public restar(otro: Precio): Precio {
    return new Precio(this._valor - otro._valor);
  }

  public multiplicar(factor: number): Precio {
    if (factor < 0) {
      throw new Error('El factor no puede ser negativo');
    }
    return new Precio(this._valor * factor);
  }

  public aplicarDescuento(porcentaje: number): Precio {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
    }
    
    const descuento = this._valor * (porcentaje / 100);
    return new Precio(this._valor - descuento);
  }

  public toString(): string {
    return this._valor.toFixed(2);
  }

  public toJSON(): number {
    return this._valor;
  }

  /**
   * Factory methods
   */

  public static desde(valor: number): Precio {
    return new Precio(valor);
  }

  public static cero(): Precio {
    return new Precio(0);
  }
}
