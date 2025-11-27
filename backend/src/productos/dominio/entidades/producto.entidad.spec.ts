/**
 * Tests de Dominio - Producto (Entidad)
 * 
 * Estos tests son ULTRA RÁPIDOS porque no tienen dependencias externas
 * Solo testean lógica de negocio pura
 */

import { Producto } from './producto.entidad';
import { Precio } from '../value-objects/precio.vo';

describe('Producto (Entidad)', () => {
  describe('Creación', () => {
    it('debe crear un producto válido', () => {
      // Arrange
      const producto = Producto.crear(
        'uuid-123',
        'Laptop Dell XPS 15',
        'Laptop de alto rendimiento con procesador Intel i7',
        'laptop-dell-xps-15',
        Precio.desde(12500),
        10,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      // Assert
      expect(producto.id).toBe('uuid-123');
      expect(producto.nombre).toBe('Laptop Dell XPS 15');
      expect(producto.precio.valor).toBe(12500);
      expect(producto.stock).toBe(10);
      expect(producto.activo).toBe(true);
      expect(producto.destacado).toBe(false);
    });

    it('debe lanzar error si el nombre está vacío', () => {
      // Act & Assert
      expect(() => {
        Producto.crear(
          'uuid-123',
          '', // ❌ Nombre vacío
          'Descripción válida',
          'laptop',
          Precio.desde(12500),
          10,
          'https://example.com/image.jpg',
          'cat-123',
          'Computadoras'
        );
      }).toThrow('El nombre del producto es requerido');
    });

    it('debe lanzar error si la descripción es muy corta', () => {
      expect(() => {
        Producto.crear(
          'uuid-123',
          'Laptop',
          'Corta', // ❌ Menos de 10 caracteres
          'laptop',
          Precio.desde(12500),
          10,
          'https://example.com/image.jpg',
          'cat-123',
          'Computadoras'
        );
      }).toThrow('La descripción debe tener al menos 10 caracteres');
    });

    it('debe lanzar error si el stock es negativo', () => {
      expect(() => {
        Producto.crear(
          'uuid-123',
          'Laptop',
          'Descripción válida del producto',
          'laptop',
          Precio.desde(12500),
          -5, // ❌ Stock negativo
          'https://example.com/image.jpg',
          'cat-123',
          'Computadoras'
        );
      }).toThrow('El stock no puede ser negativo');
    });
  });

  describe('Disponibilidad', () => {
    it('debe estar disponible si está activo y tiene stock', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        5, // Stock > 0
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      expect(producto.estaDisponible()).toBe(true);
    });

    it('NO debe estar disponible si no tiene stock', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        0, // Sin stock
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      expect(producto.estaDisponible()).toBe(false);
    });

    it('NO debe estar disponible si está inactivo', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        5,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );
      
      producto.desactivar();

      expect(producto.estaDisponible()).toBe(false);
    });
  });

  describe('Gestión de Stock', () => {
    it('debe reducir el stock correctamente', () => {
      // Arrange
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        10,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      // Act
      producto.reducirStock(3);

      // Assert
      expect(producto.stock).toBe(7);
    });

    it('debe lanzar error si intenta reducir más stock del disponible', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        5,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      expect(() => {
        producto.reducirStock(10); // ❌ Solo tiene 5
      }).toThrow('Stock insuficiente');
    });

    it('debe incrementar el stock correctamente', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        5,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      producto.incrementarStock(10);

      expect(producto.stock).toBe(15);
    });
  });

  describe('Descuentos', () => {
    it('debe detectar si tiene descuento', () => {
      const producto = new Producto(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        Precio.desde(15000), // Precio anterior mayor
        10,
        'https://example.com/image.jpg',
        [],
        'cat-123',
        'Computadoras',
        [],
        {},
        true,
        false,
        new Date(),
        new Date()
      );

      expect(producto.tieneDescuento()).toBe(true);
    });

    it('debe calcular el porcentaje de descuento correctamente', () => {
      const producto = new Producto(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        Precio.desde(15000), // 16.67% de descuento
        10,
        'https://example.com/image.jpg',
        [],
        'cat-123',
        'Computadoras',
        [],
        {},
        true,
        false,
        new Date(),
        new Date()
      );

      expect(producto.calcularPorcentajeDescuento()).toBe(17); // Redondeado
    });

    it('NO debe tener descuento si no hay precio anterior', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        10,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      expect(producto.tieneDescuento()).toBe(false);
      expect(producto.calcularPorcentajeDescuento()).toBe(0);
    });
  });

  describe('Estado del Producto', () => {
    it('debe poder activar el producto', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        10,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      producto.desactivar();
      expect(producto.activo).toBe(false);

      producto.activar();
      expect(producto.activo).toBe(true);
    });

    it('debe poder marcar como destacado', () => {
      const producto = Producto.crear(
        'uuid-123',
        'Laptop',
        'Descripción válida del producto',
        'laptop',
        Precio.desde(12500),
        10,
        'https://example.com/image.jpg',
        'cat-123',
        'Computadoras'
      );

      expect(producto.destacado).toBe(false);

      producto.marcarComoDestacado();
      expect(producto.destacado).toBe(true);
    });
  });
});

// ⚡ Tiempo de ejecución: ~10ms por test
// 20 tests = ~200ms total
// ✅ SIN base de datos
// ✅ SIN mocks complicados
// ✅ SOLO lógica de negocio
