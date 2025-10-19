`@ehildt/ckir-ollama` wraps Ollama and is used across services and libraries in the ckir.io monorepo.

![Version](https://img.shields.io/badge/Version-0.1.1-blue) ![NestJS](https://img.shields.io/badge/NestJS-v11.1.6-E0234E?logo=nestjs&logoColor=white) ![Ollama](https://img.shields.io/badge/Ollama-0.6.0-00AACC?logo=ollama&logoColor=white) ![Joi](https://img.shields.io/badge/Joi-v18.0.1-5A29E4?logo=joi&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue) ![ESLint](https://img.shields.io/badge/ESLint-v9.38.0-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-v3.6.2-F7B93E?logo=prettier&logoColor=white) ![SonarJS](https://img.shields.io/badge/SonarJS-v3.0.5-303F9F?logo=sonarcloud&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-v30.2.0-C21325?logo=jest&logoColor=white)

## Exports

```ini
# A dynamic NestJS module that allows registering configuration providers at runtime.
- OllamaModule

# The ollama service that wraps ollama
- OllamaService

# An adapter that reads system environment variables and returns the XOllamaConfig configuration.
- XOllamaConfigAdapter

# The Joi schema used to validate the XOllamaConfig configuration.
- XOllamaConfigSchema
```

## ENVs

```ini
# Defines the keep-alive duration or toggle for Ollama sessions.
- OLLAMA_KEEP_ALIVE

# Specifies the Ollama server host or endpoint (e.g., http://localhost:11434).
- OLLAMA_HOST

# Boolean flag controlling streaming mode for Ollama responses.
- OLLAMA_X_STREAM

# Name or ID of the default inference model to use.
- OLLAMA_X_INFERENCE_MODEL

# Name or ID of the text embedding model.
- OLLAMA_X_TEXT_EMBEDDING_MODEL

# Name or ID of the vision model for multimodal tasks.
- OLLAMA_X_VISION_MODEL
```

## PeerDependencies

```ini
- "@ehildt/ckir-helpers": "^0.1.8",
- "@nestjs/common": "^11.1.6",
- "joi": "^18.0.1"
```
