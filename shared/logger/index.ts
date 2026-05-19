import winston from 'winston';

const { combine, timestamp, json, colorize, simple, printf } = winston.format;

// Custom console log format for pretty-printing in local development
const customFormat = printf(({ level, message, timestamp, service, correlationId, ...meta }) => {
  const correlationStr = correlationId ? ` [CorrelationID: ${correlationId}]` : '';
  const serviceStr = service ? ` [${service}]` : '';
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp}${serviceStr}${correlationStr} ${level}: ${message}${metaStr}`;
});

export const createLogger = (serviceName: string) => {
  const isDev = process.env.NODE_ENV !== 'production';

  return winston.createLogger({
    level: isDev ? 'debug' : 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      isDev ? combine(colorize(), customFormat) : json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console(),
      // In production, logs can also be piped to log files or AWS CloudWatch
    ],
  });
};
