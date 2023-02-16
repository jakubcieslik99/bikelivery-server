import { Catch, ExceptionFilter, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    configService.get<string>('ENV') === 'dev'
      ? this.logger.error(`Code: ${httpStatus}, Stack: ${exception.stack || 'No stack trace.'}`)
      : this.logger.error(`Code: ${httpStatus}`);

    let httpMessage: string | string[] = 'An error occurred.';
    if (httpStatus === 400) {
      //built in NestJS pipe validation
      if (exception?.message === 'Validation failed (uuid is expected)') httpMessage = 'Invalid ID format.';
      //class validator validation
      else if (
        exception?.message === 'Bad Request Exception' &&
        Array.isArray(exception?.response?.message) &&
        exception?.response?.message.length > 0
      )
        httpMessage = exception.response.message.length > 1 ? exception.response.message : exception.response.message[0];
      //other validations with standard error message
      else if (typeof exception?.response?.message === 'string' || exception?.response?.message instanceof String)
        httpMessage = exception.response.message;
      //unknown http validations
      else httpMessage = 'Bad request.';
    } else if (httpStatus < 500) {
      httpMessage = exception?.response?.message || exception?.message || httpMessage;
    } else httpMessage = 'Internal server error.';

    const responseBody = {
      status: httpStatus,
      message: httpMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
