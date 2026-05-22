import dotenv from 'dotenv';
dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: requireEnv('MONGO_URI'),
  rabbitmqUrl: requireEnv('RABBITMQ_URL'),
  uploadServiceBaseUrl: requireEnv('UPLOAD_SERVICE_BASE_URL'),
};
