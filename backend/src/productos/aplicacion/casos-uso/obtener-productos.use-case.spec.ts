/**
 * Tests de Use Case - Obtener Productos
 * 
 * Tests con mocks del repositorio
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ObtenerProductosUseCase } from './obtener-productos.use-case';
import { IProductoRepositorio, PRODUCTO_REPOSITORIO, ResultadoPaginado } from '../../dominio/repositorios/producto.repositorio.interface';
import { Producto } from '../../dominio/entidades/producto.entidad';
import { Precio } from '../../dominio/value-objects/precio.vo';

describe('ObtenerProductosUseCase', () => {
  let useCase: ObtenerProductosUseCase;
  let mockRepositorio: jest.Mocked<IProductoRepositorio>;

  beforeEach(async () => {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObtenerProductosUseCase,
        {
          provide: PRODUCTO_REPOSITORIO,
          useValue: mockRepositorio,
        },
      ],
    }).compile();

    useCase = module.get<ObtenerProductosUseCase>(ObtenerProductosUseCase);
  });

  // Helper para crear productos de prueba
  const crearProductoMock = (id: string, nombre: string, precio: number): Producto => {
    return Producto.crear(
      id,
      nombre,
      'Descripción del producto de prueba',
      `slug-${id}`,
      Precio.desde(precio),
      10,
      'https://example.com/image.jpg',
      'cat-123',
      'Categoría Test'
    );
  };

  describe('ejecutar', () => {
    it('debe obtener productos sin filtros', async () => {
      // Arrange
      const productosMock: Producto[] = [
        crearProductoMock('1', 'Producto 1', 100),
        crearProductoMock('2', 'Producto 2', 200),
        crearProductoMock('3', 'Producto 3', 300),
      ];

      const resultadoMock: ResultadoPaginado<Producto> = {
        items: productosMock,
        total: 3,
        pagina: 1,
        limite: 20,
        totalPaginas: 1,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar();

      // Assert
      expect(resultado.items).toHaveLength(3);
      expect(resultado.total).toBe(3);
      expect(resultado.pagina).toBe(1);
      expect(mockRepositorio.buscarTodos).toHaveBeenCalledWith(undefined);
    });

    it('debe obtener productos con filtro de categoría', async () => {
      // Arrange
      const productosMock: Producto[] = [
        crearProductoMock('1', 'Laptop', 12500),
      ];

      const resultadoMock: ResultadoPaginado<Producto> = {
        items: productosMock,
        total: 1,
        pagina: 1,
        limite: 20,
        totalPaginas: 1,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar({
        categoriaId: 'cat-computadoras',
      });

      // Assert
      expect(resultado.items).toHaveLength(1);
      expect(mockRepositorio.buscarTodos).toHaveBeenCalledWith({
        categoriaId: 'cat-computadoras',
      });
    });

    it('debe obtener productos con filtro de precio', async () => {
      // Arrange
      const productosMock: Producto[] = [
        crearProductoMock('1', 'Producto Económico', 500),
      ];

      const resultadoMock: ResultadoPaginado<Producto> = {
        items: productosMock,
        total: 1,
        pagina: 1,
        limite: 20,
        totalPaginas: 1,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar({
        precioMin: 100,
        precioMax: 1000,
      });

      // Assert
      expect(resultado.items).toHaveLength(1);
      expect(mockRepositorio.buscarTodos).toHaveBeenCalledWith({
        precioMin: 100,
        precioMax: 1000,
      });
    });

    it('debe obtener solo productos disponibles', async () => {
      // Arrange
      const productosMock: Producto[] = [
        crearProductoMock('1', 'Producto Disponible', 100),
      ];

      const resultadoMock: ResultadoPaginado<Producto> = {
        items: productosMock,
        total: 1,
        pagina: 1,
        limite: 20,
        totalPaginas: 1,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar({
        disponibles: true,
      });

      // Assert
      expect(resultado.items.every((p) => p.estaDisponible())).toBe(true);
      expect(mockRepositorio.buscarTodos).toHaveBeenCalledWith({
        disponibles: true,
      });
    });

    it('debe obtener productos con paginación', async () => {
      // Arrange
      const productosMock: Producto[] = [
        crearProductoMock('11', 'Producto 11', 100),
        crearProductoMock('12', 'Producto 12', 200),
      ];

      const resultadoMock: ResultadoPaginado<Producto> = {
        items: productosMock,
        total: 25,
        pagina: 2,
        limite: 10,
        totalPaginas: 3,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar({
        pagina: 2,
        limite: 10,
      });

      // Assert
      expect(resultado.items).toHaveLength(2);
      expect(resultado.pagina).toBe(2);
      expect(resultado.totalPaginas).toBe(3);
      expect(mockRepositorio.buscarTodos).toHaveBeenCalledWith({
        pagina: 2,
        limite: 10,
      });
    });

    it('debe obtener productos ordenados por precio ascendente', async () => {
      // Arrange
      const productosMock: Producto[] = [
        crearProductoMock('1', 'Producto Barato', 100),
        crearProductoMock('2', 'Producto Caro', 1000),
      ];

      const resultadoMock: ResultadoPaginado<Producto> = {
        items: productosMock,
        total: 2,
        pagina: 1,
        limite: 20,
        totalPaginas: 1,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar({
        ordenar: 'precio-asc',
      });

      // Assert
      expect(resultado.items[0].precio.valor).toBeLessThan(resultado.items[1].precio.valor);
      expect(mockRepositorio.buscarTodos).toHaveBeenCalledWith({
        ordenar: 'precio-asc',
      });
    });

    it('debe retornar array vacío si no hay productos', async () => {
      // Arrange
      const resultadoMock: ResultadoPaginado<Producto> = {
        items: [],
        total: 0,
        pagina: 1,
        limite: 20,
        totalPaginas: 0,
      };

      mockRepositorio.buscarTodos.mockResolvedValue(resultadoMock);

      // Act
      const resultado = await useCase.ejecutar();

      // Assert
      expect(resultado.items).toHaveLength(0);
      expect(resultado.total).toBe(0);
    });
  });
});

// ⚡ Tiempo: ~15ms por test
// ✅ Totalmente aislado
// ✅ Sin base de datos
