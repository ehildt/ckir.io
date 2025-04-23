import { QdrantDistance, QdrantEmbeddingSize } from '@ckir.io/qdrant';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

export const ApiParamCollection = () => ApiParam({ name: 'collection', type: String, required: true, example: 'ckir' });

export const ApiQueryVectorSize = () =>
  ApiQuery({
    name: 'vectorSize',
    required: true,
    enum: QdrantEmbeddingSize,
    default: QdrantEmbeddingSize.Size1024,
  });

export const ApiQueryScore = () => ApiQuery({ name: 'score', type: Number, default: 0.7, required: false });
export const ApiQueryLimit = () => ApiQuery({ name: 'limit', type: Number, required: false });
export const ApiQueryOffset = () => ApiQuery({ name: 'offset', type: Number, required: false });

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
