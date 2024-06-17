import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const responseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal server error.'],
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus();
      const { message } = exception.getResponse() as { message: string | string[] };
      responseBody.message = Array.isArray(message) ? message : [message];
    }

    response.status(responseBody.statusCode).json(responseBody);

    super.catch(exception, host);
  }
}
