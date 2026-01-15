import { QdrantDistance, QdrantEmbeddingSize } from '@ehildt/ckir-qdrant';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { CollectionEmbedSearchTextReq } from '@/dtos/classic/collection-embed-search-text-req.dto';
import { AggregatedBucket } from '@/dtos/classic/collection-embed-search-text-res.dto';
import { CollectionEmbedSearchVectorReq } from '@/dtos/classic/collection-embed-search-vector-req.dto';
import { CollectionEmbedUpsertReq } from '@/dtos/classic/collection-embed-upsert-req.dto';
import { CollectionEmbedUpsertRes } from '@/dtos/classic/collection-embed-upsert-res.dto';

export const ApiParamCollection = () =>
  ApiParam({
    name: 'collection',
    type: String,
    required: true,
    example: 'ckir',
  });

export const ApiQueryCollection = () =>
  ApiQuery({
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
      example: QdrantEmbeddingSize.Size768,
    },
  });

export const ApiQueryScore = () =>
  ApiQuery({ name: 'score', type: Number, default: 0.7, required: false });

export const ApiQueryLimit = () =>
  ApiQuery({ name: 'limit', type: Number, required: false, default: 10 });

export const ApiQueryOffset = () =>
  ApiQuery({ name: 'offset', type: Number, required: false, default: 0 });

export const ApiQueryDistance = () =>
  ApiQuery({
    name: 'distance',
    required: true,
    default: 'Cosine' as QdrantDistance,
    enum: ['Cosine', 'Dot', 'Euclid', 'Manhattan'] as Array<QdrantDistance>,
  });

export const ApiSearchVector = () =>
  applyDecorators(
    ApiBody({ type: () => CollectionEmbedSearchVectorReq }),
    ApiQueryLimit(),
    ApiQueryOffset(),
    ApiQueryScore(),
    ApiParamCollection(),
    ApiOperation({
      description: `Aggregates vector search matches based on the following logic:
    * **Vector Identification**: Each match is identified by a unique \`matches[0].id\`.
    * **Payload Structure**: An optional \`payload.id\` links segments that belong to the same parent document or context.
    * **Granularity**: Matches may contain segmented text from various sources.
    * **Deduplication**: The \`aggregatedPayloadIds\` field provides a unique list of all parent IDs referenced in the result set.
  `,
    }),
  );

export const ApiSearchText = () =>
  applyDecorators(
    ApiBody({ type: () => CollectionEmbedSearchTextReq }),
    ApiOkResponse({ type: AggregatedBucket, isArray: true }),
    ApiQueryLimit(),
    ApiQueryOffset(),
    ApiQueryScore(),
    ApiParamCollection(),
    ApiHeader({
      name: 'x-embedding-llm',
      description: 'Specifies which LLM to use for embedding',
      required: false,
      schema: {
        type: 'string',
        example: 'embeddinggemma',
      },
    }),
    ApiOperation({
      description: `Aggregates vector search matches based on the following logic:
    * **Vector Identification**: Each match is identified by a unique \`matches[0].id\`.
    * **Payload Structure**: An optional \`payload.id\` links segments that belong to the same parent document or context.
    * **Granularity**: Matches may contain segmented text from various sources.
    * **Deduplication**: The \`aggregatedPayloadIds\` field provides a unique list of all parent IDs referenced in the result set.
  `,
    }),
  );

export const ApiUpsertEmbeddings = () =>
  applyDecorators(
    ApiParam({ name: 'collection', example: 'ckir' }),
    ApiCreatedResponse({ type: CollectionEmbedUpsertRes }),
    ApiBody({ type: CollectionEmbedUpsertReq }),
    ApiOperation({
      description: `
        Accepts text input and generates embeddings using the configured embedding model. 
        Input is segmented, so multiple embeddings may be returned.`,
    }),
    ApiHeader({
      name: 'x-embedding-llm',
      description: 'Specifies which LLM to use for embedding',
      required: false,
      schema: {
        type: 'string',
        example: 'embeddinggemma',
      },
    }),
  );

export const ApiCreateCollection = () =>
  applyDecorators(
    ApiQueryDistance(),
    ApiQueryCollection(),
    ApiQueryVectorSize(),
  );
