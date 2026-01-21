import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { CONDITIONAL_HEADER_KEY } from '@/decorators/headers.decorator';

@Injectable()
export class HeaderValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const headerName = this.reflector.get<string>(
      CONDITIONAL_HEADER_KEY,
      context.getHandler(),
    );

    if (!headerName) return next.handle();
    const request = context.switchToHttp().getRequest();
    const value = request.headers[headerName.toLowerCase()];
    if (value) request[headerName] = value;
    return next.handle();
  }
}
