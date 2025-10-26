# Docker Compose

Create a compose.yml in the project with the following content:

```yml
services:  

  topics:
    container_name: topics
    restart: on-failure
    build:
      context: ./apps/topics
      target: local
    volumes:
      - ./apps/topics:/app
      - ./node_modules:/node_modules:ro
      - ./libs:/libs:ro
      - ./dist:/dist:ro
    depends_on:
      - keydb
    env_file:
      - ./apps/topics/.env
    environment:
      - NODE_ENV=local
      - PRINT_CONFIG=false
      - ENABLE_SWAGGER=true
    ports:
      - 3000:3000
      - 4000:4000
    networks:
      - ckir-network

  threads:
    container_name: threads
    restart: on-failure
    build:
      context: ./apps/threads
      target: local
    volumes:
      - ./apps/threads:/app
      - ./node_modules:/node_modules:ro
      - ./libs:/libs:ro
      - ./dist:/dist:ro
    depends_on:
      - keydb
    env_file:
      - ./apps/threads/.env
    environment:
      - NODE_ENV=local
      - PRINT_CONFIG=false
      - ENABLE_SWAGGER=true
    ports:
      - 3001:3001
      - 4001:4000
    networks:
      - ckir-network

  posts:
    container_name: posts
    restart: on-failure
    build:
      context: ./apps/posts
      target: local
    volumes:
      - ./apps/posts:/app
      - ./node_modules:/node_modules:ro
      - ./libs:/libs:ro
      - ./dist:/dist:ro
    depends_on:
      - keydb
    env_file:
      - ./apps/posts/.env
    environment:
      - NODE_ENV=local
      - PRINT_CONFIG=false
      - ENABLE_SWAGGER=true
    ports:
      - 3002:3002
      - 4002:4000
    networks:
      - ckir-network

  snaps:
    container_name: snaps
    restart: on-failure
    build:
      context: ./apps/snaps
      target: local
    volumes:
      - ./apps/snaps:/app
      - ./node_modules:/node_modules:ro
      - ./libs:/libs:ro
      - ./dist:/dist:ro
    depends_on:
      - keydb
      - mongo
    env_file:
      - ./apps/snaps/.env
    environment:
      - NODE_ENV=local
      - PRINT_CONFIG=false
      - ENABLE_SWAGGER=true
    ports:
      - 3003:3003
    networks:
      - ckir-network

  vectors:
    container_name: vectors
    restart: on-failure
    build:
      context: ./apps/vectors
      target: local
    volumes:
      - ./apps/vectors:/app
      - ./node_modules:/node_modules:ro
      - ./libs:/libs:ro
      - ./dist:/dist:ro
    depends_on:
      - qdrant
      - keydb
    env_file:
      - ./apps/vectors/.env
    environment:
      - NODE_ENV=local
      - PRINT_CONFIG=false
      - ENABLE_SWAGGER=true
    ports:
      - 3004:3004
    networks:
      - ckir-network

  visions:
    container_name: visions
    restart: on-failure
    build:
      context: ./apps/visions
      target: local
    volumes:
      - ./apps/visions:/app
      - ./node_modules:/node_modules:ro
      - ./libs:/libs:ro
      - ./dist:/dist:ro
    depends_on:
      - qdrant
      - keydb
    env_file:
      - ./apps/visions/.env
    environment:
      - NODE_ENV=local
      - PRINT_CONFIG=false
      - ENABLE_SWAGGER=true
    ports:
      - 3005:3005
    networks:
      - ckir-network

  mongo:
    image: mongo:latest
    container_name: mongo
    ports:
      - 27017:27017
    command: mongod --replSet rs0 --bind_ip_all --quiet --logpath /dev/null
    volumes:
      - mongo_data:/data/db
    networks:
      - ckir-network
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 3s
      retries: 20

  init_mongo_cluster:
    image: mongo:latest
    container_name: init_mongo_cluster
    depends_on:
      mongo:
        condition: service_healthy
    volumes:
      - ./rs.initiate.js:/scripts/rs.initiate.js
    entrypoint: ["mongosh", "--host", "mongo:27017", "/scripts/rs.initiate.js"]
    networks:
      - ckir-network
    restart: "on-failure"

  qdrant:
    image: qdrant/qdrant
    container_name: qdrant
    environment:
      QDRANT__CLUSTER__ENABLED: "true"
      QDRANT__CLUSTER__P2P__PORT: "6335"
      QDRANT__CLUSTER__P2P__FORCE_NODE_NAME: "node-1"
      QDRANT__CLUSTER__P2P__CONTACTS: "qdrant:6335"
      QDRANT_API_KEY: e4f2c7d19a4b3f1285e7c93d6ac8f01a # example api-key
    volumes:
      - qdrant_data:/qdrant/storage
    ports:
      - 6333:6333
    restart: unless-stopped
    command: ["./qdrant", "--uri", "http://qdrant:6335"]
    networks:
      - ckir-network

  ollama:
    networks:
      - ckir-network
    volumes:
      - ./.ollama:/root/.ollama
    container_name: ollama
    tty: true
    restart: unless-stopped
    runtime: nvidia
    image: ollama/ollama:latest
    ports:
      - 11434:11434
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  keydb:
    image: eqalpha/keydb
    container_name: keydb
    restart: on-failure
    ports:
      - 6379:6379
    volumes:
      - keydb_data:/data
      - ./keydb.conf:/usr/local/etc/keydb/keydb.conf
    command: keydb-server /usr/local/etc/keydb/keydb.conf
    networks:
      - ckir-network

volumes:
  ollama:
  keydb_data:
  mongo_data:
  qdrant_data:
  redis_insight:

networks:
  ckir-network:
    name: ckir-network
    driver: bridge
```