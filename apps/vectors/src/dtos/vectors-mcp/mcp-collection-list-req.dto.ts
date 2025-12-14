import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  McpGenericType,
  SupportedToolFunction,
  SupportedToolMethod,
} from '../supported-tools.model';

export class McpCollectionListReq_Params {
  @ApiProperty({
    example: 'vectors.collection.list' satisfies SupportedToolFunction,
  })
  @IsString()
  name: SupportedToolFunction;

  @ApiProperty({ type: Object })
  @IsObject()
  arguments: Record<string | number, any>;
}

export class McpCollectionListReq implements McpGenericType {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'tools/list' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionListReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionListReq_Params)
  params: McpCollectionListReq_Params;
}
