**@CKIR.IO/TOPICS** is a modular microservice for real-time topic management. It emits topics to clients via Socket.IO and uses BullMQ to store data asynchronously with automatic retries. Each topic is tracked with metadata including participants, activity timestamps, thread counts, and tags, and operational modes allow flexible control over topic behavior. The service provides a robust, extensible foundation for managing topics in real-time workflows.

## ENVs

```ini
# Base
PORT=3000
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

# Socket.IO
SOCKET_IO_PORT=4000
SOCKET_IO_MAX_HTTP_BUFFER_SIZE=262144
SOCKET_IO_CLEANUP_EMPTY_CHILD_NAMESPACES=false
SOCKET_IO_TRANSPORTS=websocket,polling,webtransport
SOCKET_IO_CORS_ORIGIN=*
SOCKET_IO_CORS_CREDENTIALS=true
SOCKET_IO_CORS_METHODS=GET,POST
SOCKET_IO_PING_INTERVAL=25000
SOCKET_IO_PING_TIMEOUT=5000
SOCKET_IO_ALLOW_EIO3=false

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
BULLMQ_REMOVE_ON_COMPLETED_AGE=604800000
BULLMQ_REMOVE_ON_COMPLETED_COUNT=1000
BULLMQ_REMOVE_ON_FAIL_AGE=604800000
BULLMQ_REMOVE_ON_FAIL_COUNT=1000
BULLMQ_LOG_LEVEL=info

# Backoff Strategy (Optional)
BULLMQ_BACKOFF_TYPE=exponential
BULLMQ_BACKOFF_DELAY=5270
```
