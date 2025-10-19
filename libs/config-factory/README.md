`@ckir.io/ckir-config-factory` is a dynamic module that simplifies configurations. It is used across services and libraries in the ckir.io monorepo.

![Version](https://img.shields.io/badge/Version-0.1.1-blue) ![NestJS](https://img.shields.io/badge/NestJS-v11.1.6-E0234E?logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue) ![ESLint](https://img.shields.io/badge/ESLint-v9.38.0-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-v3.6.2-F7B93E?logo=prettier&logoColor=white) ![SonarJS](https://img.shields.io/badge/SonarJS-v3.0.5-303F9F?logo=sonarcloud&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-v30.2.0-C21325?logo=jest&logoColor=white) ![Joi](https://img.shields.io/badge/Joi-v18.0.1-5A29E4?logo=joi&logoColor=white) ![ckir-helpers](https://img.shields.io/badge/@ehildt/ckir--helpers-v0.1.6-blue)

## Exports

```ini
# A dynamic NestJS module that allows you to register configuration providers at runtime.
- ConfigFactoryModule

# Method Decorator that caches the return value of a method or a getter property.
# Optionally validates the cached value against a Joi schema.
- CacheReturnValue

# Method Decorator that validates the return value of a getter or method with a Joi schema.
- ValidateReturnValue
```

## PeerDependencies

```ini
  - "@nestjs/common": "^11.1.6",
  - "@ehildt/ckir-helpers": "^0.1.6",
  - "joi": "^18.0.1"
```
