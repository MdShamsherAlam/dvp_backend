import winston from 'winston';

const { combine, timestamp, json, colorize, simple } = winston.format;
const isDev = process.env.NODE_ENV !== 'production';

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isDev ? combine(colorize(), simple()) : json()
  ),
  defaultMeta: { service: 'upload-service' },
  transports: [new winston.transports.Console()],
});
