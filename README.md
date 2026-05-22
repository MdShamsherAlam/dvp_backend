# Distributed Video Processing Backend

## Overview

This repository implements a production-style distributed video processing backend platform. It is designed as a microservices-based event-driven system built with Node.js and TypeScript, using MongoDB, RabbitMQ, Redis, and Docker for local development.

The platform simulates a real-world video processing workflow involving:

- user authentication and authorization
- video upload and metadata storage
- event publishing for asynchronous processing
- future services such as transcoding, thumbnail generation, moderation, notifications, and analytics

## Project Structure

```
├── services/              # Individual microservice projects
│   ├── auth-service/      # Authentication and authorization
│   └── upload-service/    # Video upload and event publishing
├── shared/                # Shared event schema and utilities
├── infra/                 # Infrastructure definitions and Dockerfiles
├── docker-compose.yml     # Local multi-service orchestration
├── project.md             # Project architecture and roadmap
└── README.md              # Project overview and usage guide
```

## Key Technologies

- Node.js + TypeScript
- Express.js
- MongoDB
- RabbitMQ
- Redis
- Docker / Docker Compose
- Winston logging
- Multipart upload handling with Multer

## Available Services

- `auth-service`: JWT-based authentication, user management, and token handling.
- `upload-service`: Video upload endpoint with S3 presigned/multipart upload support, metadata persistence, and `VIDEO_UPLOADED` event publishing.

## Local Development

1. Install dependencies for each service:

```bash
cd services/auth-service && npm install
cd ../upload-service && npm install
```

2. Build each service:

```bash
cd services/auth-service && npm run build
cd ../upload-service && npm run build
```

3. Start the full stack with Docker Compose:

```bash
docker-compose up --build
```

4. Confirm the services are running:

- Auth: `http://localhost:3007/health`
- Upload: `http://localhost:3001/health`

## Upload API

`POST /api/v1/videos/upload`

Required form fields:

- `file` (video file)
- `title`
- `description`
- `userId`
- optional `correlationId`

## Notes

- Dockerfiles are stored under `infra/docker/`.
- `docker-compose.yml` lives at the repository root.
- The project follows an event-driven architecture with independent service boundaries.

## Next Steps

- Add `transcoding-service` to consume `VIDEO_UPLOADED` events
- Add `thumbnail-service`, `moderation-service`, and `notification-service`
- Implement shared middleware and distributed tracing
- Expand Docker Compose to include all services and dependencies
