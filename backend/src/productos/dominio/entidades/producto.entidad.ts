/**
 * ENTIDAD DE DOMINIO - Producto
 * 
 * Esta es la representación pura del concepto de negocio "Producto"
 * No tiene dependencias de frameworks ni infraestructura
 */

import { Precio } from '../value-objects/precio.vo';

export class Producto {
  constructor(
    public readonly id: string,
    public nombre: string,
    public descripcion: string,
    public slug: string,
    public precio: Precio,
    public precioAnterior: Precio | null,
    public stock: number,
    public imagenPrincipal: string,
    public imagenes: string[],
    public categoriaId: string,
    public categoria: string,
    public etiquetas: string[],
    public caracteristicas: Record<string, string>,
    public activo: boolean,
    public destacado: boolean,
    public readonly fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {
    this.validar();
  }

  /**
   * Validaciones de reglas de negocio
   */
  private validar(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre del producto es requerido');
    }

    if (this.nombre.length > 200) {
      throw new Error('El nombre no puede exceder 200 caracteres');
    }

    if (!this.descripcion || this.descripcion.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    if (this.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (!this.slug || this.slug.trim().length === 0) {
      throw new Error('El slug es requerido');
    }

    if (!this.imagenPrincipal) {
      throw new Error('La imagen principal es requerida');
    }
  }

  /**
   * Métodos de negocio
   */

  public estaDisponible(): boolean {
    return this.activo && this.stock > 0;
  }

  public tieneDescuento(): boolean {
    return this.precioAnterior !== null && this.precioAnterior.valor > this.precio.valor;
  }

  public calcularPorcentajeDescuento(): number {
    if (!this.tieneDescuento()) {
      return 0;
    }
    
    return Math.round(
      ((this.precioAnterior!.valor - this.precio.valor) / this.precioAnterior!.valor) * 100
    );
  }

  public actualizarStock(cantidad: number): void {
    if (this.stock + cantidad < 0) {
      throw new Error('Stock insuficiente');
    }
    
    this.stock += cantidad;
    this.fechaActualizacion = new Date();
  }

  public reducirStock(cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    
    if (this.stock < cantidad) {
      throw new Error(`Stock insuficiente. Disponible: ${this.stock}, Solicitado: ${cantidad}`);
    }
    
    this.actualizarStock(-cantidad);
  }

  public incrementarStock(cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    
    this.actualizarStock(cantidad);
  }

  public activar(): void {
    this.activo = true;
    this.fechaActualizacion = new Date();
  }

  public desactivar(): void {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  public marcarComoDestacado(): void {
    this.destacado = true;
    this.fechaActualizacion = new Date();
  }

  public quitarDestacado(): void {
    this.destacado = false;
    this.fechaActualizacion = new Date();
  }

  /**
   * Método factory para crear un nuevo producto
   */
  public static crear(
    id: string,
    nombre: string,
    descripcion: string,
    slug: string,
    precio: Precio,
    stock: number,
    imagenPrincipal: string,
    categoriaId: string,
    categoria: string,
  ): Producto {
    return new Producto(
      id,
      nombre,
      descripcion,
      slug,
      precio,
      null, // sin precio anterior inicialmente
      stock,
      imagenPrincipal,
      [], // sin imágenes adicionales inicialmente
      categoriaId,
      categoria,
      [], // sin etiquetas inicialmente
      {}, // sin características inicialmente
      true, // activo por defecto
      false, // no destacado por defecto
      new Date(),
      new Date(),
    );
  }
}
