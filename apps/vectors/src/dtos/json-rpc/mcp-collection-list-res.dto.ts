import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class JsonSchemaProperty {
  @IsString()
  @ApiProperty()
  type: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  minLength?: number;
}

export class JsonSchema {
  @ApiProperty({ example: 'object' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'false' })
  @IsOptional()
  additionalProperties?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ example: [] })
  required?: Array<string>;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    example: {},
  })
  properties?: Record<PropertyKey, JsonSchemaProperty>;
}

export class McpTool {
  @IsString()
  @ApiProperty({
    example: 'vectors.collection.list',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Lists available collections.' })
  description?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => JsonSchema)
  @ApiProperty({ type: JsonSchema })
  inputSchema: JsonSchema;
}

export class McpToolsListResultRes {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => McpTool)
  @ApiProperty({
    type: McpTool,
    isArray: true,
  })
  tools: Array<McpTool>;
}
