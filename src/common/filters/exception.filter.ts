import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let errors: any[] = [];

    if (exception instanceof BadRequestException) {
      status = 400;
      const responseData = exception.getResponse();
      message = this.extractMessage(responseData, 'Bad request');
    } else if (exception instanceof UnauthorizedException) {
      status = 401;
      message = 'Unauthorized';
    } else if (exception instanceof ForbiddenException) {
      status = 403;
      message = 'Forbidden';
    } else if (exception instanceof NotFoundException) {
      status = 404;
      message = 'Not found';
    } else if (exception instanceof ConflictException) {
      status = 409;
      message = 'Conflict';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();
      message = this.extractMessage(responseData, exception.message);
    }

    else if (exception instanceof EntityNotFoundError) {
      status = 404;
      message = 'Entity not found';
    }

    else if (exception instanceof QueryFailedError) {
      const err = exception as any;
      const code = err.code;

      if (code === '23505') {
        status = 409;
        message = 'Unique constraint violation';
      } else if (code === '23503') {
        status = 400;
        message = 'Foreign key constraint violation';
      } else {
        status = 400;
        message = 'Database query failed';
      }

      if (err.detail) {
        errors.push({ message: err.detail });
      }
    }

    else if (exception?.message) {
      message = exception.message;
    }

    return response.status(status).json({
      statusCode: status,
      message,
      ...(errors.length ? { errors } : {}),
    });
  }

  private extractMessage(responseData: any, fallback: string): string {
    if (typeof responseData === 'string') return responseData;
    if (Array.isArray(responseData?.message)) return responseData.message.join(', ');
    return responseData?.message || fallback;
  }
}
