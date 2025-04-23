<h1 align="center">
ckir.io (seeker.io)
</h1>

<div align="center">

`Your data, your rules..`  
`..private, secure, uncensored, unbiased, and free!`

**ckir.io** is a modular, extensible system designed to redefine how services communicate, process, and distribute content.  
This monorepo unifies core components like persistence, messaging, and vector processing under a single, adaptable framework.

</div>

---

## ✨ Overview

**ckir.io** is more than just a backend system — it is a collection of microservices working in harmony to:

- Dynamically distribute and tailor content
- Provide automation for digital environments (home, labs, business)
- Integrate with various communication protocols and data pipelines
- Serve as a backend foundation for scalable CMS-like and event-driven platforms

It features:

- Real-time responsiveness to external triggers
- A clean separation of concerns by domain-specific services
- A web-based UI to preview and manage content

---

## 📁 Repository Structure

| App Name       | Description                                                    |
|----------------|----------------------------------------------------------------|
| `pst-gateway`  | Persistence layer using MongoDB for storing and retrieving data |
| `vtz-gateway`  | Vectorization service for transforming and embedding data       |
| `msg-gateway`  | Messaging interface layer for ingesting and routing content     |
| `frontend`     | Web UI to preview and trigger content-related workflows         |
| `ms-bridge`    | Middleware for bridging events or data between services         |
| *more coming*  | New services are continuously being added and integrated        |

---

## 🧱 `pst-gateway`

Handles persistence for the entire ckir.io ecosystem.

<!-- insert relevant technology badges here -->

---

## 🧠 `vtz-gateway`

Processes and vectorizes incoming data using embedding models or NLP techniques.

<!-- insert relevant technology badges here -->

---

## 📩 `msg-gateway`

Distributes or ingests messages from various sources (MQTT, REST, Pub/Sub, etc.).

<!-- insert relevant technology badges here -->

---

## 🌐 `frontend`

A web-based user interface to preview, inspect, and trigger workflows across the system.

<!-- insert relevant technology badges here -->

---

## 🔌 `ms-bridge`

Acts as a bridge or connector between services, ensuring seamless integration and message translation.

<!-- insert relevant technology badges here -->

---

## 🛠 Technologies

You can move each badge to the relevant service section above.  
These are the tools and libraries used across the monorepo:

<!-- You will split and assign these badges yourself -->

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJs](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)](https://mosquitto.org/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-blue?style=for-the-badge&logo=apache%20kafka)](https://kafka.apache.org/)
[![BullMQ](https://img.shields.io/badge/bullmq-%233C5280?style=for-the-badge&logo=bullmq&logoColor=white)](https://docs.bullmq.io/)
[![Minio](https://img.shields.io/badge/-MinIO-C72E49?style=for-the-badge&logo=minio&logoColor=white)](https://min.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)](https://swagger.io/)
[![Storybook](https://img.shields.io/badge/storybook-darkblue?style=for-the-badge&logo=storybook)](https://storybook.js.org/)

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
📧 [Email Us](mailto:eugen.hildt@gmail.com)  
📂 [Open an Issue](https://github.com/ehildt/acap/issues)  
📖 [Read the Wiki](https://github.com/ehildt/acap/wiki/ACAP)  
💸 [Donate](https://www.paypal.com/paypalme/@eugenhildt)
