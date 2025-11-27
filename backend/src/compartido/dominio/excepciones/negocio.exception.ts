/**
 * EXCEPCIÓN COMPARTIDA - Reglas de Negocio
 * 
 * Excepción base para errores de lógica de negocio
 */

export class ExcepcionDeNegocio extends Error {
  constructor(
    mensaje: string,
    public readonly codigo?: string,
  ) {
    super(mensaje);
    this.name = 'ExcepcionDeNegocio';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Excepciones específicas
 */

export class RecursoNoEncontrado extends ExcepcionDeNegocio {
  constructor(recurso: string, identificador: string) {
    super(
      `${recurso} con identificador "${identificador}" no encontrado`,
      'RECURSO_NO_ENCONTRADO',
    );
    this.name = 'RecursoNoEncontrado';
  }
}

export class ReglaDeNegocioViolada extends ExcepcionDeNegocio {
  constructor(regla: string) {
    super(
      `Regla de negocio violada: ${regla}`,
      'REGLA_VIOLADA',
    );
    this.name = 'ReglaDeNegocioViolada';
  }
}

export class StockInsuficiente extends ExcepcionDeNegocio {
  constructor(disponible: number, solicitado: number) {
    super(
      `Stock insuficiente. Disponible: ${disponible}, Solicitado: ${solicitado}`,
      'STOCK_INSUFICIENTE',
    );
    this.name = 'StockInsuficiente';
  }
}
