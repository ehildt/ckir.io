import { DynamicModule, Module } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

import { QDRANT_CLIENT } from './qdrant.constants';
import { QdrantModuleProps } from './qdrant.model';
import { QdrantService } from './qdrant.service';

@Module({})
export class QdrantModule {
  static registerAsync(props: QdrantModuleProps): DynamicModule {
    return {
      global: props.global,
      module: QdrantModule,
      exports: [QdrantService, QDRANT_CLIENT],
      providers: [
        QdrantService,
        {
          provide: QDRANT_CLIENT,
          inject: props.inject,
          useFactory: async (...deps) =>
            new QdrantClient(await props.useFactory(...deps)),
        },
      ],
    };
  }
}
