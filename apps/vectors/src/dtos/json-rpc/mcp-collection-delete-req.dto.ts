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

export class McpCollectionDeleteReq_Params_Arguments {
  constructor(obj?: McpCollectionDeleteReq_Params_Arguments) {
    if (obj) Object.assign(this, obj);
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'ckir',
    description: 'Target collection name to delete.',
  })
  collection: string;
}

export class McpCollectionDeleteReq_Params {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'vectors.collection.delete' satisfies SupportedToolFunction,
  })
  function: SupportedToolFunction;

  @ApiProperty({
    type: McpCollectionDeleteReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpCollectionDeleteReq_Params_Arguments)
  @ValidateNested()
  arguments: McpCollectionDeleteReq_Params_Arguments;
}

export class McpCollectionDeleteReq implements McpGenericType {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionDeleteReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionDeleteReq_Params)
  params: McpCollectionDeleteReq_Params;
}
