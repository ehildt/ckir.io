import compression from '@fastify/compress';
import { Injectable, Logger, Module, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import mongodbUri from 'mongodb-uri';
import { join } from 'path';

import { ConfigFactoryLoader } from './config-factory/config-factory.loader';
import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { PersistenceModule } from './persistence/persistence.module';

const API_DOCS = 'api-docs';
const API_DOCS_JSON = 'api-docs-json';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    private readonly loader: ConfigFactoryLoader,
    private readonly factory: ConfigFactoryService,
  ) {}

  configureGlobalPipes(app: NestFastifyApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
      }),
    );
  }

  enableVersioning(app: NestFastifyApplication) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'api/v',
    });
  }

  setupSwagger(app: NestFastifyApplication) {
    if (!this.factory.appConfig.enableSwagger) return;

    const packageJson = this.loader.loadJSON<any>(join(__dirname, '../package.json'));
    const swaggerConfig = new DocumentBuilder()
      .setTitle(packageJson.name.toUpperCase())
      .setDescription(packageJson.description)
      .setVersion(packageJson.version)
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(API_DOCS, app, document);
  }

  logStartupInfo() {
    if (this.factory.appConfig.printConfig)
      this.logger.log(
        Object.keys(this.factory).reduce((obj, key) => {
          const config = key.match('mongoConfig') ? mongodbUri.parse(this.factory[key].uri) : this.factory[key];
          return { ...obj, [key.slice(1)]: config };
        }, {}),
      );

    const baseUrl = `http://localhost:${this.factory.appConfig.port}`;
    if (this.factory.appConfig.enableREST) this.logger.log(baseUrl, 'REST API');
    if (this.factory.appConfig.enableSwagger && this.factory.appConfig.enableREST) {
      this.logger.warn(`${baseUrl}/${API_DOCS_JSON}`, 'Swagger JSON');
      this.logger.warn(`${baseUrl}/${API_DOCS}`, 'Swagger UI');
    }
  }
}

@Module({
  providers: [AppService, Logger],
  imports: [ConfigFactoryModule.forRoot({ isGlobal: true }), PersistenceModule],
})
export class AppModule {}

void (async () => {
  const adapter = new FastifyAdapter({
    bodyLimit: parseInt(process.env.BODY_LIMIT ?? '16777216', 10),
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error', 'debug', 'log', 'verbose'],
  });

  const appService = app.get(AppService);
  const factory = app.get(ConfigFactoryService);

  await app.register(compression);
  app.enableCors(factory.appConfig.cors);
  appService.configureGlobalPipes(app);
  appService.enableVersioning(app);
  appService.setupSwagger(app);

  app.enableShutdownHooks(['SIGINT', 'SIGTERM', 'SIGQUIT']);

  if (factory.appConfig.enableREST) {
    await app.listen(factory.appConfig.port, factory.appConfig.address);
  }

  appService.logStartupInfo();
})();
