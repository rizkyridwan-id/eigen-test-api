import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CustomLogger } from '../../infra/logger/logger';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DebugLoggerInterceptor implements NestInterceptor {
  private logger: CustomLogger;
  constructor() {
    this.logger = new CustomLogger('HttpDebug');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const body = req.body;
    const query = req.query;

    this.logger.log('Incoming Request.', `(${req.method})${req.originalUrl}`);
    if (process.env.MODE === 'DEVELOPMENT') {
      if (typeof body === 'object' && Object.keys(body).length) {
        this.logger.debug('Body' + JSON.stringify(body, null, 2));
      }

      if (typeof query === 'object' && Object.keys(query).length) {
        this.logger.debug('Query' + JSON.stringify(query, null, 2));
      }
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Request Completed. ${Date.now() - now}ms`,
            `(${req.method})${req.originalUrl}`,
          ),
        ),
      );
  }
}
