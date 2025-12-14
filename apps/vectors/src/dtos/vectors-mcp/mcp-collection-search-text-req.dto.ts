import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  McpGenericType,
  SupportedToolFunction,
  SupportedToolMethod,
} from '../supported-tools.model';

export class McpCollectionSearchTextReq_Params_Arguments {
  constructor(obj?: McpCollectionSearchTextReq_Params_Arguments) {
    if (obj) Object.assign(this, obj);
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'ckir',
    description: 'Target collection name to search against.',
  })
  collection: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'I love cookies. Cookies come in various flavors.',
    description: 'The text content that is used for similarity search',
  })
  content: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    example: 10,
    default: 10,
    description: 'Maximum number of results to return.',
  })
  limit?: number = 10;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    example: 0,
    default: 0,
    description: 'Number of results to skip (pagination offset).',
  })
  offset?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    example: 0.6,
    default: 0.6,
    description: 'Minimum similarity score threshold.',
  })
  score?: number = 0.6;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  filters?: Record<string | number, unknown>;
}

export class McpCollectionSearchTextReq_Params {
  @ApiProperty({
    example: 'vectors.collection.search.text' satisfies SupportedToolFunction,
  })
  @IsString()
  name: SupportedToolFunction;

  @ApiProperty({
    type: McpCollectionSearchTextReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpCollectionSearchTextReq_Params_Arguments)
  @ValidateNested()
  arguments: McpCollectionSearchTextReq_Params_Arguments;
}

export class McpCollectionSearchTextReq implements McpGenericType {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionSearchTextReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionSearchTextReq_Params)
  params: McpCollectionSearchTextReq_Params;
}
