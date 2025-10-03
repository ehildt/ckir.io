<h1 align="center">
ckir.io (seeker.io)
</h1>

<div align="center">

`Your data, your rules..`  
`..private, secure, uncensored, unbiased, and free!`

**ckir.io** is a modular, extensible framework for distributing and consuming messages and events.  
It’s built around the concepts of **topics**, **threads**, and **posts**, inspired by conversational AI tools like ChatGPT — but not limited to the chat paradigm.

</div>

---

## ✨ Overview

**ckir.io** is designed as a **core communication and automation system**, enabling flexible, real-time interaction between services, users, and applications.  

While it resembles a chat-based structure, it provides an **unopinionated framework** adaptable to any form of communication or data exchange.  
Its architecture ensures dynamic content distribution, intelligent event routing, and responsive automation across environments such as home, business, or research systems.

It’s built to:

- Distribute and tailor content dynamically  
- Handle real-time messages, posts, and events  
- Enable modular automation across digital systems  
- Integrate seamlessly with protocols and data pipelines  
- Serve as a foundation for scalable, event-driven, and CMS-like platforms  

With its adaptive design, **ckir.io** ensures that each connected entity receives the right content at the right time, maintaining fluid synchronization across all components.

---

### 🔮 Future Development

- **Dashboard (in progress):** Will be built using **Vue.js**, **TypeScript**, **Node.js**, and **Vite**  
- **Planned Features:** Model Context Protocol (MCP), model fine-tuning, and **RAG (already available)**  
- **GitHub:** [ehildt/ckir.io](https://github.com/ehildt/ckir.io)

---

## 🚀 Kickoff

Follow these simple steps to get started with **ckir.io** using **pnpm** and **Docker**:

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

3. **Build libraries**
   ```bash
   pnpm -r build:lib
   ```
   Builds all required internal libraries.

4. **Start with Docker**
   ```bash
   docker compose up
   ```
   This pulls mandatory images and builds all services on initial startup.

5. **Hot Reloading**
   - Changing a library requires rebuilding that particular lib.  
   - **NestJS** and **Docker Compose** will automatically stream updates for immediate availability.

6. **Setup Qdrant Collection**
   - Navigate to `localhost:3004` (vectors service).  
   - Create a collection named **ckir** (currently hardcoded in monorepo, but still needs to created in qdrant - use swagger for it).  
   - Set **embedding size** to `1024` and `cosine`. 

7. **RAG Implementation**
   - Found in the **vectors** microservice (./apps/vectors).  

8. **Test Data Flow**
   - Visit `localhost:3000–3002` to create a payload.  
   - Payloads are streamed across services via **BullMQ**, **Socket.IO**, and **ioredis**.  

9. **Perform Similarity Search**
   - Back in `localhost:3004`, run a search using an embedding or plain text.  
   - No progressive/dynamic recall is implemented yet—adjust the threshold manually for better results.

10. **Upcoming Enhancements**
    - Progressive recall and context aggregation will be part of the upcoming **chat interface**.  
    - Integration with **LangChain** is being explored, but a custom context-aggregation system is planned for smoother contextual recall.

11. **Routing**
    - **Caddy** or **Traefik** will be introduced later for simplified routing and service discovery.

---

## 📁 Repository Structure

| App Name       | Description                                                    |
|----------------|----------------------------------------------------------------|
| `snaps`  | Persistence layer using MongoDB for storing and retrieving data |
| `vectors`  | Vectorization service for transforming and embedding data       |
| `topics, threads, posts`  | Messaging interface layer for ingesting and routing content     |
| *more coming*  | New services are continuously being added and integrated        |

---

## 🧱 `snaps`

Handles persistence for the entire ckir.io ecosystem.  
Built with:

---

## 🧠 `vectors`

Processes and vectorizes incoming data using embedding models or NLP techniques.  

---

## 📩 `topics, threads, posts`

Distributes or ingests messages from various sources (bullMQ, REST, ioredis, SocketIO, etc.).  

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
