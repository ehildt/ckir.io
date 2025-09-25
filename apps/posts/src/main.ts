import compress from '@fastify/compress';
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';

import { ConfigFactoryService } from './config-factory/config-factory.service';
import {
  API_DOCS,
  BODY_LIMIT,
  LOG_LEVEL,
  logConfigObject,
  logServerPath,
  logSwaggerPath,
  SWAGGER_DOCUMENT,
  VALIDATION_PIPE,
} from './constants/main.constants';
import { MainModule } from './main.module';

void (async () => {
  const logger = { logger: LOG_LEVEL };
  const adapter = new FastifyAdapter({ bodyLimit: BODY_LIMIT });
  const APP = await NestFactory.create<NestFastifyApplication>(MainModule, adapter, logger);
  const factory = APP.get(ConfigFactoryService);
  await APP.register(compress as any, {
    threshold: 1024, // minimum payload size to compress
    encodings: ['br', 'gzip'], // optional: restrict Brotli/gzip
    global: true, // default behavior – compress all
  });
  APP.enableCors(factory.appConfig.cors);
  APP.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });
  APP.useGlobalPipes(VALIDATION_PIPE);
  APP.enableShutdownHooks(['SIGINT', 'SIGTERM', 'SIGQUIT']);
  SwaggerModule.setup(API_DOCS, APP, SwaggerModule.createDocument(APP, SWAGGER_DOCUMENT));
  await APP.listen(
    {
      port: factory.appConfig.port,
      host: factory.appConfig.address,
    },
    () => {
      const nestLogger = APP.get(Logger);
      logConfigObject(nestLogger, factory);
      logServerPath(nestLogger, factory);
      logSwaggerPath(nestLogger, factory);
    },
  );
})();
