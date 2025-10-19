`@ehildt/ckir-socket-io` wraps socket-io and is used across services and libraries in the ckir.io monorepo.

![Version](https://img.shields.io/badge/Version-0.1.1-blue) ![NestJS](https://img.shields.io/badge/NestJS-v11.1.6-E0234E?logo=nestjs&logoColor=white) ![SocketIO](https://img.shields.io/badge/SocketIO-4.8.1-00AACC?logo=SocketIO&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue) ![ESLint](https://img.shields.io/badge/ESLint-v9.38.0-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-v3.6.2-F7B93E?logo=prettier&logoColor=white) ![SonarJS](https://img.shields.io/badge/SonarJS-v3.0.5-303F9F?logo=sonarcloud&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-v30.2.0-C21325?logo=jest&logoColor=white)

## Exports

```ini
# A dynamic NestJS module that allows registering configuration providers at runtime.
- SocketIOModule

# The socket-io service that wraps socket-io
- SocketIOService

# An adapter that reads system environment variables and returns the SocketIOConfig configuration.
- SocketIOAdapter

# The Joi schema used to validate the SocketIOConfig configuration.
- SocketIOConfigSchema
```

## ENVs

```ini
# The port number for the Socket.IO server.
- SOCKET_IO_PORT

# Maximum size of HTTP buffers (in bytes).
- SOCKET_IO_MAX_HTTP_BUFFER_SIZE

# Boolean flag to clean up empty child namespaces automatically.
- SOCKET_IO_CLEANUP_EMPTY_CHILD_NAMESPACES

# Comma-separated list of allowed transport methods (websocket, polling, webtransport).
- SOCKET_IO_TRANSPORTS

# Connection timeout duration in milliseconds.
- SOCKET_IO_CONNECT_TIMEOUT

# Interval for sending ping packets in milliseconds.
- SOCKET_IO_PING_INTERVAL

# Timeout for ping responses in milliseconds.
- SOCKET_IO_PING_TIMEOUT

# Boolean flag to allow Engine.IO v3 clients.
- SOCKET_IO_ALLOW_EIO3

# CORS allowed origin(s). Defaults to '*'.
- SOCKET_IO_CORS_ORIGIN

# Boolean flag to allow credentials in CORS.
- SOCKET_IO_CORS_CREDENTIALS

# Comma-separated list of allowed HTTP methods for CORS.
- SOCKET_IO_CORS_METHODS
```

## PeerDependencies

```ini
- "@ehildt/ckir-helpers": "^0.1.8",
- "@nestjs/common": "^11.1.6",
- "joi": "^18.0.1",
- "socket.io": "^4.8.1"
```
