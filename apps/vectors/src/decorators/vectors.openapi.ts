import { QdrantDistance, QdrantEmbeddingSize } from '@ehildt/ckir-qdrant';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { QueryFilterTypeEnum } from './vectors.decorators';

export const ApiParamCollection = () =>
  ApiParam({
    name: 'collection',
    type: String,
    required: true,
    example: 'ckir',
  });

export const ApiQueryVectorSize = () =>
  ApiQuery({
    name: 'vectorSize',
    required: true,
    schema: {
      type: 'integer',
      enum: Object.values(QdrantEmbeddingSize).filter(
        (v): v is number => typeof v === 'number',
      ),
      example: QdrantEmbeddingSize.Size1024,
    },
  });

export const ApiQueryFilterType = () =>
  ApiQuery({
    name: 'type',
    required: false,
    enum: QueryFilterTypeEnum,
    description: `
    Specifies the context for similarity search. If omitted, the search runs across the entire collection.`,
  });

export const ApiQueryScore = () =>
  ApiQuery({ name: 'score', type: Number, default: 0.7, required: false });

export const ApiQueryLimit = () =>
  ApiQuery({ name: 'limit', type: Number, required: false, default: 10 });

export const ApiQueryOffset = () =>
  ApiQuery({ name: 'offset', type: Number, required: false, default: 0 });

export const ApiBodyVector = () =>
  ApiBody({
    type: Number,
    isArray: true,
    required: true,
    description: `Takes an embedding as input and returns relevant content from Qdrant using the configured similarity search algorithm.`,
  });

export const ApiBodyText = () =>
  ApiBody({
    type: String,
    isArray: false,
    required: true,
    description: `Accepts a text input, generates its embedding using the configured embedding model, 
    and retrieves relevant content from Qdrant based on the configured similarity search algorithm.`,
  });

export const ApiQueryDistance = () =>
  ApiQuery({
    name: 'distance',
    required: true,
    default: 'Cosine' as QdrantDistance,
    enum: ['Cosine', 'Dot', 'Euclid', 'Manhattan'] as Array<QdrantDistance>,
  });
