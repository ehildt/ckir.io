import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
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
} from './mcp.model';

export class McpCollectionSearchVectorReq_Params_Arguments {
  constructor(obj?: McpCollectionSearchVectorReq_Params_Arguments) {
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

  @IsArray()
  @ApiProperty({
    type: [Number],
  })
  vector: Array<number>;
}

export class McpCollectionSearchVectorReq_Params {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'vectors.collection.search.text' satisfies SupportedToolFunction,
  })
  function: SupportedToolFunction;

  @ApiProperty({
    type: McpCollectionSearchVectorReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpCollectionSearchVectorReq_Params_Arguments)
  @ValidateNested()
  arguments: McpCollectionSearchVectorReq_Params_Arguments;
}

export class McpCollectionSearchVectorReq implements McpGenericType {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionSearchVectorReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionSearchVectorReq_Params)
  params: McpCollectionSearchVectorReq_Params;
}
