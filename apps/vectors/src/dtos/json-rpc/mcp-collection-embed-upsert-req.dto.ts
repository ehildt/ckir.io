import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  McpGenericType,
  SupportedToolFunction,
  SupportedToolMethod,
} from './mcp.model';

export class McpCollectionEmbedUpsertReq_Params_Arguments {
  constructor(obj?: McpCollectionEmbedUpsertReq_Params_Arguments) {
    if (obj) Object.assign(this, obj);
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'ckir',
    description:
      'Target collection name where to store the segmented content and payload',
  })
  collection: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'I love cookies. Cookies come in various flavors.',
    description: 'Raw text to be segmented and vectorized before upsert.',
  })
  content: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'An object that will be stored next to the segmented content',
  })
  payload?: Record<string | number, unknown>; // here
}

export class McpCollectionEmbedUpsertReq_Params {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'vectors.collection.embed.upsert' satisfies SupportedToolFunction,
  })
  function: SupportedToolFunction;

  @ApiProperty({
    type: McpCollectionEmbedUpsertReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpCollectionEmbedUpsertReq_Params_Arguments)
  @ValidateNested()
  arguments: McpCollectionEmbedUpsertReq_Params_Arguments;
}

export class McpCollectionEmbedUpsertReq implements McpGenericType {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionEmbedUpsertReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionEmbedUpsertReq_Params)
  params: McpCollectionEmbedUpsertReq_Params;
}
