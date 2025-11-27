/**
 * Tests de Use Case - Crear Producto
 * 
 * Usando MOCKS del repositorio (sin base de datos real)
 * ⚡ Súper rápido
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CrearProductoUseCase } from './crear-producto.use-case';
import { IProductoRepositorio, PRODUCTO_REPOSITORIO } from '../../dominio/repositorios/producto.repositorio.interface';
import { Producto } from '../../dominio/entidades/producto.entidad';
import { CrearProductoDto } from '../dto/crear-producto.dto';

describe('CrearProductoUseCase', () => {
  let useCase: CrearProductoUseCase;
  let mockRepositorio: jest.Mocked<IProductoRepositorio>;

  beforeEach(async () => {
    // Crear un MOCK del repositorio
    mockRepositorio = {
      guardar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorSlug: jest.fn(),
      buscarTodos: jest.fn(),
      eliminar: jest.fn(),
      existeSlug: jest.fn(),
      buscarPorCategoria: jest.fn(),
      buscarDestacados: jest.fn(),
      actualizarStockMasivo: jest.fn(),
    };

    // Configurar el módulo de testing
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrearProductoUseCase,
        {
          provide: PRODUCTO_REPOSITORIO,
          useValue: mockRepositorio, // Usar el mock en lugar del repositorio real
        },
      ],
    }).compile();

    useCase = module.get<CrearProductoUseCase>(CrearProductoUseCase);
  });

  describe('ejecutar', () => {
    const dtoValido: CrearProductoDto = {
      nombre: 'Laptop Dell XPS 15',
      descripcion: 'Laptop de alto rendimiento con procesador Intel i7',
      slug: 'laptop-dell-xps-15',
      precio: 12500,
      stock: 10,
      imagenPrincipal: 'https://example.com/laptop.jpg',
      categoriaId: 'cat-123',
      categoria: 'Computadoras',
    };

    it('debe crear un producto exitosamente', async () => {
      // Arrange
      mockRepositorio.existeSlug.mockResolvedValue(false); // El slug NO existe
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoValido);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.nombre).toBe('Laptop Dell XPS 15');
      expect(resultado.precio.valor).toBe(12500);
      expect(resultado.stock).toBe(10);
      expect(mockRepositorio.existeSlug).toHaveBeenCalledWith('laptop-dell-xps-15');
      expect(mockRepositorio.guardar).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar error si el slug ya existe', async () => {
      // Arrange
      mockRepositorio.existeSlug.mockResolvedValue(true); // El slug YA existe

      // Act & Assert
      await expect(useCase.ejecutar(dtoValido)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.ejecutar(dtoValido)).rejects.toThrow(
        'Ya existe un producto con el slug: laptop-dell-xps-15',
      );
      expect(mockRepositorio.guardar).not.toHaveBeenCalled();
    });

    it('debe crear un producto con precio anterior (descuento)', async () => {
      // Arrange
      const dtoConDescuento = {
        ...dtoValido,
        precioAnterior: 15000,
      };
      mockRepositorio.existeSlug.mockResolvedValue(false);
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoConDescuento);

      // Assert
      expect(resultado.precioAnterior).toBeDefined();
      expect(resultado.precioAnterior?.valor).toBe(15000);
      expect(resultado.tieneDescuento()).toBe(true);
      expect(resultado.calcularPorcentajeDescuento()).toBe(17); // ~16.67% redondeado
    });

    it('debe lanzar error si el precio anterior es menor al precio actual', async () => {
      // Arrange
      const dtoInvalido = {
        ...dtoValido,
        precio: 15000,
        precioAnterior: 12500, // ❌ Precio anterior menor
      };
      mockRepositorio.existeSlug.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.ejecutar(dtoInvalido)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.ejecutar(dtoInvalido)).rejects.toThrow(
        'El precio anterior debe ser mayor al precio actual',
      );
    });

    it('debe crear un producto activo por defecto', async () => {
      // Arrange
      mockRepositorio.existeSlug.mockResolvedValue(false);
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoValido);

      // Assert
      expect(resultado.activo).toBe(true);
    });

    it('debe crear un producto NO destacado por defecto', async () => {
      // Arrange
      mockRepositorio.existeSlug.mockResolvedValue(false);
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoValido);

      // Assert
      expect(resultado.destacado).toBe(false);
    });

    it('debe poder crear un producto destacado', async () => {
      // Arrange
      const dtoDestacado = {
        ...dtoValido,
        destacado: true,
      };
      mockRepositorio.existeSlug.mockResolvedValue(false);
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoDestacado);

      // Assert
      expect(resultado.destacado).toBe(true);
    });

    it('debe agregar etiquetas al producto', async () => {
      // Arrange
      const dtoConEtiquetas = {
        ...dtoValido,
        etiquetas: ['laptop', 'dell', 'gaming'],
      };
      mockRepositorio.existeSlug.mockResolvedValue(false);
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoConEtiquetas);

      // Assert
      expect(resultado.etiquetas).toEqual(['laptop', 'dell', 'gaming']);
    });

    it('debe agregar características al producto', async () => {
      // Arrange
      const dtoConCaracteristicas = {
        ...dtoValido,
        caracteristicas: {
          procesador: 'Intel i7',
          ram: '16GB',
          almacenamiento: '512GB SSD',
        },
      };
      mockRepositorio.existeSlug.mockResolvedValue(false);
      mockRepositorio.guardar.mockImplementation((producto) => Promise.resolve(producto));

      // Act
      const resultado = await useCase.ejecutar(dtoConCaracteristicas);

      // Assert
      expect(resultado.caracteristicas).toEqual({
        procesador: 'Intel i7',
        ram: '16GB',
        almacenamiento: '512GB SSD',
      });
    });
  });
});

// ⚡ Tiempo: ~20ms por test
// ✅ SIN base de datos
// ✅ Con mocks simples
// ✅ Tests independientes
