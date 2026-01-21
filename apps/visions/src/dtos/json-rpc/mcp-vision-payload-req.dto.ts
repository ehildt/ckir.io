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

import { VisionTask } from '../classic/get-fastify-multipart-data-req.dto';

import {
  McpGenericType,
  SupportedToolFunction,
  SupportedToolMethod,
} from './mcp.model';

export class VisionImageDescriptor {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  hash: string;

  @IsString()
  @ApiProperty()
  @IsIn(['image/png', 'image/jpeg', 'image/webp'])
  type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  filename: string;
}

export class McpVisionPayloadReq_Params_Arguments {
  constructor(obj?: McpVisionPayloadReq_Params_Arguments) {
    if (obj) Object.assign(this, obj);
  }

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    example: 'I love cookies!',
  })
  prompt?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    enum: ['describe', 'compare', 'ocr'] satisfies Array<VisionTask>,
    example: 'describe' as VisionTask,
  })
  task?: VisionTask;

  @ValidateNested({ each: true })
  @Type(() => VisionImageDescriptor)
  @ApiProperty({
    type: VisionImageDescriptor,
    isArray: true,
  })
  images: Array<VisionImageDescriptor>;
}

export class McpVisionPayloadReq_Params {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'visions.describe' satisfies SupportedToolFunction,
    enum: [
      'visions.describe',
      'visions.compare',
      'visions.ocr',
    ] satisfies Array<SupportedToolFunction>,
  })
  function: SupportedToolFunction;

  @ApiProperty({
    type: McpVisionPayloadReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpVisionPayloadReq_Params_Arguments)
  @ValidateNested()
  arguments: McpVisionPayloadReq_Params_Arguments;
}

export class McpVisionPayloadReq implements McpGenericType {
  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpVisionPayloadReq_Params })
  @ValidateNested()
  @Type(() => McpVisionPayloadReq_Params)
  params: McpVisionPayloadReq_Params;
}
