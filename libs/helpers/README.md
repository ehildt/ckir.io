The `@ehildt/ckir-helpers` library contains reusable utility functions that support multiple services and libraries in the `ckir.io` monorepo.


![Version](https://img.shields.io/badge/Version-0.1.6-blue) ![NestJS](https://img.shields.io/badge/NestJS-v11.1.6-E0234E?logo=nestjs&logoColor=white) ![Joi](https://img.shields.io/badge/Joi-v18.0.1-5A29E4?logo=joi&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue) ![ESLint](https://img.shields.io/badge/ESLint-v9.38.0-4B32C3?logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-v3.6.2-F7B93E?logo=prettier&logoColor=white) ![SonarJS](https://img.shields.io/badge/SonarJS-v3.0.5-303F9F?logo=sonarcloud&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-v30.2.0-C21325?logo=jest&logoColor=white)


## Optional ENVS

```ini
# logConfigObject
# a function used in main.ts
# IF APP_CONFIG SHOULD BE PRINTED
PRINT_CONFIG=true           

# a constant used in main.ts
# THE REQUEST BODY LIMIT; DEFAULTS TO 16MB
BODY_LIMIT=104857600        
```

## PeerDependencies
```ini
  - "@nestjs/common": "^11.1.6",
  - "@nestjs/swagger": "^11.2.0",
  - "joi": "^18.0.1"
```