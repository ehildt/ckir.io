import compression from '@fastify/compress';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BODY_LIMIT, LOG_LEVEL } from './constants/main.constants';
import { MainModule } from './main.module';
import { MainService } from './main.service';

void (async () => {
  const logger = { logger: LOG_LEVEL };
  const adapter = new FastifyAdapter({ bodyLimit: BODY_LIMIT });
  const APP = await NestFactory.create<NestFastifyApplication>(MainModule, adapter, logger);
  const appService = APP.get(MainService);
  const factory = APP.get(ConfigFactoryService);
  await APP.register(compression);
  APP.enableCors(factory.appConfig.cors);
  appService.configureGlobalPipes(APP);
  appService.enableVersioning(APP);
  appService.setupSwagger(APP);
  APP.enableShutdownHooks(['SIGINT', 'SIGTERM', 'SIGQUIT']);
  await APP.listen(factory.appConfig.port, factory.appConfig.address);
  appService.logStartupInfo();
})();
