import { QdrantClientParams } from '@qdrant/js-client-rest';

export type QdrantDistance = 'Cosine' | 'Euclid' | 'Dot' | 'Manhattan';

export type QdrantConfigFactory = (...deps: Array<any>) => Promise<QdrantClientParams>;

export type QdrantModuleProps = {
  global?: boolean;
  inject: Array<any>;
  useFactory: QdrantConfigFactory;
};

export type SearchArgs = {
  score?: number;
  limit?: number;
  offset?: number;
  filter?: Record<string, any>;
};

export class QdrantCollectionsError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}
