`@ehildt/ckir-bullmq` wraps BullMQ and is used across services and libraries in the ckir.io monorepo.

![Version](https://img.shields.io/badge/Version-0.1.1-blue)
![NestJS](https://img.shields.io/badge/NestJS-v11.1.6-E0234E?logo=nestjs&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-v5.58.9-FF6600?logo=redis&logoColor=white) ![Ioredis](https://img.shields.io/badge/Ioredis-v5.8.0-DC382D?logo=redis&logoColor=white) ![Pino](https://img.shields.io/badge/Pino-v9.12.0-3E8E41?logo=pino&logoColor=white) ![Joi](https://img.shields.io/badge/Joi-v18.0.1-5A29E4?logo=joi&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue) ![ESLint](https://img.shields.io/badge/ESLint-v9.38.0-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-v3.6.2-F7B93E?logo=prettier&logoColor=white) ![SonarJS](https://img.shields.io/badge/SonarJS-v3.0.5-303F9F?logo=sonarcloud&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-v30.2.0-C21325?logo=jest&logoColor=white)

## Exports

### BullMQ

```ini
# A dynamic NestJS module that allows registering configuration providers at runtime.
- BullMQModule

# An adapter that reads system environment variables and returns the BullMQArgs configuration.
- BullMQArgsAdapter

# The Joi schema used to validate the BullMQArgs configuration.
- BullMQArgsSchema

# An adapter that reads system environment variables and returns the BullMQConfig configuration.
- BullMQConfigAdapter

# The Joi schema used to validate the BullMQConfig configuration.
- BullMQConfigSchema

# The BullMQ configuration type definition.
- BullMQConfig

# The BullMQ arguments configuration type definition.
- BullMQArgs

# An object that contains all BullMQ queues.
- BULLMQ_QUEUE

# An object that contains all BullMQ jobs.
- BULLMQ_JOB
```

#### Example

DEPRECATED: PinoModule is currently used internally by BullMQModule but will be leveraged in a future release.

```ts
import {
  BULLMQ_QUEUE,
  BullMQModule,
} from '@ehildt/ckir-bullmq';

import { BullMQConfigService } from './configs/bullmq-config.service';
import { TopicProcessor } from './processors/topic.processor';


@Module({
  // ...
  imports: [
    // ...
    BullMQModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      processors: [TopicProcessor],
      queues: [
        BULLMQ_QUEUE.BROADCAST_TOPIC,
        BULLMQ_QUEUE.PERSIST_TOPIC,
        BULLMQ_QUEUE.VECTORIZE_TOPIC,
      ],
      usePinoFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: BullMQConfigService) =>
        bullMQConfig,
    }),
    // ...
  ],
})
export class MainModule {}
```


### BullMQ Logger

```ini
# A dynamic NestJS module that allows registering configuration providers at runtime.
- BullMQPinoLoggerModule

# An adapter that reads system environment variables and returns the pino.LoggerOptions configuration.
- BullMQPinoAdapter

# The Joi schema used to validate the pino.LoggerOptions configuration.
- BullMQPinoLoggerSchema

# The logger service used for logging BullMQ jobs.
- BullMQPinoLoggerService
```

#### Example

```ts
import {
  BullMQPinoLoggerModule,
} from '@ehildt/ckir-bullmq';

@Module({
  // ...
  imports: [
    BullMQPinoLoggerModule.registerAsync({
      inject: [BullMQConfigService],
      useFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
    }),
  ],
})
export class MainModule {}
```

## ENVs

```ini
# Job Options
BULLMQ_JOB_DELAY=0
BULLMQ_JOB_LIFO=false
BULLMQ_JOB_PRIORITY=0
BULLMQ_JOB_ATTEMPTS=7
BULLMQ_JOB_STACK_TRACE_LIMIT=10

# Remove on Complete
BULLMQ_REMOVE_ON_COMPLETED_AGE=604800000
BULLMQ_REMOVE_ON_COMPLETED_COUNT=1000

# Remove on Fail
BULLMQ_REMOVE_ON_FAIL_AGE=604800000
BULLMQ_REMOVE_ON_FAIL_COUNT=1000

# Backoff
BULLMQ_BACKOFF_TYPE=exponential
BULLMQ_BACKOFF_DELAY=500

# Connection
BULLMQ_ENABLE_READY_CHECK=false
BULLMQ_HOST=localhost
BULLMQ_PORT=6379
BULLMQ_USER=default
BULLMQ_PASS=redis
BULLMQ_CONNECT_TIMEOUT=30000
BULLMQ_COMMAND_TIMEOUT=30000

# TLS (optional)
BULLMQ_USE_TLS=false
BULLMQ_PASSPHRASE=
BULLMQ_TLS_REJECT_UNAUTHORIZED=true
BULLMQ_TLS_CA=   # base64 encoded certificate
BULLMQ_TLS_CERT= # base64 encoded certificate
BULLMQ_TLS_KEY=  # base64 encoded key

# BULLMQ PINO
BULLMQ_PINO_LOG_LEVEL=info
```

## PeerDependencies

```ini
  - "@ehildt/ckir-helpers": "^0.1.5",
  - "@nestjs/bullmq": "^11.0.3",
  - "@nestjs/common": "^11.1.6",
  - "bullmq": "^5.58.9",
  - "ioredis": "^5.8.0",
  - "joi": "^18.0.1",
  - "pino": "^9.12.0"
```
