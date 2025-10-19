import { LogLevel } from '@nestjs/common';

export const API_DOCS = 'api-docs';
export const API_DOCS_JSON = 'api-docs-json';
export const BODY_LIMIT = parseInt(process.env.BODY_LIMIT ?? '16777216', 10);
export const LOG_LEVEL = process.env.LOG_LEVEL.split(',')?.filter(
  Boolean,
) as Array<LogLevel>;
