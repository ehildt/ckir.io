import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
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

export class McpCollectionEmbedDeleteReq_Params_Arguments {
  constructor(obj?: McpCollectionEmbedDeleteReq_Params_Arguments) {
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

  @IsArray({ each: true })
  @ApiProperty({
    type: [String],
  })
  pointIds: Array<string>;
}

export class McpCollectionEmbedDeleteReq_Params {
  @ApiProperty({
    example: 'vectors.collection.embed.delete' as SupportedToolFunction,
  })
  @IsString()
  name: SupportedToolFunction;

  @ApiProperty({
    type: McpCollectionEmbedDeleteReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpCollectionEmbedDeleteReq_Params_Arguments)
  @ValidateNested()
  arguments: McpCollectionEmbedDeleteReq_Params_Arguments;
}

export class McpCollectionEmbedDeleteReq implements McpGenericType {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionEmbedDeleteReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionEmbedDeleteReq_Params)
  params: McpCollectionEmbedDeleteReq_Params;
}
