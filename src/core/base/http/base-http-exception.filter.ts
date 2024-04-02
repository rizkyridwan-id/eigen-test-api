import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { CustomLogger } from '../../../infra/logger/logger';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = this._getErrorStatus(exception);
    const message = this._getErrorMessage(exception);

    const messageValue: string =
      typeof message !== 'string' ? message.message : message;

    const logger = new CustomLogger('HF');
    logger.error(
      messageValue,
      `(${request.method})${request.url.replace(/^\/api/, '')}`,
    );

    const responseJson = {
      status: status,
      message: messageValue,
    };

    response.status(status).json(responseJson);
  }

  private _getErrorStatus(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus() || 500;
    } else {
      return 500;
    }
  }

  private _getErrorMessage(exception: unknown): string | { message: string } {
    if (exception instanceof HttpException) {
      return exception.getResponse() as any;
    } else if (exception instanceof Error) {
      return exception.message;
    } else {
      return 'Internal server error';
    }
  }
}
