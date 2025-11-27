/**
 * UTILIDAD COMPARTIDA - Paginación
 * 
 * Helpers para cálculos de paginación
 * Usado por: Todos los módulos que listen datos
 */

export interface OpcionesPaginacion {
  pagina?: number;
  limite?: number;
}

export interface ResultadoPaginacion {
  skip: number;
  take: number;
  pagina: number;
  limite: number;
}

export interface MetadataPaginacion {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

export class PaginacionHelper {
  private static readonly LIMITE_DEFAULT = 20;
  private static readonly LIMITE_MAX = 100;
  private static readonly PAGINA_DEFAULT = 1;

  /**
   * Calcula skip y take para Prisma
   */
  static calcular(opciones?: OpcionesPaginacion): ResultadoPaginacion {
    const pagina = Math.max(opciones?.pagina || this.PAGINA_DEFAULT, 1);
    const limite = Math.min(
      Math.max(opciones?.limite || this.LIMITE_DEFAULT, 1),
      this.LIMITE_MAX,
    );

    const skip = (pagina - 1) * limite;
    const take = limite;

    return {
      skip,
      take,
      pagina,
      limite,
    };
  }

  /**
   * Calcula metadata de paginación
   */
  static metadata(
    total: number,
    pagina: number,
    limite: number,
  ): MetadataPaginacion {
    const totalPaginas = Math.ceil(total / limite);
    const tienePaginaAnterior = pagina > 1;
    const tienePaginaSiguiente = pagina < totalPaginas;

    return {
      total,
      pagina,
      limite,
      totalPaginas,
      tienePaginaAnterior,
      tienePaginaSiguiente,
    };
  }
}
