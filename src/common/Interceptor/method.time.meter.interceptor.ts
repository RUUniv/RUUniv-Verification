import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MethodTimeMeterInterceptor implements NestInterceptor {
  //constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();

    const funcName = context.getHandler().name;
    const className = context.getClass().name;

    return next.handle().pipe(
      tap(async () => {
        const end = Date.now();
        const time = end - start;
        const logger = new Logger();
        logger.debug(
          `function '${funcName}' of class '${className}' executed in ${time} ms. `,
        );
      }),
    );
  }
}
