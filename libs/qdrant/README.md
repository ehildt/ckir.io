`@ehildt/ckir-qdrant` wraps Qdrant and is used across services and libraries in the ckir.io monorepo.

![Version](https://img.shields.io/badge/Version-0.1.1-blue) ![NestJS](https://img.shields.io/badge/NestJS-v11.1.6-E0234E?logo=nestjs&logoColor=white) ![Ollama](https://img.shields.io/badge/Ollama-0.6.0-00AACC?logo=ollama&logoColor=white) ![Qdrant](https://img.shields.io/badge/Qdrant-1.15.1-00AACC?logo=Qdrant&logoColor=white) ![Joi](https://img.shields.io/badge/Joi-v18.0.1-5A29E4?logo=joi&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue) ![ESLint](https://img.shields.io/badge/ESLint-v9.38.0-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-v3.6.2-F7B93E?logo=prettier&logoColor=white) ![SonarJS](https://img.shields.io/badge/SonarJS-v3.0.5-303F9F?logo=sonarcloud&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-v30.2.0-C21325?logo=jest&logoColor=white)

## Exports

```ini
# A dynamic NestJS module that allows registering configuration providers at runtime.
- QdrantModule

# The qdrant service that wraps qdrant
- QdrantService

# An adapter that reads system environment variables and returns the QdrantClientParams configuration.
- QdrantConfigAdapter

# The Joi schema used to validate the QdrantClientParams configuration.
- QdrantClientConfigSchema
```

## ENVs

These system variables are required, while others are optional and can be configured freely when registering the QdrantModule.

```ini
# The URL of the Qdrant server or cluster.
- QDRANT_URL

# API key for authenticating requests to Qdrant.
- QDRANT_API_KEY

# Boolean flag to enable or disable compatibility checks when connecting to Qdrant.
- QDRANT_CHECK_COMPATIBILITY
```

## PeerDependencies

```ini
- "@ehildt/ckir-helpers": "^0.1.8",
- "@nestjs/common": "^11.1.6",
- "joi": "^18.0.1",
- "ollama": "^0.6.0"
```
