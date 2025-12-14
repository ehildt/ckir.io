import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class JsonSchemaProperty {
  @IsString() type: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() minLength?: number;
}

export class JsonSchema {
  @IsString() type: string;
  @IsOptional() additionalProperties?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];

  @IsOptional()
  @IsObject()
  properties?: Record<PropertyKey, JsonSchemaProperty>;
}

export class McpTool {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => JsonSchema)
  inputSchema: JsonSchema;
}

export class McpToolsListResult {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => McpTool)
  tools: McpTool[];
}

export class McpToolsListResponse {
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @IsInt()
  id: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => McpToolsListResult)
  result: McpToolsListResult;
}
