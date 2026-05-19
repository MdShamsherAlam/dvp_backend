// src/config/redis.ts
// Creates and exports a single Redis client instance.

import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = new Redis(env.redisUrl, {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 5) {
      logger.error('❌ Redis max retry attempts reached');
      return null; // stop retrying
    }
    return Math.min(times * 500, 3000); // wait up to 3s between retries
  },
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('❌ Redis connection failed', { error });
    process.exit(1);
  }
};
