import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://docs.nestjs.com/exception-filters
 */
@Catch(PrismaClientKnownRequestError, Error)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception.code === 'P2025') {
      return response.status(404).json({
        message: {
          statusCode: 404,
          error: 'Not Found',
          message: exception.message,
        },
      });
    }
  }
}
