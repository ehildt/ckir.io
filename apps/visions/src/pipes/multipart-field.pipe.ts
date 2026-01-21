import { MultipartValue } from '@fastify/multipart';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MultipartFieldPipe implements PipeTransform<
  unknown,
  MultipartValue
> {
  constructor(private readonly field: string) {}
  transform(v: MultipartValue) {
    if (v == null)
      throw new BadRequestException(`Invalid multipart field ${this.field}`);
    return v;
  }
}
