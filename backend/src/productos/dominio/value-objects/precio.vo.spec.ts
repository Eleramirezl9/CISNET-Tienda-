/**
 * Tests de Dominio - Precio (Value Object)
 * 
 * Tests ultra rápidos sin dependencias externas
 */

import { Precio } from './precio.vo';

describe('Precio (Value Object)', () => {
  describe('Creación', () => {
    it('debe crear un precio válido', () => {
      const precio = Precio.desde(100.50);

      expect(precio.valor).toBe(100.50);
    });

    it('debe redondear a 2 decimales', () => {
      const precio = Precio.desde(100.999);

      expect(precio.valor).toBe(101.00);
    });

    it('debe lanzar error si el precio es negativo', () => {
      expect(() => {
        Precio.desde(-10);
      }).toThrow('El precio no puede ser negativo');
    });

    it('debe lanzar error si el precio no es un número', () => {
      expect(() => {
        Precio.desde(NaN);
      }).toThrow('El precio debe ser un número válido');
    });

    it('debe lanzar error si el precio excede el máximo', () => {
      expect(() => {
        Precio.desde(1000000);
      }).toThrow('El precio excede el máximo permitido');
    });

    it('debe crear un precio cero', () => {
      const precio = Precio.cero();

      expect(precio.valor).toBe(0);
    });
  });

  describe('Comparaciones', () => {
    it('debe comparar si dos precios son iguales', () => {
      const precio1 = Precio.desde(100);
      const precio2 = Precio.desde(100);

      expect(precio1.equals(precio2)).toBe(true);
    });

    it('debe detectar si un precio es mayor que otro', () => {
      const precio1 = Precio.desde(200);
      const precio2 = Precio.desde(100);

      expect(precio1.esMayorQue(precio2)).toBe(true);
      expect(precio2.esMayorQue(precio1)).toBe(false);
    });

    it('debe detectar si un precio es menor que otro', () => {
      const precio1 = Precio.desde(100);
      const precio2 = Precio.desde(200);

      expect(precio1.esMenorQue(precio2)).toBe(true);
      expect(precio2.esMenorQue(precio1)).toBe(false);
    });
  });

  describe('Operaciones', () => {
    it('debe sumar dos precios', () => {
      const precio1 = Precio.desde(100);
      const precio2 = Precio.desde(50);

      const resultado = precio1.sumar(precio2);

      expect(resultado.valor).toBe(150);
    });

    it('debe restar dos precios', () => {
      const precio1 = Precio.desde(100);
      const precio2 = Precio.desde(30);

      const resultado = precio1.restar(precio2);

      expect(resultado.valor).toBe(70);
    });

    it('debe multiplicar un precio por un factor', () => {
      const precio = Precio.desde(100);

      const resultado = precio.multiplicar(2);

      expect(resultado.valor).toBe(200);
    });

    it('debe aplicar un descuento porcentual', () => {
      const precio = Precio.desde(100);

      const resultado = precio.aplicarDescuento(20); // 20% de descuento

      expect(resultado.valor).toBe(80);
    });

    it('debe lanzar error si el descuento es mayor a 100%', () => {
      const precio = Precio.desde(100);

      expect(() => {
        precio.aplicarDescuento(150);
      }).toThrow('El porcentaje de descuento debe estar entre 0 y 100');
    });

    it('debe lanzar error si el factor de multiplicación es negativo', () => {
      const precio = Precio.desde(100);

      expect(() => {
        precio.multiplicar(-2);
      }).toThrow('El factor no puede ser negativo');
    });
  });

  describe('Inmutabilidad', () => {
    it('las operaciones deben retornar un nuevo precio sin modificar el original', () => {
      const precioOriginal = Precio.desde(100);
      const precioSumado = precioOriginal.sumar(Precio.desde(50));

      expect(precioOriginal.valor).toBe(100); // No debe cambiar
      expect(precioSumado.valor).toBe(150);
    });
  });

  describe('Serialización', () => {
    it('debe convertir a string con 2 decimales', () => {
      const precio = Precio.desde(100.5);

      expect(precio.toString()).toBe('100.50');
    });

    it('debe convertir a JSON como número', () => {
      const precio = Precio.desde(100.50);

      expect(precio.toJSON()).toBe(100.50);
    });
  });
});

// ⚡ Tiempo: ~5ms por test
// ✅ 100% puro, sin dependencias
