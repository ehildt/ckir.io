import {
  QDRANT_EMBEDDING_DIMENSIONS,
  QdrantDistance,
  QdrantEmbeddingSize,
} from '@ehildt/ckir-qdrant';
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
  ValidateNested,
} from 'class-validator';

import {
  McpGenericType,
  SupportedToolFunction,
  SupportedToolMethod,
} from './mcp.model';

export class McpCollectionCreateReq_Params_Arguments {
  constructor(obj?: McpCollectionCreateReq_Params_Arguments) {
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
  @ApiProperty({
    type: String,
    example: 'Cosine',
    enum: [
      'Cosine',
      'Dot',
      'Euclid',
      'Manhattan',
    ] satisfies Array<QdrantDistance>,
    description: [
      'Distance/similarity function used to compare vectors in the collection.',
      'Must match the collection index configuration.',
    ].join('\n'),
  })
  distance: QdrantDistance;

  @IsInt()
  @ApiProperty({
    type: Number,
    enum: QDRANT_EMBEDDING_DIMENSIONS,
    example: QdrantEmbeddingSize.Size768,
    description: [
      'Embedding dimensionality for the generated query vector.',
      'Must match the vector size configured for the selected collection.',
    ].join('\n'),
  })
  vectorSize: QdrantEmbeddingSize;
}

export class McpCollectionCreateReq_Params {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'vectors.collection.create' satisfies SupportedToolFunction,
  })
  function: SupportedToolFunction;

  @ApiProperty({
    type: McpCollectionCreateReq_Params_Arguments,
    description: 'Tool arguments as defined by the tool inputSchema',
  })
  @IsObject()
  @Type(() => McpCollectionCreateReq_Params_Arguments)
  @ValidateNested()
  arguments: McpCollectionCreateReq_Params_Arguments;
}

export class McpCollectionCreateReq implements McpGenericType {
  @ApiProperty({ example: 2 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc: '2.0';

  @ApiProperty({ example: 'tools/call' satisfies SupportedToolMethod })
  @IsString()
  method: SupportedToolMethod;

  @ApiProperty({ type: McpCollectionCreateReq_Params })
  @ValidateNested()
  @Type(() => McpCollectionCreateReq_Params)
  params: McpCollectionCreateReq_Params;
}
