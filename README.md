<h1 align="center">
ckir.io (seeker.io)
</h1>

<div align="center">

`Your data, your rules..`  
`..private, secure, uncensored, unbiased, and free!`

**ckir.io** is a modular, extensible framework for message and event distribution. It’s structured around the core entities *Topic*, *Thread*, and *Post*, inspired by conversational AI systems like ChatGPT but designed for broader use cases. Each entity can operate independently or together, serving as *categories*, *subcategories*, and *content* in hierarchical data models—flexible building blocks that can stand alone or combine to create structured, powerful communication flows.

</div>

---

## ✨ Overview

**ckir.io** is designed as a **core communication and automation system**, enabling flexible, real-time interaction between services, users, and applications. With its adaptive design, **ckir.io** ensures that each connected entity receives the right content at the right time, maintaining fluid synchronization across all components.

```ini
Note: All CKIR.IO microservices that perform inference, vectorization, or text extraction (e.g., VECTORS, VISIONS) can be configured to use different AI models. Models can either be selected from those available on Ollama, or the user can convert a model to the GUFF format for use with the service.
```


> **@CKIR.IO/TOPICS** is a modular microservice for real-time topic management. It emits topics to clients via Socket.IO and uses BullMQ to store data asynchronously with automatic retries. Each topic is tracked with metadata including participants, activity timestamps, thread counts, and tags, and operational modes allow flexible control over topic behavior. The service provides a robust, extensible foundation for managing topics in real-time workflows.

> **@CKIR.IO/THREADS** is a modular microservice for real-time thread management. It emits threads to clients via Socket.IO and uses BullMQ to store data asynchronously with automatic retries. Each thread is associated with a topic and tracked with metadata including participants, replies, activity timestamps, and tags. Operational modes allow flexible control over thread behavior, providing a robust, extensible foundation for managing threads in real-time workflows.

> **@CKIR.IO/POSTS** is a modular microservice for real-time post management. It emits posts to clients via Socket.IO and uses BullMQ to store data asynchronously with automatic retries. Each post is associated with a topic and thread and tracked with metadata including text content, recipients, emojis, flags, attachments, and operational modes. The service provides a robust, extensible foundation for managing posts in real-time workflows.

> **@CKIR.IO/SNAPS** is a microservice for temporarily storing and managing topics, threads, and posts. It handles real-time emission to clients via Socket.IO and supports queuing for persistence using BullMQ. Each entity—topic, thread, or post—is tracked with relevant metadata such as participants, replies, activity timestamps, tags, and operational modes. The service provides a robust, extensible foundation for managing and distributing content in real-time workflows.

> **@CKIR.IO/VECTORS** is a microservice for encoding messages and content into vector representations and performing similarity searches. It supports creating vector collections with configurable dimensions and distance metrics, generating embeddings from text inputs, and retrieving relevant content based on similarity using Qdrant. The service allows searching by text or by precomputed embeddings, with support for filtering by content type (topic, thread, post, image) and controlling result limits, offsets, and minimum similarity scores. It provides a scalable foundation for semantic search and content retrieval workflows.

> **@CKIR.IO/VISIONS** is a microservice for processing and describing images and documents. It allows uploading one or more images (PNG, JPG, JPEG, WEBP) and supports optional AI-driven descriptions, vectorization, text extraction via OCR, and focused analysis on the main subject. Responses can be streamed, and the service provides a robust foundation for image understanding, indexing, and content retrieval workflows.

---

### 🔮 Future Development

- **Dashboard (in progress):** Will be built using **Vue.js**, **TypeScript**, **Node.js**, and **Vite**  
- **Planned Features:** Model Context Protocol (MCP), model fine-tuning, and **RAG (already available)**  
- **GitHub:** [ehildt/ckir.io](https://github.com/ehildt/ckir.io)

---

## 🚀 Kickoff

Follow these simple steps to get started with **ckir.io** using **pnpm** and **docker compose**:

1. **Clone the monorepo**
   ```bash
   git clone https://github.com/ehildt/ckir.io.git
   cd ckir.io
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   This installs all dependencies across the monorepo.

3. **Start with Docker**
   ```bash
   docker compose up
   ```
   This pulls mandatory images and builds all services on initial startup.

4. **Setup Qdrant Collection**
   - Navigate to `http://localhost:3004/api-docs` (vectors service).  
   - Create a collection named **ckir** 
   (currently hardcoded in the monorepo and needs to be created in qdrant as well - use swagger for it).  
   - Set **vectorSize** to `1024` and `cosine`. 

5. **Install LLMs using Ollama**
   ```bash
   # ollama container must be running
   docker exec -it ollama sh

   # list installed LLMs
   ollama list

   # install LLM
   ollama pull <model-name>

   # exit ollama docker container
   exit
   ``` 

6. **Test Data Flow**
   - Visit `localhost:3000–3002/api-docs` to create a payload.  
   - Payloads are streamed across services via **BullMQ** and **Socket.IO**.  

7. **Perform Similarity Search**
   - Back in `localhost:3004/api-docs`, run a search using an embedding or plain text.  
   - No progressive/dynamic recall is implemented in the backend—adjust the threshold manually.

8. **Test the Visions model**
   - Visit `http://localhost:3005/api-docs` and upload an image or two

## TODO

1. **Chats**
    - Progressive recall and context aggregation will be part of the upcoming **chats** interface.  
    - Integration with **LangChain** is being explored, but a custom context-aggregation system is planned for smoother contextual recall.

2. **Routing**
    - **Caddy** or **Traefik** will be introduced later for simplified routing and service discovery.

---


## 📈 Project Status

![BuildStatus](https://img.shields.io/badge/build-passing-darkgreen?style=flat&logo=github&logoColor=white)
![Branch](https://img.shields.io/badge/branch-main-blue?style=flat&logo=git&logoColor=white)  
[![codecov](https://codecov.io/gh/ehildt/acap/graph/badge.svg?token=MCL18OCNV7)](https://app.codecov.io/gh/ehildt/acap)
[![changesets](https://img.shields.io/badge/Changeset-SemVer-green)](https://github.com/changesets/changesets)

---

## 🐋 Docker Images

![Docker](https://img.shields.io/docker/pulls/ehildt/acap?color=darkgreen&label=docker&logo=docker)

---

## 📬 Contact & Contribution

Have questions or want to contribute? We welcome you!

```md
📧 [Email Me](mailto:eugen.hildt@gmail.com)  
```
