<h1 align="center">
ckir.io (seeker.io)
</h1>

<div align="center">

`Your data, your rules..`  
`..private, secure, uncensored, unbiased, and free!`

**ckir.io** is a modular, extensible framework for message and event distribution. It’s structured around the core entities *Topic*, *Thread*, and *Post*, inspired by conversational AI systems like ChatGPT but designed for broader use cases. Each entity can operate independently or together, serving as *categories*, *subcategories*, and *content* in hierarchical data models—flexible building blocks that can stand alone or combine to create structured, powerful communication flows. It is designed as a **core communication and automation system**, enabling flexible, real-time interaction between services, users, and applications. With its adaptive design, **ckir.io** ensures that each connected entity receives the right content at the right time, maintaining fluid synchronization across all components.

`Currently, ckir.io only supports NVIDIA GPUs on Windows with WSL2. Using AMD or Intel GPUs in this setup will break GPU support, requiring either running the services outside WSL or manually adjusting compose.yml for Windows + WSL2.`

</div>
<br>

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
   # read the COMPOSE.md in the root project
   # read the README.md files in /apps/*
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
