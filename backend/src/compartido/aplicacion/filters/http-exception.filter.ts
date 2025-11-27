/**
 * EXCEPTION FILTER - HTTP
 * 
 * Maneja todas las excepciones HTTP y las transforma en un formato consistente
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
 * Formato de respuesta de error estandarizado
 */
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;  // Solo en desarrollo
}

/**
 * Filter para todas las excepciones HTTP
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Extraer mensaje de la excepción
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    // Construir respuesta estandarizada
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: exception.name,
    };

    // Agregar stack trace solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = exception.stack;
    }

    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
      exception.stack,
    );

    // Enviar respuesta
    response.status(status).json(errorResponse);
  }
}
