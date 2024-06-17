import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance, instanceToPlain } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<unknown>) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(data => {
        const instance = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });

        return instanceToPlain(instance);
        //return instance;
      }),
    );
  }
}
