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

export type QdrantSearchResponse = {
  id: string | number;
  version: number;
  score: number;
  payload?: Record<string, unknown> | null;
  vector?:
    | Record<string, unknown>
    | number[]
    | number[][]
    | {
        [key: string]:
          | number[]
          | number[][]
          | {
              indices: number[];
              values: number[];
            }
          | undefined;
      }
    | null;
  shard_key?: string | number | Record<string, unknown> | null;
  order_value?: number | Record<string, unknown> | null;
};
