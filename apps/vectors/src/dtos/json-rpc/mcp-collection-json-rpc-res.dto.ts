import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsIn, IsObject } from 'class-validator';

import { AggregatedBucket } from '../classic/collection-embed-search-text-res.dto';

import { McpCollectionCreateRes } from './mcp-collection-create-res.dto';
import { McpCollectionEmbedUpsertRes } from './mcp-collection-embed-upsert-res.dto';
import { McpToolsListResultRes } from './mcp-collection-list-res.dto';

export class McpCollectionJsonRpcRes {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  id: number;

  @IsObject()
  @ApiProperty({
    oneOf: [
      {
        $ref: getSchemaPath(McpToolsListResultRes),
      },
      {
        $ref: getSchemaPath(McpCollectionCreateRes),
      },
      {
        $ref: getSchemaPath(McpCollectionEmbedUpsertRes),
      },
      {
        type: 'array',
        title: 'McpCollectionEmbedSearch',
        items: { $ref: getSchemaPath(AggregatedBucket) },
      },
      {
        type: 'boolean',
      },
    ],
  })
  result: Record<string | number, any>;
}
