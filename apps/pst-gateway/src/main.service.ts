import { Injectable, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { ConfigFactoryLoader } from './config-factory/config-factory.loader';
import { ConfigFactoryService } from './config-factory/config-factory.service';

const API_DOCS = 'api-docs';
const API_DOCS_JSON = 'api-docs-json';

@Injectable()
export class MainService {
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
        Object.keys(this.factory).reduce((obj, key) => Object.assign(obj, { [key.slice(1)]: this.factory[key] }), {}),
      );

    const baseUrl = `http://localhost:${this.factory.appConfig.port}`;
    this.logger.log(baseUrl, 'REST API');

    if (!this.factory.appConfig.enableSwagger) return;
    this.logger.warn(`${baseUrl}/${API_DOCS_JSON}`, 'Swagger JSON');
    this.logger.warn(`${baseUrl}/${API_DOCS}`, 'Swagger UI');
  }
}
