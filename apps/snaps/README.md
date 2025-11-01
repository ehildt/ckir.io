**@CKIR.IO/SNAPS** is a microservice for temporarily storing and managing topics, threads, and posts. It handles real-time emission to clients via Socket.IO and supports queuing for persistence using BullMQ. Each entity—topic, thread, or post—is tracked with relevant metadata such as participants, replies, activity timestamps, tags, and operational modes. The service provides a robust, extensible foundation for managing and distributing content in real-time workflows.

## ENVs

```ini
# Base
PORT=3003
ADDRESS=0.0.0.0
NODE_ENV=local
PRINT_CONFIG=true
ENABLE_SWAGGER=true
BODY_LIMIT=104857600
LOG_LEVEL=warn # comma separated 'warn' | 'error' | 'debug' | 'log' | 'verbose' | 'fatal'

# Cors
CORS_ORIGIN=*
CORS_METHODS=GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE
CORS_PREFLIGHT_CONTINUE=false
CORS_OPTIONS_SUCCESS_STATUS=204
CORS_CREDENTIALS=true
CORS_ALLOWED_HEADERS=Content-Type,Authorization,Accept,X-Requested-With

# BullMQ Connection Settings
BULLMQ_HOST=keydb
BULLMQ_PORT=6379
BULLMQ_USER=default
BULLMQ_PASS=redis
BULLMQ_CONNECT_TIMEOUT=30000
BULLMQ_COMMAND_TIMEOUT=30000

# TLS Configuration (Optional)
BULLMQ_USE_TLS=false
BULLMQ_TLS_REJECT_UNAUTHORIZED=true
BULLMQ_PASSPHRASE=test
BULLMQ_TLS_CA=""
BULLMQ_TLS_CERT=""
BULLMQ_TLS_KEY=""

# Job Options (Optional)
BULLMQ_JOB_DELAY=0
BULLMQ_JOB_LIFO=false
BULLMQ_JOB_PRIORITY=0
BULLMQ_JOB_ATTEMPTS=15
BULLMQ_JOB_STACK_TRACE_LIMIT=10
BULLMQ_REMOVE_ON_COMPLETE=true
BULLMQ_REMOVE_ON_FAIL_AGE=604800000
BULLMQ_REMOVE_ON_FAIL_COUNT=1000
BULLMQ_PINO_LOG_LEVEL=info

# Backoff Strategy (Optional)
BULLMQ_BACKOFF_TYPE=exponential
BULLMQ_BACKOFF_DELAY=5270

# Jobs & Queues (Optional)
BULLMQ_JOB_PERSIST=PERSIST
BULLMQ_QUEUE_PERSIST_TOPIC=PERSIST_TOPIC
BULLMQ_QUEUE_PERSIST_THREAD=PERSIST_THREAD
BULLMQ_QUEUE_PERSIST_MESSAGE=PERSIST_MESSAGE

# MongoDB
MONGODB_CONNECTION_STRING='mongodb://resync:resync@mongo:27017,mongo_two:27018,mongo_three:27019/ckir?replicaSet=rs0&retryWrites=true&w=majority&tls=false&tlsInsecure=true'
```
