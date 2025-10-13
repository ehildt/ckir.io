import { getBooleanEnv } from '@ckir.io/helpers';
import { QdrantClientParams } from '@qdrant/js-client-rest';

export function QdrantConfigAdapter(
  params?: QdrantClientParams,
): QdrantClientParams {
  return {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: getBooleanEnv(
      process.env.QDRANT_CHECK_COMPATIBILITY,
      false,
    ),
    ...params,
  };
}
