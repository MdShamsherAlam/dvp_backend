# 🤖 AI Context File — Distributed Video Processing (DVP) Backend

> This file gives full project context to the AI assistant at the start of every session.
> Read this file carefully before making any suggestions or writing any code.

---

## 📌 Project Identity

| Field         | Value                                              |
|---------------|----------------------------------------------------|
| **Project**   | Distributed Video Processing Platform (DVP)        |
| **Repo Name** | `dvp_backend`                                      |
| **Owner**     | Shamsher (Md Shamsher Alam)                        |
| **Goal**      | Production-grade distributed backend system        |
| **Stage**     | 🟡 In Progress — Folder structure created, building services |
| **Workspace** | `c:\shamsher\dvp_backend`                          |

---

## 🎯 Project Vision

This is **not a CRUD app**. It simulates the backend video processing pipelines used by platforms like:

- Amazon Prime Video
- YouTube
- Netflix
- Hotstar
- Vimeo

The system receives a video upload and orchestrates a fully **asynchronous, event-driven distributed workflow** across multiple independent microservices.

---

## 🛠️ Tech Stack

### Backend
| Technology   | Purpose                        |
|--------------|--------------------------------|
| Node.js      | Runtime                        |
| TypeScript   | Type-safe development          |
| Express.js   | HTTP framework per service     |

### Database
| Technology   | Purpose                        |
|--------------|--------------------------------|
| MongoDB      | Primary data store             |
| DynamoDB     | Optional CQRS read model       |
| Redis        | Caching & idempotency keys     |

### Messaging / Event Bus
| Technology   | Purpose                                      |
|--------------|----------------------------------------------|
| RabbitMQ     | Starting message broker (local dev)          |
| Kafka        | Future upgrade for production scale          |

### Infrastructure
| Technology      | Purpose                        |
|-----------------|--------------------------------|
| Docker          | Containerization               |
| Docker Compose  | Local multi-service orchestration |
| Nginx           | Reverse proxy                  |

### Cloud (AWS)
| Service       | Purpose                        |
|---------------|--------------------------------|
| S3            | Video file storage             |
| SQS           | Managed queue                  |
| EventBridge   | Event bus                      |
| ECS           | Container orchestration        |
| EC2           | Initial deployment             |
| Lambda        | Serverless async jobs          |
| CloudWatch    | Logs & monitoring              |
| API Gateway   | Entry point                    |
| ECR           | Docker image registry          |
| IAM           | Access control                 |

### Observability
| Tool              | Purpose                        |
|-------------------|--------------------------------|
| Winston / Pino    | Structured logging             |
| Correlation IDs   | Request tracing across services |
| CloudWatch        | Cloud monitoring               |

### Auth
| Tool           | Purpose                        |
|----------------|--------------------------------|
| JWT            | Token-based auth               |
| Rate Limiting  | Abuse prevention               |

---

## 📁 Project Folder Structure

```
dvp_backend/
│
├── services/
│   ├── api-gateway/           # Centralized routing, auth, rate limiting
│   ├── upload-service/        # Issues S3 upload URLs / multipart upload, persists metadata, publishes event
│   ├── transcoding-service/   # Converts video to multiple resolutions (FFmpeg)
│   ├── thumbnail-service/     # Generates thumbnails from video
│   ├── moderation-service/    # Detects & flags inappropriate content
│   ├── notification-service/  # Sends emails & WebSocket notifications
│   ├── analytics-service/     # Consumes events, builds read models (CQRS)
│   └── auth-service/          # JWT auth, user management
│
├── shared/
│   ├── logger/                # Centralized Winston/Pino logger setup
│   ├── event-schema/          # Shared TypeScript event types/contracts
│   ├── utils/                 # Common helper functions
│   ├── constants/             # Shared enums, constants
│   └── middleware/            # Shared Express middleware (auth, tracing, etc.)
│
├── infra/
│   ├── docker/                # Per-service Dockerfiles
│   ├── nginx/                 # Nginx reverse proxy config
│   ├── monitoring/            # Prometheus / Grafana / CloudWatch configs
│   └── aws/                   # IaC scripts (CloudFormation / CDK)
│
├── scripts/                   # Build, seed, deploy scripts
├── docs/                      # Architecture diagrams, API docs
├── docker-compose.yml         # Full local stack orchestration
├── CLAUDE.md                  # ← This file (AI context)
├── project.md                 # Detailed project documentation
└── README.md                  # Public-facing project overview
```

---

## ⚙️ Core Services — Responsibilities

### 1. `api-gateway`
- Single entry point for all clients
- Authentication via JWT
- Request routing to downstream services
- Rate limiting
- Correlation ID injection for tracing

### 2. `upload-service`
- Accepts video upload requests and issues AWS S3 presigned/multipart upload URLs for large files
- Saves metadata to MongoDB
- Handles S3 object persistence using direct client-to-S3 transfer for robustness
- Publishes `VIDEO_UPLOADED` event to RabbitMQ/Kafka

### 3. `transcoding-service`
- Consumes `VIDEO_UPLOADED` event
- Uses **FFmpeg** to convert video → 360p, 720p, 1080p
- Publishes `VIDEO_TRANSCODED` event

### 4. `thumbnail-service`
- Consumes transcoding events
- Extracts frames and generates thumbnails
- Publishes `THUMBNAIL_GENERATED` event

### 5. `moderation-service`
- Performs automated content moderation
- Publishes `VIDEO_APPROVED` or `VIDEO_REJECTED`

### 6. `notification-service`
- Consumes workflow events
- Sends emails and WebSocket notifications to users

### 7. `analytics-service`
- Consumes ALL domain events
- Maintains a separate read model (CQRS pattern)
- Powers dashboards and reports

### 8. `auth-service`
- User registration & login
- JWT issuance & refresh
- Role-based access control (RBAC)

---

## 🔄 Event Flow

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
VIDEO_APPROVED / VIDEO_REJECTED
      ↓
VIDEO_PUBLISHED / VIDEO_DELETED
```

---

## 🧩 Distributed Systems Patterns Implemented

| Pattern                      | Status        | Where                        |
|------------------------------|---------------|------------------------------|
| Saga Pattern                 | 🔲 Planned    | Across upload → moderation   |
| CQRS                         | 🔲 Planned    | `analytics-service`          |
| Transactional Outbox         | 🔲 Planned    | `upload-service`             |
| Idempotency                  | 🔲 Planned    | All event consumers          |
| Retry + Exponential Backoff  | 🔲 Planned    | All services                 |
| Dead-Letter Queue (DLQ)      | 🔲 Planned    | RabbitMQ / SQS               |
| Correlation IDs              | 🔲 Planned    | `shared/middleware`          |
| Distributed Tracing          | 🔲 Planned    | All services                 |

---

## 📅 Build Roadmap

### Week 1
| Day | Task                                       | Status     |
|-----|--------------------------------------------|------------|
| 1   | Docker + Linux basics, Node+Mongo container | 🔲 Pending |
| 2   | RabbitMQ setup, simple event publisher      | 🔲 Pending |
| 3   | `upload-service` (API + S3 + event)         | 🔲 Pending |
| 4   | `transcoding-service` (FFmpeg + worker)     | 🔲 Pending |
| 5   | `thumbnail-service`                         | 🔲 Pending |
| 6   | `notification-service` (retries + DLQ)      | 🔲 Pending |
| 7   | Docker Compose — full stack locally         | 🔲 Pending |

### Week 2
| Day | Task                                       | Status     |
|-----|--------------------------------------------|------------|
| 8   | Saga Pattern implementation                 | 🔲 Pending |
| 9   | Transactional Outbox Pattern                | 🔲 Pending |
| 10  | Idempotency handling                        | 🔲 Pending |
| 11  | Retry queues + DLQ                          | 🔲 Pending |
| 12  | API Gateway (auth + rate limiting + tracing)| 🔲 Pending |
| 13  | AWS Deployment (EC2 → ECS)                  | 🔲 Pending |
| 14  | Observability (logging + tracing + dashboards) | 🔲 Pending |

---

## 📐 Coding Conventions

### Service Structure (each microservice)
```
service-name/
├── src/
│   ├── config/         # DB, env, broker config
│   ├── controllers/    # Route handlers
│   ├── services/       # Business logic
│   ├── repositories/   # DB access layer
│   ├── events/         # Event publishers & consumers
│   ├── middleware/     # Service-specific middleware
│   ├── routes/         # Express route definitions
│   └── index.ts        # Entry point
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Naming Conventions
- **Events**: `SCREAMING_SNAKE_CASE` (e.g., `VIDEO_UPLOADED`)
- **Files**: `kebab-case` (e.g., `upload-service.ts`)
- **Classes/Interfaces**: `PascalCase`
- **Variables/Functions**: `camelCase`
- **Env variables**: `UPPER_SNAKE_CASE`

### Event Schema Convention
All events must follow this structure:
```typescript
{
  eventId: string;       // UUID - for idempotency
  eventType: string;     // e.g., "VIDEO_UPLOADED"
  correlationId: string; // Traces the full request chain
  timestamp: string;     // ISO 8601
  payload: object;       // Event-specific data
}
```

---

## 🌍 Environment Variables Pattern

Each service uses a `.env` file:
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/dvp
RABBITMQ_URL=amqp://localhost:5672
AWS_REGION=ap-south-1
AWS_REGION=ap-south-1
AWS_S3_BUCKET=dvp-videos
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
JWT_SECRET=your_secret_here
```

---

## 🐳 Docker Compose Services (Planned)

```yaml
services:
  mongodb:        # port 27017
  mongo-express:  # port 8081 (Web UI)
  rabbitmq:       # port 5672, management UI 15672
  redis:          # port 6379
  nginx:          # port 80
  api-gateway:    # port 3000
  upload-service: # port 3001
  transcoding-service: # port 3002
  thumbnail-service:   # port 3003
  moderation-service:  # port 3004
  notification-service: # port 3005
  analytics-service:   # port 3006
  auth-service:        # port 3007
```

---

## ⚠️ Important Notes for AI

1. **Always use typescript** `
2. **Event-driven first** — services communicate via events, NOT direct HTTP calls (except API Gateway → services)
3. **Shared code** goes in `shared/` — never duplicate logger/middleware across services
4. **Each service is independent** — has its own `package.json`, `Dockerfile`, and database connection
5. **Correlation IDs must be passed** through every service hop
6. **No tight coupling** — if Service A needs data from Service B, use events, not REST calls
7. **MongoDB** is the primary DB; each service has its own database/collection namespace
8. **RabbitMQ** is used locally; SQS/EventBridge replaces it on AWS

---

## 📊 Current Project Status

| Component             | Status           |
|-----------------------|------------------|
| Folder structure      | ✅ Created        |
| `project.md`          | ✅ Written        |
| `CLAUDE.md`           | ✅ This file      |
| `docker-compose.yml`  | ✅ Done (MongoDB + Redis + RabbitMQ) |
| `auth-service`        | ✅ Complete       |
| `upload-service`      | 🔲 Not started    |
| `transcoding-service` | 🔲 Not started    |
| `thumbnail-service`   | 🔲 Not started    |
| `moderation-service`  | 🔲 Not started    |
| `notification-service`| 🔲 Not started    |
| `analytics-service`   | 🔲 Not started    |
| `api-gateway`         | 🔲 Not started    |
| `shared/logger`       | ✅ Complete       |
| `shared/event-schema` | ✅ Complete       |
| AWS deployment        | 🔲 Not started    |

---

*Last updated: 2026-05-19 by Shamsher — auth-service complete, docker-compose infra ready*
