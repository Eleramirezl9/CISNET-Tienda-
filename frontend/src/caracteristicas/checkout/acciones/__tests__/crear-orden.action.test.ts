/**
 * Tests - Crear Orden Action
 * Pruebas para la Server Action de creación de órdenes
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { placeOrder } from '../crear-orden.action';
import { MetodoPago } from '../../dominio/checkout.types';
import type { ItemCarrito } from '@/caracteristicas/carrito-compras/dominio/carrito.types';

// Mock del API client
jest.mock('@/compartido/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      public statusText: string,
      public data?: unknown
    ) {
      super(`API Error: ${status} ${statusText}`);
      this.name = 'ApiError';
    }
  },
}));

const { apiClient } = require('@/compartido/lib/api-client');

describe('placeOrder', () => {
  const datosFormularioValidos = {
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

  const itemsCarritoValidos: ItemCarrito[] = [
    {
      productoId: '123e4567-e89b-12d3-a456-426614174000',
      nombre: 'Producto Test',
      slug: 'producto-test',
      precio: 100,
      cantidad: 2,
      imagenPrincipal: 'https://ejemplo.com/imagen.jpg',
      stock: 10,
    },
  ];

  const totalesValidos = {
    subtotal: 200,
    impuestos: 24,
    envio: 30,
    total: 254,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de datos', () => {
    it('debe rechazar carrito vacío', async () => {
      const resultado = await placeOrder(
        datosFormularioValidos,
        [],
        totalesValidos
      );

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('carrito está vacío');
    });

    it('debe rechazar total menor o igual a 0', async () => {
      const totalesInvalidos = {
        subtotal: 0,
        impuestos: 0,
        envio: 0,
        total: 0,
      };

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesInvalidos
      );

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('total de la orden debe ser mayor a 0');
    });
  });

  describe('Transformación de datos', () => {
    it('debe enviar datos correctamente formateados al backend', async () => {
      const ordenCreada = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        numeroOrden: 'ORD-2024-001',
        estado: 'pendiente',
        total: 254,
        fechaCreacion: '2024-01-01T00:00:00Z',
        metodoPago: 'tarjeta_gt',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(ordenCreada);

      await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesValidos
      );

      expect(apiClient.post).toHaveBeenCalledWith('/ordenes', {
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
        items: [
          {
            productoId: '123e4567-e89b-12d3-a456-426614174000',
            cantidad: 2,
            precio: 100,
          },
        ],
        subtotal: 200,
        impuestos: 24,
        envio: 30,
        total: 254,
      });
    });

    it('debe omitir campos opcionales vacíos', async () => {
      const datosFormularioSinOpcionales = {
        nombreCompleto: 'Juan Pérez',
        telefono: '12345678',
        direccion: 'Calle principal',
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        zonaOColonia: 'Zona 10',
        metodoPago: MetodoPago.CONTRA_ENTREGA,
      };

      const ordenCreada = {
        id: '123',
        numeroOrden: 'ORD-001',
        estado: 'pendiente',
        total: 254,
        fechaCreacion: '2024-01-01T00:00:00Z',
        metodoPago: 'contra_entrega',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(ordenCreada);

      await placeOrder(
        datosFormularioSinOpcionales,
        itemsCarritoValidos,
        totalesValidos
      );

      const llamada = (apiClient.post as jest.Mock).mock.calls[0][1];
      expect(llamada.email).toBeUndefined();
      expect(llamada.referencia).toBeUndefined();
      expect(llamada.notas).toBeUndefined();
    });
  });

  describe('Manejo de respuestas exitosas', () => {
    it('debe retornar success: true con datos de la orden', async () => {
      const ordenCreada = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        numeroOrden: 'ORD-2024-001',
        estado: 'pendiente',
        total: 254,
        fechaCreacion: '2024-01-01T00:00:00Z',
        metodoPago: 'tarjeta_gt',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(ordenCreada);

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesValidos
      );

      expect(resultado.success).toBe(true);
      expect(resultado.data).toEqual(ordenCreada);
      expect(resultado.error).toBeUndefined();
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar ApiError con mensaje personalizado', async () => {
      const { ApiError } = require('@/compartido/lib/api-client');
      const apiError = new ApiError(400, 'Bad Request', {
        message: 'Stock insuficiente',
      });

      (apiClient.post as jest.Mock).mockRejectedValue(apiError);

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesValidos
      );

      expect(resultado.success).toBe(false);
      expect(resultado.error).toBe('Stock insuficiente');
      expect(resultado.data).toBeUndefined();
    });

    it('debe manejar ApiError sin mensaje personalizado', async () => {
      const { ApiError } = require('@/compartido/lib/api-client');
      const apiError = new ApiError(500, 'Internal Server Error');

      (apiClient.post as jest.Mock).mockRejectedValue(apiError);

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesValidos
      );

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('Error del servidor: 500');
    });

    it('debe manejar errores de red', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesValidos
      );

      expect(resultado.success).toBe(false);
      expect(resultado.error).toBe('Network error');
    });

    it('debe manejar errores desconocidos', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue('Error desconocido');

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesValidos
      );

      expect(resultado.success).toBe(false);
      expect(resultado.error).toContain('Error desconocido');
    });
  });

  describe('Casos de edge', () => {
    it('debe manejar múltiples items en el carrito', async () => {
      const itemsMultiples: ItemCarrito[] = [
        {
          productoId: '123e4567-e89b-12d3-a456-426614174000',
          nombre: 'Producto 1',
          slug: 'producto-1',
          precio: 100,
          cantidad: 2,
          imagenPrincipal: 'https://ejemplo.com/imagen1.jpg',
          stock: 10,
        },
        {
          productoId: '123e4567-e89b-12d3-a456-426614174002',
          nombre: 'Producto 2',
          slug: 'producto-2',
          precio: 50,
          cantidad: 1,
          imagenPrincipal: 'https://ejemplo.com/imagen2.jpg',
          stock: 5,
        },
      ];

      const ordenCreada = {
        id: '123',
        numeroOrden: 'ORD-001',
        estado: 'pendiente',
        total: 250,
        fechaCreacion: '2024-01-01T00:00:00Z',
        metodoPago: 'tarjeta_gt',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(ordenCreada);

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsMultiples,
        { subtotal: 250, impuestos: 30, envio: 0, total: 280 }
      );

      expect(resultado.success).toBe(true);

      const llamada = (apiClient.post as jest.Mock).mock.calls[0][1];
      expect(llamada.items).toHaveLength(2);
      expect(llamada.items[0].productoId).toBe(
        '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(llamada.items[1].productoId).toBe(
        '123e4567-e89b-12d3-a456-426614174002'
      );
    });

    it('debe manejar envío gratis (envio: 0)', async () => {
      const totalesConEnvioGratis = {
        subtotal: 500,
        impuestos: 60,
        envio: 0,
        total: 560,
      };

      const ordenCreada = {
        id: '123',
        numeroOrden: 'ORD-001',
        estado: 'pendiente',
        total: 560,
        fechaCreacion: '2024-01-01T00:00:00Z',
        metodoPago: 'tarjeta_gt',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(ordenCreada);

      const resultado = await placeOrder(
        datosFormularioValidos,
        itemsCarritoValidos,
        totalesConEnvioGratis
      );

      expect(resultado.success).toBe(true);

      const llamada = (apiClient.post as jest.Mock).mock.calls[0][1];
      expect(llamada.envio).toBe(0);
    });
  });
});
