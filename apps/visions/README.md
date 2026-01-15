**@CKIR.IO/VISIONS** is a microservice for processing and describing images and documents. It allows uploading one or more images (PNG, JPG, JPEG, WEBP) and supports optional AI-driven descriptions, vectorization, text extraction via OCR, and focused analysis on the main subject. Responses can be streamed, and the service provides a robust foundation for image understanding, indexing, and content retrieval workflows.

`Note: All CKIR.IO microservices that perform inference, vectorization, or text extraction (e.g., VECTORS, VISIONS) can be configured to use different AI models. Models can either be selected from those available on Ollama, or the user can convert a model to the GUFF format for use with the service.`

## ENVs

```ini
# Base
PORT=3005
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
BULLMQ_TLS=false
BULLMQ_TLS_REJECT_UNAUTHORIZED=true
BULLMQ_PASSPHRASE=test
# BULLMQ_TLS_CA=""
# BULLMQ_TLS_CERT=""
# BULLMQ_TLS_KEY=""

# Job Options (Optional)
BULLMQ_JOB_DELAY=0
BULLMQ_JOB_LIFO=false
BULLMQ_JOB_PRIORITY=0
BULLMQ_JOB_ATTEMPTS=15
BULLMQ_JOB_STACK_TRACE_LIMIT=10
BULLMQ_REMOVE_ON_COMPLETE=true
BULLMQ_REMOVE_ON_FAIL_AGE=604800000
BULLMQ_REMOVE_ON_FAIL_COUNT=1000
BULLMQ_PINO_LOG_LEVEL=debug

# Backoff Strategy (Optional)
BULLMQ_BACKOFF_TYPE=exponential
BULLMQ_BACKOFF_DELAY=5270

# Qdrant
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=e4f2c7d19a4b3f1285e7c93d6ac8f01a
QDRANT_CHECK_COMPATIBILITY=false

# Ollama
# OLLAMA_X_INFERENCE_MODEL
# OLLAMA_X_TEXT_EMBEDDING_MODEL
OLLAMA_X_VISION_MODEL=gemma3:27b

OLLAMA_KEEP_ALIVE=15m
OLLAMA_HOST=http://ollama:11434
```
