import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class McpContentBlock {
  @ApiProperty({ example: 'json', enum: ['text', 'json'] })
  @IsString()
  type: 'text' | 'json';

  @ApiProperty({ required: false, description: 'Used when type="text"' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ required: false, description: 'Used when type="json"' })
  @IsOptional()
  @IsObject()
  json?: Record<PropertyKey, any>;
}

export class McpToolsCallResult {
  @ApiProperty({ type: [McpContentBlock] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => McpContentBlock)
  content: Array<McpContentBlock>;
}

export class McpJsonRpcResponse {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ type: McpToolsCallResult })
  @ValidateNested()
  @Type(() => McpToolsCallResult)
  result: McpToolsCallResult;
}
