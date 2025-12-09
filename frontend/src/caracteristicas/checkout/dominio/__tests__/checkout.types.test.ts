/**
 * Tests - Checkout Types & Validation
 * Pruebas para schemas de validación con Zod
 */

import { describe, it, expect } from '@jest/globals';
import {
  checkoutFormSchema,
  MetodoPago,
  DEPARTAMENTOS_GT,
} from '../checkout.types';

describe('checkoutFormSchema', () => {
  describe('Validación de campos requeridos', () => {
    it('debe validar correctamente un formulario completo y válido', () => {
      const datosValidos = {
        nombreCompleto: 'Juan José Pérez García',
        telefono: '12345678',
        email: 'juan@ejemplo.com',
        direccion: 'Calle principal, casa #10',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        referencia: 'Frente a la gasolinera',
        metodoPago: MetodoPago.TARJETA_GT,
        notas: 'Entregar después de las 2pm',
      };

      const resultado = checkoutFormSchema.safeParse(datosValidos);
      expect(resultado.success).toBe(true);
    });

    it('debe validar correctamente sin campos opcionales', () => {
      const datosValidos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal, casa #10',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.CONTRA_ENTREGA,
      };

      const resultado = checkoutFormSchema.safeParse(datosValidos);
      expect(resultado.success).toBe(true);
    });

    it('debe rechazar datos vacíos', () => {
      const resultado = checkoutFormSchema.safeParse({});
      expect(resultado.success).toBe(false);

      if (!resultado.success) {
        expect(resultado.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Validación de nombreCompleto', () => {
    it('debe rechazar nombres con menos de 3 caracteres', () => {
      const datos = {
        nombreCompleto: 'AB',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);

      if (!resultado.success) {
        const errorNombre = resultado.error.issues.find(
          (issue) => issue.path[0] === 'nombreCompleto'
        );
        expect(errorNombre).toBeDefined();
        expect(errorNombre?.message).toContain('al menos 3 caracteres');
      }
    });

    it('debe aceptar nombres válidos', () => {
      const datos = {
        nombreCompleto: 'Juan José Pérez García',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(true);
    });
  });

  describe('Validación de teléfono', () => {
    it('debe rechazar teléfonos con menos de 8 dígitos', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '1234567',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);

      if (!resultado.success) {
        const errorTelefono = resultado.error.issues.find(
          (issue) => issue.path[0] === 'telefono'
        );
        expect(errorTelefono).toBeDefined();
        expect(errorTelefono?.message).toContain('8 dígitos');
      }
    });

    it('debe rechazar teléfonos con más de 8 dígitos', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '123456789',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);
    });

    it('debe rechazar teléfonos con caracteres no numéricos', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '1234-567',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);
    });

    it('debe aceptar teléfonos válidos de 8 dígitos', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(true);
    });
  });

  describe('Validación de email', () => {
    it('debe aceptar email opcional vacío', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(true);
    });

    it('debe rechazar email inválido', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        email: 'correo-invalido',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);

      if (!resultado.success) {
        const errorEmail = resultado.error.issues.find(
          (issue) => issue.path[0] === 'email'
        );
        expect(errorEmail).toBeDefined();
      }
    });

    it('debe aceptar email válido', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        email: 'juan@ejemplo.com',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(true);
    });
  });

  describe('Validación de dirección', () => {
    it('debe rechazar direcciones muy cortas', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);

      if (!resultado.success) {
        const errorDireccion = resultado.error.issues.find(
          (issue) => issue.path[0] === 'direccion'
        );
        expect(errorDireccion).toBeDefined();
        expect(errorDireccion?.message).toContain('más específica');
      }
    });

    it('debe aceptar direcciones específicas', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal, casa #10, colonia las flores',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(true);
    });
  });

  describe('Validación de método de pago', () => {
    it('debe rechazar método de pago inválido', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: 'metodo_invalido',
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);
    });

    it('debe aceptar todos los métodos de pago válidos', () => {
      const metodosValidos = [
        MetodoPago.TARJETA_GT,
        MetodoPago.BILLETERA_FRI,
        MetodoPago.CONTRA_ENTREGA,
        MetodoPago.TARJETA_INTERNACIONAL,
      ];

      metodosValidos.forEach((metodo) => {
        const datos = {
          nombreCompleto: 'Juan Pérez',
          telefono: '12345678',
          direccion: 'Calle principal',
          departamento: 'Guatemala',
          municipio: 'Guatemala',
          zonaOColonia: 'Zona 10',
          metodoPago: metodo,
        };

        const resultado = checkoutFormSchema.safeParse(datos);
        expect(resultado.success).toBe(true);
      });
    });
  });

  describe('Validación de notas', () => {
    it('debe rechazar notas muy largas', () => {
      const notasLargas = 'A'.repeat(501);
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
        notas: notasLargas,
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(false);
    });

    it('debe aceptar notas válidas', () => {
      const datos = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.TARJETA_GT,
        notas: 'Entregar después de las 2pm, tocar el timbre dos veces',
      };

      const resultado = checkoutFormSchema.safeParse(datos);
      expect(resultado.success).toBe(true);
    });
  });
});

describe('DEPARTAMENTOS_GT', () => {
  it('debe contener los 22 departamentos de Guatemala', () => {
    expect(DEPARTAMENTOS_GT).toHaveLength(22);
  });

  it('debe incluir departamentos clave', () => {
    expect(DEPARTAMENTOS_GT).toContain('Guatemala');
    expect(DEPARTAMENTOS_GT).toContain('Quetzaltenango');
    expect(DEPARTAMENTOS_GT).toContain('Escuintla');
  });

  it('debe ser readonly', () => {
    expect(() => {
      // @ts-expect-error - Testing readonly
      DEPARTAMENTOS_GT[0] = 'Otro';
    }).toThrow();
  });
});

describe('MetodoPago', () => {
  it('debe contener todos los métodos de pago', () => {
    expect(MetodoPago.TARJETA_GT).toBe('tarjeta_gt');
    expect(MetodoPago.BILLETERA_FRI).toBe('billetera_fri');
    expect(MetodoPago.CONTRA_ENTREGA).toBe('contra_entrega');
    expect(MetodoPago.TARJETA_INTERNACIONAL).toBe('tarjeta_internacional');
  });
});
