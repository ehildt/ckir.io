import { BadRequestException, PipeTransform, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { McpGenericType } from '@/dtos/json-rpc/mcp.model';

export class McpValidationPipe<T> implements PipeTransform {
  constructor(private readonly funcDtoMap: Map<T, Type>) {}

  async transform(value: any): Promise<McpGenericType> {
    // Step 1: parse string payloads from multipart
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        throw new BadRequestException('Invalid JSON in payload');
      }
    }

    // Step 2: basic JSON-RPC checks
    if (!value?.jsonrpc || value.jsonrpc !== '2.0') {
      throw new BadRequestException('Invalid jsonrpc version');
    }

    if (!value.method) {
      throw new BadRequestException('Missing method field');
    }

    // Step 3: allow pass-through for tools/list
    if (value.method === 'tools/list') return value;

    // Step 4: only support tools/call
    if (value.method !== 'tools/call') {
      throw new BadRequestException(`Unsupported method: ${value.method}`);
    }

    // Step 5: resolve DTO from function map
    const func = value.params?.function as T;
    const dto = this.funcDtoMap.get(func);
    if (!dto) {
      throw new BadRequestException(`Unsupported function: ${func}`);
    }

    // Step 6: transform + validate
    const instance = plainToInstance(dto, value);
    const errors = await validate(instance, { whitelist: true });

    if (errors.length) {
      // Map validation errors to readable messages
      const messages = errors
        .map((e) => {
          const constraints = e.constraints
            ? Object.values(e.constraints).join(', ')
            : '';
          return `${e.property}: ${constraints}`;
        })
        .join('; ');

      throw new BadRequestException(`Validation failed: ${messages}`);
    }

    return instance;
  }
}
