import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';

import packageJson from '../../package.json';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';

export const API_DOCS = 'api-docs';
export const API_DOCS_JSON = 'api-docs-json';
export const BODY_LIMIT = parseInt(process.env.BODY_LIMIT ?? '16777216', 10);
export const LOG_LEVEL: Array<LogLevel> =
  process.env.NODE_ENV === 'production'
    ? ['error', 'warn', 'fatal']
    : ['warn', 'error', 'debug', 'log', 'verbose', 'fatal'];

export const VALIDATION_PIPE = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidUnknownValues: true,
  forbidNonWhitelisted: true,
});

export const SWAGGER_DOCUMENT = new DocumentBuilder()
  .setTitle(packageJson.name.toUpperCase())
  .setDescription(packageJson.description)
  .setVersion(packageJson.version)
  .build();

export function logConfigObject(logger: Logger, factory: ConfigFactoryService) {
  if (process.env.PRINT_CONFIG === 'true')
    logger.log(Object.keys(factory).reduce((obj, key) => Object.assign(obj, { [key.slice(1)]: factory[key] }), {}));
}

export function logServerPath(logger: Logger, factory: ConfigFactoryService) {
  logger.log(`ws://localhost:${factory.socketIOConfig.port}`, 'Socket.IO');
  logger.log(`http://localhost:${factory.appConfig.port}`, 'REST API');
}

export function logSwaggerPath(logger: Logger, factory: ConfigFactoryService) {
  if (!factory.appConfig.enableSwagger) return;
  const baseUrl = `http://localhost:${factory.appConfig.port}`;
  logger.warn(`${baseUrl}/${API_DOCS_JSON}`, 'Swagger JSON');
  logger.warn(`${baseUrl}/${API_DOCS}`, 'Swagger UI');
}
