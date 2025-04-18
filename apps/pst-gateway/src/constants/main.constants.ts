import { LogLevel } from '@nestjs/common';

export const BODY_LIMIT = parseInt(process.env.BODY_LIMIT ?? '16777216', 10);

export const LOG_LEVEL: Array<LogLevel> =
  process.env.NODE_ENV === 'production'
    ? ['error', 'warn', 'fatal']
    : ['warn', 'error', 'debug', 'log', 'verbose', 'fatal'];
