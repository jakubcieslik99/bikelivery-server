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

    if (httpStatus === 400) httpMessage = this.Err400(exception);
    else if (httpStatus === 401) httpMessage = this.Err401(exception);
    else if (httpStatus === 429) httpMessage = 'Too many requests.';
    else if (httpStatus < 500) httpMessage = this.Err(exception);
    else httpMessage = 'Internal server error.';

    const responseBody = {
      status: httpStatus,
      message: httpMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private Err400(exception: any) {
    //built in NestJS pipe validation
    if (exception?.message === 'Validation failed (uuid is expected)') return 'Invalid ID format.';
    //class validator validation
    else if (
      exception?.message === 'Bad Request Exception' &&
      Array.isArray(exception?.response?.message) &&
      exception?.response?.message.length > 0
    )
      return exception.response.message.length > 1 ? exception.response.message : exception.response.message[0];
    //other validations with standard error message
    else if (typeof exception?.response?.message === 'string' || exception?.response?.message instanceof String)
      return exception.response.message;
    //unknown http validations
    else return 'Bad request.';
  }

  private Err401(exception: any) {
    if (exception?.response?.message === 'Unauthorized' && exception?.message === 'Unauthorized')
      return 'Unauthorized access. Session has expired.';
    else return exception?.response?.message || exception?.message || 'Unauthorized access.';
  }

  private Err(exception: any) {
    return exception?.response?.message || exception?.message || 'An error occurred.';
  }
}
