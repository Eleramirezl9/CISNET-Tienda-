/**
 * EXCEPTION FILTER - Todas las Excepciones
 * 
 * Catch-all para excepciones no manejadas
 * Previene que el servidor crashee y devuelve un error 500 controlado
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filter para TODAS las excepciones (incluyendo no-HTTP)
 */
@Catch()
export class TodasExcepcionesFilter implements ExceptionFilter {
  private readonly logger = new Logger(TodasExcepcionesFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraer mensaje
    let message = 'Error interno del servidor';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Construir respuesta
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: exception instanceof Error ? exception.name : 'Error',
    };

    // En desarrollo, agregar más información
    if (process.env.NODE_ENV === 'development') {
      (errorResponse as any).stack =
        exception instanceof Error ? exception.stack : undefined;
      (errorResponse as any).exception = exception;
    }

    // Log del error (siempre)
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // Si es un error 500, alertar (en producción podrías enviar a Sentry)
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('⚠️ ERROR CRÍTICO 500 ⚠️');
      // TODO: Enviar a Sentry/DataDog en producción
    }

    // Enviar respuesta
    response.status(status).json(errorResponse);
  }
}
