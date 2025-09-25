# Setup corepack
FROM node:24 AS base

RUN corepack enable pnpm

# Target: local (entrypoint for local development)
FROM base AS local
WORKDIR /app
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"
EXPOSE 3000
EXPOSE 4000
ENTRYPOINT ["pnpm", "start:dev"]

# Target: builder (shared build stage)
FROM base AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json tsconfig*.json shims.d.ts ./
COPY src/ ./src/

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
  ENABLE_SWAGGER="true"                     \
  PATH="$PNPM_HOME:$PATH"                   \
  PORT="3000"                               \
  SOCKET_IO_PORT="4000"                     \
  ADDRESS="0.0.0.0"                         \
  BODY_LIMIT="104857600"                    \
  BULLMQ_PORT="6379"                        \
  BULLMQ_USER="default"                     \
  BULLMQ_PASS="redis"                       \
  BULLMQ_HOST="keydb"                       

COPY --chown=node:node --from=builddev /app/dist ./dist
COPY --chown=node:node --from=builddev /app/package*.json ./
COPY --chown=node:node --from=builddev /app/node_modules ./node_modules

EXPOSE 3000
EXPOSE 4000
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
  ENABLE_SWAGGER="true"                     \
  PATH="$PNPM_HOME:$PATH"                   \
  PORT="3000"                               \
  SOCKET_IO_PORT="4000"                     \
  ADDRESS="0.0.0.0"                         \
  BODY_LIMIT="104857600"                    \
  BULLMQ_PORT="6379"                        \
  BULLMQ_USER="default"                     \
  BULLMQ_PASS="redis"                       \
  BULLMQ_HOST="keydb"                       

COPY --chown=node:node --from=buildprod /app/dist ./dist
COPY --chown=node:node --from=buildprod /app/package*.json ./
COPY --chown=node:node --from=buildprod /app/node_modules ./node_modules

EXPOSE 3000
EXPOSE 4000
USER node
ENTRYPOINT ["pnpm", "start:node"]