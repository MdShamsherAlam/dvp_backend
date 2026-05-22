import 'dotenv/config';
import express from 'express';
import path from 'path';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { connectRabbitMQ, closeRabbitMQ } from './config/rabbitmq';
import videoRoutes from './routes/video.routes';
import { errorHandler } from './middleware/error-handler';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPublicPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPublicPath));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'upload-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/upload-service', videoRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();
    await connectRabbitMQ();

    const server = app.listen(env.port, () => {
      logger.info(`🚀 Upload service running on port ${env.port}`, {
        environment: env.nodeEnv,
      });
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        await closeRabbitMQ();
        logger.info('Upload service stopped.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start upload service', { error });
    process.exit(1);
  }
};

bootstrap();
