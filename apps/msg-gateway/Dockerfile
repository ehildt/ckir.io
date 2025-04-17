# Setup corepack
FROM node:22-slim AS base
RUN corepack enable pnpm

# Target: local (entrypoint for local development)
FROM base AS local
WORKDIR /app
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"
EXPOSE 3001
EXPOSE 8081
RUN corepack enable pnpm
ENTRYPOINT ["pnpm", "start:dev"]

# Target: builder (shared build stage)
FROM base AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json tsconfig*.json shims.d.ts ./
COPY src/ ./src/

RUN corepack enable pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts

# Target: temporary (entrypoint for prepare-dev)
FROM builder AS builddev
WORKDIR /app
RUN pnpm run build

# Target: temporary (entrypoint for prepare-prod)
FROM builder AS buildprod
WORKDIR /app
RUN pnpm run build:prod

# Target: development (entrypoint for dev-stage)
FROM base AS development
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV                                         \
  NODE_OPTIONS="--max-old-space-size=256"   \
  NODE_ENV="production"                     \
  PRINT_CONFIG="true"                       \
  ENABLE_REST="true"                        \
  ENABLE_SWAGGER="true"                     \
  PATH="$PNPM_HOME:$PATH"                   \
  PORT="3001"                               \
  SOCKET_IO_PORT="8081"                     \
  ADDRESS="0.0.0.0"                         \
  BODY_LIMIT="104857600"                    \
  BULLMQ_PORT="6379"                        \
  BULLMQ_USER="default"                     \
  BULLMQ_PASS="redis"                       \
  BULLMQ_HOST="keydb"                       

COPY --chown=node:node --from=builddev /app/dist ./dist
COPY --chown=node:node --from=builddev /app/package*.json ./
COPY --chown=node:node --from=builddev /app/node_modules ./node_modules

RUN corepack enable pnpm

EXPOSE 3001
EXPOSE 8081
USER node
ENTRYPOINT ["pnpm", "start:node"]

# Target: production (entrypoint for prod-stage)
FROM base AS production
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV                                         \
  NODE_OPTIONS="--max-old-space-size=256"   \
  NODE_ENV="production"                     \
  PRINT_CONFIG="true"                       \
  ENABLE_REST="true"                        \
  ENABLE_SWAGGER="true"                     \
  PATH="$PNPM_HOME:$PATH"                   \
  PORT="3001"                               \
  SOCKET_IO_PORT="8081"                     \
  ADDRESS="0.0.0.0"                         \
  BODY_LIMIT="104857600"                    \
  BULLMQ_PORT="6379"                        \
  BULLMQ_USER="default"                     \
  BULLMQ_PASS="redis"                       \
  BULLMQ_HOST="keydb"                       

COPY --chown=node:node --from=buildprod /app/dist ./dist
COPY --chown=node:node --from=buildprod /app/package*.json ./
COPY --chown=node:node --from=buildprod /app/node_modules ./node_modules

RUN corepack enable pnpm

EXPOSE 3001
EXPOSE 8081
USER node
ENTRYPOINT ["pnpm", "start:node"]