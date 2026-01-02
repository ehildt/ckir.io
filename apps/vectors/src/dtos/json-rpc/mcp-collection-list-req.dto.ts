import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
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

export class McpCollectionListReq_Params {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'vectors.collection.list' satisfies SupportedToolFunction,
  })
  function: SupportedToolFunction;

  @ApiProperty({ type: Object })
  @IsObject()
  arguments: Record<string | number, any>;
}

export class McpCollectionListReq implements McpGenericType {
  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 'tools/list' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionListReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionListReq_Params)
  params: McpCollectionListReq_Params;
}
