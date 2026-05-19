# 🔐 Auth Service

> **Part of:** Distributed Video Processing (DVP) Platform
> **Port:** `3007`
> **Database:** MongoDB (`dvp_auth`)
> **Cache/Store:** Redis

---

## 📌 Responsibility

The `auth-service` is the **single source of truth for identity** in the DVP platform.

- User registration & login
- JWT Access Token issuance (15 min expiry)
- JWT Refresh Token management (7 days, stored in Redis)
- Token refresh & rotation
- Logout with token blacklisting
- `/validate` endpoint for API Gateway token verification

> No other service handles authentication. They rely on the API Gateway to forward validated user identity.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime & language |
| Express.js | HTTP framework |
| MongoDB + Mongoose | User data persistence |
| bcryptjs | Password hashing (12 salt rounds) |
| jsonwebtoken | JWT issuance & verification |
| Redis (ioredis) | Refresh token store & access token blacklist |
| Zod | Request validation |
| Winston | Structured logging |

---

## 📁 Folder Structure

```
auth-service/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── redis.ts           # Redis connection
│   │   └── env.ts             # Env variable loader
│   ├── models/
│   │   └── user.model.ts      # Mongoose User schema
│   ├── repositories/
│   │   └── user.repository.ts # DB query abstraction
│   ├── services/
│   │   ├── auth.service.ts    # Business logic
│   │   └── token.service.ts   # JWT + Redis operations
│   ├── controllers/
│   │   └── auth.controller.ts # Route handlers
│   ├── routes/
│   │   └── auth.routes.ts     # Route definitions
│   ├── middleware/
│   │   ├── validate.ts        # Zod validation middleware
│   │   └── error-handler.ts   # Global error handler
│   ├── validators/
│   │   └── auth.validator.ts  # Zod schemas
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── index.ts               # App entry point
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 🌐 API Endpoints

Base URL: `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register new user |
| `POST` | `/login` | ❌ | Login, receive tokens |
| `POST` | `/refresh` | ❌ | Refresh access token |
| `POST` | `/logout` | ✅ | Invalidate tokens |
| `GET` | `/me` | ✅ | Get current user |
| `GET` | `/validate` | ✅ | Validate token (API Gateway) |

---

## 🔑 JWT Strategy

```
Login → Access Token (15min) + Refresh Token (7 days in Redis)
       ↓ access token expires
Refresh → New Access Token + New Refresh Token (rotation)
       ↓ logout
Logout → Access Token added to Redis blacklist
```

---

## ⚙️ Environment Variables

```env
PORT=3007
NODE_ENV=development
MONGO_URI=mongodb://admin:password@localhost:27017/dvp_auth?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start in dev mode
npm run dev
```

**Infrastructure must be running:**
```bash
# From project root
docker compose up -d mongodb redis
```

---

## 🐳 Running via Docker

```bash
# From project root
docker compose up -d auth-service
```

---

## 🧪 Test Endpoints

```bash
# Register
curl -X POST http://localhost:3007/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Shamsher","email":"shamsher@test.com","password":"Test@1234"}'

# Login
curl -X POST http://localhost:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shamsher@test.com","password":"Test@1234"}'
```

---

## 📊 Status

| Feature | Status |
|---------|--------|
| Project setup | ✅ Done |
| MongoDB connection | ✅ Done |
| Redis connection | ✅ Done |
| User model | ✅ Done |
| Register endpoint | ✅ Done |
| Login endpoint | ✅ Done |
| Refresh token | ✅ Done |
| Logout | ✅ Done |
| /me endpoint | ✅ Done |
| /validate endpoint | ✅ Done |
| Dockerfile | ✅ Done |
