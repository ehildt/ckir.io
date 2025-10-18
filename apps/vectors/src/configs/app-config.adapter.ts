import { AppConfig, getBooleanEnv, getNumberEnv } from '@ckir.io/helpers';
import { LogLevel } from '@nestjs/common';

export function AppConfigAdapter(): AppConfig {
  return {
    address: process.env.ADDRESS,
    nodeEnv: process.env.NODE_ENV,
    port: getNumberEnv(process.env.PORT),
    bodyLimit: getNumberEnv(process.env.BODY_LIMIT),
    printConfig: getBooleanEnv(process.env.PRINT_CONFIG),
    enableSwagger: getBooleanEnv(process.env.ENABLE_SWAGGER),
    logLevel: process.env.LOG_LEVEL.split(',')?.filter(
      Boolean,
    ) as Array<LogLevel>,
    cors: process.env.CORS_ORIGIN
      ? {
          origin: process.env.CORS_ORIGIN,
          methods: process.env.CORS_METHODS,
          preflightContinue: getBooleanEnv(process.env.CORS_PREFLIGHT_CONTINUE),
          optionsSuccessStatus: getNumberEnv(
            process.env.CORS_OPTIONS_SUCCESS_STATUS,
          ),
          credentials: getBooleanEnv(process.env.CORS_CREDENTIALS),
          allowedHeaders: process.env.CORS_ALLOWED_HEADERS ?? null,
        }
      : null,
  };
}
