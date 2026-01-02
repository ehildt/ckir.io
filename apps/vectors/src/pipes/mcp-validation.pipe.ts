import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  McpGenericType,
  SupportedToolFunction,
} from '@/dtos/json-rpc/mcp.model';
import { McpCollectionCreateReq } from '@/dtos/json-rpc/mcp-collection-create-req.dto';
import { McpCollectionDeleteReq } from '@/dtos/json-rpc/mcp-collection-delete-req.dto';
import { McpCollectionEmbedDeleteReq } from '@/dtos/json-rpc/mcp-collection-embed-delete-req.dto';
import { McpCollectionEmbedUpsertReq } from '@/dtos/json-rpc/mcp-collection-embed-upsert-req.dto';
import { McpCollectionListReq } from '@/dtos/json-rpc/mcp-collection-list-req.dto';
import { McpCollectionSearchTextReq } from '@/dtos/json-rpc/mcp-collection-search-text-req.dto';
import { McpCollectionSearchVectorReq } from '@/dtos/json-rpc/mcp-collection-search-vector-req.dto';

const MCP_DTO_MAP = new Map<SupportedToolFunction, Type>([
  ['vectors.collection.create', McpCollectionCreateReq],
  ['vectors.collection.delete', McpCollectionDeleteReq],
  ['vectors.collection.list', McpCollectionListReq],
  ['vectors.collection.search.text', McpCollectionSearchTextReq],
  ['vectors.collection.search.vector', McpCollectionSearchVectorReq],
  ['vectors.collection.embed.upsert', McpCollectionEmbedUpsertReq],
  ['vectors.collection.embed.delete', McpCollectionEmbedDeleteReq],
]);

@Injectable()
export class McpValidationPipe implements PipeTransform {
  async transform(value: McpGenericType) {
    if (value?.jsonrpc !== '2.0')
      throw new BadRequestException('Invalid jsonrpc');

    if (value.method === 'tools/list') return value;

    if (value.method !== 'tools/call')
      throw new BadRequestException(`Unsupported method: ${value.method}`);

    const dto = MCP_DTO_MAP.get(value.params?.function);

    if (!dto)
      throw new BadRequestException(
        `Unsupported function: ${value.params?.function}`,
      );

    const instance = plainToInstance(dto, value);
    const errors = await validate(instance, {
      whitelist: true,
    });
    if (errors.length) throw new BadRequestException(errors);
    return instance;
  }
}
