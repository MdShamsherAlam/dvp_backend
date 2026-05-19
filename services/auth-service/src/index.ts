// src/index.ts
// Express application entry point.
// Boots connections, registers middleware, starts HTTP server.

import 'dotenv/config';
import express from 'express';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { connectRedis, redisClient } from './config/redis';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Global Error Handler (must be last) ──────────────────────
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────
const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();
    await connectRedis();

    const server = app.listen(env.port, () => {
      logger.info(`🚀 Auth service running on port ${env.port}`, {
        environment: env.nodeEnv,
      });
    });

    // ── Graceful Shutdown ────────────────────────────────────
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        await redisClient.quit();
        logger.info('Auth service stopped.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start auth service', { error });
    process.exit(1);
  }
};

bootstrap();
