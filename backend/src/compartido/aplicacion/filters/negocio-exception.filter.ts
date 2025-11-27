/**
 * EXCEPTION FILTER - Excepciones de Negocio
 * 
 * Maneja excepciones del dominio y las convierte en respuestas HTTP apropiadas
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ExcepcionDeNegocio,
  RecursoNoEncontrado,
  ReglaDeNegocioViolada,
  StockInsuficiente,
} from '@/compartido/dominio/excepciones/negocio.exception';

/**
 * Filter para excepciones del dominio
 */
@Catch(ExcepcionDeNegocio)
export class NegocioExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NegocioExceptionFilter.name);

  catch(exception: ExcepcionDeNegocio, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Mapear excepción de dominio a status HTTP
    const status = this.mapearAStatusHttp(exception);

    // Construir respuesta
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      codigo: exception.codigo,
      tipo: exception.name,
    };

    // Log
    this.logger.warn(
      `Excepción de negocio: ${exception.name} - ${exception.message}`,
    );

    // Enviar respuesta
    response.status(status).json(errorResponse);
  }

  /**
   * Mapea excepciones de dominio a códigos HTTP apropiados
   */
  private mapearAStatusHttp(exception: ExcepcionDeNegocio): HttpStatus {
    if (exception instanceof RecursoNoEncontrado) {
      return HttpStatus.NOT_FOUND;  // 404
    }

    if (exception instanceof StockInsuficiente) {
      return HttpStatus.CONFLICT;  // 409
    }

    if (exception instanceof ReglaDeNegocioViolada) {
      return HttpStatus.UNPROCESSABLE_ENTITY;  // 422
    }

    // Excepción genérica de negocio
    return HttpStatus.BAD_REQUEST;  // 400
  }
}
