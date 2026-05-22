# Distributed Video Processing Platform

## 🎯 Vision

This project is a **production-grade distributed backend system** that implements the following core concepts within a single, cohesive platform:

- Event-Driven Architecture
- Microservices Design
- Dockerized Deployment
- AWS Cloud Infrastructure
- Asynchronous Communication
- Distributed Workflows
- Resilience Patterns
- Observability & Monitoring

> **This is not a typical CRUD application.** It simulates the backend processing systems used by platforms like **Amazon Prime Video**, **YouTube**, **Netflix**, **Hotstar**, and **Vimeo** — in a simplified yet architecturally accurate form.

---

## 🚀 Project Goal

A user uploads a video, and the system **automatically** orchestrates the following pipeline:

1. Upload the video to cloud storage
2. Persist metadata to the database
3. Publish domain events
4. Transcode the video into multiple resolutions
5. Generate thumbnails
6. Run content moderation
7. Send user notifications
8. Update analytics dashboards
9. Maintain structured logs and distributed traces

The entire workflow is **asynchronous and distributed** across independently deployable services.

---

## 📚 What You Will Learn

### Distributed Systems

- Event-Driven Architecture
- Asynchronous Workflows
- Distributed Transactions
- Eventual Consistency
- Saga Pattern
- CQRS (Command Query Responsibility Segregation)
- Transactional Outbox Pattern
- Retry Mechanisms & Exponential Backoff
- Dead-Letter Queues (DLQ)
- Idempotency
- Correlation IDs & Distributed Tracing

### DevOps & Infrastructure

- Docker & Docker Compose
- Container Networking
- Reverse Proxy (Nginx)
- AWS Deployment (EC2, ECS)
- CI/CD Fundamentals
- Monitoring & Centralized Logging

### Backend Engineering

- Node.js Microservices
- Express.js & TypeScript
- Worker Architecture
- Queue Processing & Message Brokers
- API Gateway Design
- Inter-Service Communication

---

## ☁️ AWS Services Overview

| Service        | Purpose                  |
|----------------|--------------------------|
| EC2            | Initial deployment       |
| ECS            | Container orchestration  |
| S3             | Video object storage     |
| SQS            | Message queue system     |
| EventBridge    | Event bus                |
| Lambda         | Serverless async jobs    |
| CloudWatch     | Logging & monitoring     |
| IAM            | Access control & roles   |
| API Gateway    | Centralized entry point  |
| ECR            | Docker image registry    |

---

## 🏗️ Final Architecture

```
                        Client
                           ↓
                     API Gateway
                           ↓
                  Upload Service
                           ↓
                          S3
                           ↓
                  Event Bus / Queue
                           ↓
 ┌─────────────────────────────────────────────┐
 │                                             │
 ↓                                             ↓
Transcoding Service                   Thumbnail Service
 ↓                                             ↓
Moderation Service                    Subtitle Service
 ↓                                             ↓
Notification Service                  Analytics Service
```

---

## 💡 Why This Project Stands Out

Most backend developers build:

- Simple CRUD APIs
- Tightly coupled services
- Synchronous, monolithic systems

**This project demonstrates:**

- Distributed, loosely coupled architecture
- Asynchronous inter-service communication
- Production-like processing workflows
- Resilience engineering (retries, DLQ, circuit breaking)
- Horizontally scalable processing pipelines

> These are the concepts interviewers look for in **senior and staff-level backend engineering roles**.

---

## 🛠️ Tech Stack

### Backend

| Technology   | Purpose                    |
|--------------|----------------------------|
| Node.js      | Runtime environment        |
| Express.js   | HTTP framework             |
| TypeScript   | Type-safe development      |

### Database

| Technology   | Purpose                    |
|--------------|----------------------------|
| MongoDB      | Primary data store         |
| DynamoDB     | Optional CQRS read model   |
| Redis        | Caching & session store    |

### Messaging

| Technology   | Purpose                    |
|--------------|----------------------------|
| RabbitMQ     | Initial message broker     |
| Kafka        | Production-grade upgrade   |

### Infrastructure

| Technology   | Purpose                    |
|--------------|----------------------------|
| Docker       | Containerization           |
| Docker Compose | Multi-container orchestration |
| Nginx        | Reverse proxy & load balancing |

### Monitoring & Observability

| Technology        | Purpose                    |
|-------------------|----------------------------|
| Winston / Pino    | Structured logging         |
| CloudWatch        | Cloud-native monitoring    |
| Correlation IDs   | Request tracing            |
| Distributed Tracing | End-to-end observability |

### Authentication & Security

| Technology     | Purpose                    |
|----------------|----------------------------|
| JWT            | Token-based authentication |
| API Gateway Auth | Centralized auth layer   |
| Rate Limiting  | Abuse prevention           |

---

## 📁 Project Structure

```
video-platform/
│
├── services/
│   ├── api-gateway/           # Centralized routing & auth
│   ├── upload-service/        # Video upload, S3 multipart/presigned upload, and metadata persistence
│   ├── transcoding-service/   # Video format conversion
│   ├── thumbnail-service/     # Thumbnail generation
│   ├── moderation-service/    # Content moderation
│   ├── notification-service/  # Email & push notifications
│   ├── analytics-service/     # Event analytics & dashboards
│   └── auth-service/          # Authentication & authorization
│
├── shared/
│   ├── logger/                # Centralized logging utilities
│   ├── event-schema/          # Shared event contracts
│   ├── utils/                 # Common utility functions
│   ├── constants/             # Shared constants & enums
│   └── middleware/            # Shared middleware
│
├── infra/
│   ├── docker/                # Dockerfiles per service
│   ├── nginx/                 # Nginx configuration
│   ├── monitoring/            # Monitoring stack configs
│   └── aws/                   # AWS infrastructure (IaC)
│
├── scripts/                   # Build, deploy & utility scripts
├── docs/                      # Architecture & API documentation
├── docker-compose.yml         # Local orchestration
└── README.md                  # Project overview
```

---

## ⚙️ Core Services

### 1. API Gateway

**Responsibilities:**
- Authentication & authorization
- Request routing to downstream services
- Rate limiting & throttling
- Structured request logging
- Request tracing via correlation IDs
- Centralized entry point for all clients

**Future Enhancements:**
- Backend-for-Frontend (BFF) layer
- Response caching
- Response aggregation

---

### 2. Upload Service

**Responsibilities:**
- Receive video upload requests and generate AWS S3 presigned upload URLs
- Persist video metadata to the database
- Support large-file delivery with AWS S3 multipart upload and direct client-to-S3 transfer
- Publish `VIDEO_UPLOADED` domain event

---

### 3. Transcoding Service

**Responsibilities:**
- Consume `VIDEO_UPLOADED` events from the message queue
- Convert videos to multiple resolutions (e.g., 360p, 720p, 1080p)
- Optimize video encoding for streaming
- Publish `VIDEO_TRANSCODED` event upon completion

**Tools:** FFmpeg

---

### 4. Thumbnail Service

**Responsibilities:**
- Consume transcoding events
- Extract and generate video thumbnails
- Publish `THUMBNAIL_GENERATED` event

---

### 5. Moderation Service

**Responsibilities:**
- Perform automated content moderation
- Detect and flag invalid or inappropriate content
- Approve or reject videos based on moderation rules

**Events Published:**
- `VIDEO_APPROVED`
- `VIDEO_REJECTED`

---

### 6. Notification Service

**Responsibilities:**
- Send email notifications to users
- Deliver real-time WebSocket notifications
- Consume relevant workflow events and trigger notifications accordingly

---

### 7. Analytics Service

**Responsibilities:**
- Consume all domain events across services
- Build and maintain read-optimized models
- Process and aggregate analytics data
- Power dashboards and reporting views

> This service demonstrates the **CQRS pattern** by maintaining a separate read model.

---

## 🔄 Event-Driven Workflow

```
VIDEO_UPLOADED
      ↓
VIDEO_TRANSCODING_STARTED
      ↓
VIDEO_TRANSCODED
      ↓
THUMBNAIL_GENERATED
      ↓
VIDEO_MODERATION_COMPLETED
      ↓
VIDEO_PUBLISHED
```

### Why Event-Driven Architecture?

**❌ Anti-Pattern (Synchronous Chaining):**

```
Service A → calls Service B → calls Service C
```

**Problems:**
- Tight coupling between services
- Cascading failures across the chain
- Difficult to scale independently
- Poor observability

**✅ Event-Driven Approach:**

```
Services publish events → Other services react independently
```

**Benefits:**
- Horizontal scalability
- Fault isolation & resilience
- Loose coupling between services
- Asynchronous, non-blocking processing

---

## 🧩 Distributed Systems Concepts Implemented

### 1. Saga Pattern

Orchestrates a distributed transaction across multiple services:

```
Upload Video → Transcode → Moderate → Publish
```

**Compensating Actions (on failure):**
- Delete transcoded assets from storage
- Rollback metadata changes in the database
- Cancel the publish operation

> This simulates distributed transactions without two-phase commit.

---

### 2. CQRS (Command Query Responsibility Segregation)

| Model        | Responsibility                          |
|--------------|------------------------------------------|
| **Write Model** | Upload workflow, metadata updates     |
| **Read Model**  | Analytics, dashboards, reporting views |

---

### 3. Transactional Outbox Pattern

**Problem:**
Database is updated successfully, but the event publish to the message broker fails — resulting in data inconsistency.

**Solution:**
1. Write the event into an `outbox` collection within the same database transaction.
2. A background worker polls the outbox and publishes events reliably.

---

### 4. Idempotency

Duplicate events may arrive due to network retries or broker redelivery (e.g., `VIDEO_TRANSCODED` received twice). The system ensures that **duplicate processing is prevented** using idempotency keys.

---

### 5. Retry with Exponential Backoff

Failed operations are retried with progressively increasing intervals:

| Attempt | Delay   |
|---------|---------|
| 1       | 1 sec   |
| 2       | 2 sec   |
| 3       | 4 sec   |
| 4       | 8 sec   |

---

### 6. Dead-Letter Queue (DLQ)

Events that fail after all retry attempts are routed to a **Dead-Letter Queue** for:

- Manual inspection
- Debugging & root cause analysis
- Event replay after fix deployment

---

### 7. Correlation IDs

Track a single user request as it flows across multiple services:

```
upload-service → transcoding-service → notification-service
```

All log entries share the **same correlation ID**, enabling end-to-end distributed tracing.

---

## 🐳 Docker Architecture

Each microservice runs as an **independent container** following the principle:

> **1 Service = 1 Container**

### Docker Compose

A single command orchestrates the entire stack locally:

```bash
docker-compose up --build
```

**Services started:**
- MongoDB
- RabbitMQ
- All application microservices
- Nginx (reverse proxy)

---

## ☁️ AWS Deployment Strategy

### Phase 1 — EC2 + Docker Compose

A straightforward deployment for learning and initial validation:

```
Client → EC2 Instance → Docker Compose (all services)
```

### Phase 2 — ECS (Production-Grade)

A production-like architecture leveraging managed AWS services:

```
Client → API Gateway → ECS Services → SQS/EventBridge → Workers
```

---

## 🏢 Industry Alignment

Leading technology companies including **Amazon**, **Netflix**, **Uber**, **Flipkart**, **Swiggy**, and **Hotstar** employ:

- Event-driven architecture
- Asynchronous processing pipelines
- Message queues for decoupling
- Containerized deployments
- Centralized observability platforms
- API gateways for traffic management
- Distributed workflow orchestration

> **This project follows the same architectural principles in a simplified, educational form.**

---

## 📖 Recommended References

### Architecture Repositories

| Resource | Description |
|----------|-------------|
| [node-microservices-kafka-postgres](https://github.com/) | Reference for service structure, Docker Compose setup, Kafka communication, and microservice separation |

### Learning Resources

| Topic | Resource |
|-------|----------|
| Event-Driven Microservices | [Microservices.io](https://microservices.io/) |
| Docker | [Docker Official Docs](https://docs.docker.com/) |
| AWS | [AWS Documentation](https://docs.aws.amazon.com/) |
| RabbitMQ | [RabbitMQ Docs](https://www.rabbitmq.com/documentation.html) |
| Kafka | [Apache Kafka Docs](https://kafka.apache.org/documentation/) |
| API Gateway | [KrakenD API Gateway](https://www.krakend.io/) |
| Workflow Orchestration | [Netflix Conductor](https://conductor.netflix.com/) |

---

## 📅 2-Week Implementation Roadmap

### Week 1 — Build Core Services

| Day | Focus Area | Deliverables |
|-----|-----------|--------------|
| **Day 1** | Linux & Docker Fundamentals | Containers, images, networking; Run Node.js + MongoDB in Docker |
| **Day 2** | Message Brokers (RabbitMQ) | Producers, consumers, queues, exchanges; Build a simple event publisher |
| **Day 3** | Upload Service | Upload API, S3 integration, metadata persistence, `VIDEO_UPLOADED` event |
| **Day 4** | Transcoding Service | Event consumers, worker architecture, FFmpeg basics |
| **Day 5** | Thumbnail Service | Event-driven thumbnail generation pipeline |
| **Day 6** | Notification Service | Retry logic, async communication patterns, DLQ handling |
| **Day 7** | Docker Compose Integration | Orchestrate the full architecture locally with a single command |

### Week 2 — Implement Advanced Patterns

| Day | Focus Area | Deliverables |
|-----|-----------|--------------|
| **Day 8** | Saga Pattern | Distributed workflow handling with compensating transactions |
| **Day 9** | Transactional Outbox | Reliable event publishing with outbox collection + background worker |
| **Day 10** | Idempotency | Duplicate event detection and prevention mechanisms |
| **Day 11** | Retry & DLQ | Retry queues, exponential backoff, dead-letter queue processing |
| **Day 12** | API Gateway | Authentication, rate limiting, request tracing |
| **Day 13** | AWS Deployment | Deploy to EC2, ECS, S3, CloudWatch |
| **Day 14** | Observability | Structured logging, distributed tracing, monitoring dashboards |

---

## 📂 Recommended GitHub Structure

### Monorepo Approach

```
video-platform/
├── services/
├── shared/
├── infra/
├── docs/
└── scripts/
```

**Why Monorepo?**

- Simplified dependency sharing across services
- Centralized configuration management
- Faster local development iteration
- Streamlined Docker build process
- Cleaner CI/CD pipeline configuration

> Many modern engineering organizations (Google, Meta, Uber) adopt monorepo strategies for microservice projects.

---

## 🎯 Core Engineering Principles

### 1. Loose Coupling

Services communicate exclusively via events. Direct synchronous dependency chains are avoided to ensure independent deployability and scalability.

### 2. Failure Isolation

A failure in one service must **not** cascade to other services. Each service is designed to degrade gracefully and recover independently.

### 3. Horizontal Scalability

Resource-intensive services (e.g., transcoding workers) can be **scaled independently** based on demand, without affecting other parts of the system.

---

> **Built with a focus on real-world distributed systems engineering.**