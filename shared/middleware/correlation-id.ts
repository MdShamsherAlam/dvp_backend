// shared/middleware/correlation-id.ts
// Express middleware to manage End-to-End Correlation IDs for Distributed Tracing.

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Header key constant
export const CORRELATION_HEADER = 'x-correlation-id';

// Extend Request interface to support correlationId property
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Get incoming Correlation ID or generate a brand new UUID
  const correlationId = (req.headers[CORRELATION_HEADER] as string) || randomUUID();

  // 2. Attach it to Request object so internal business logic/loggers can read it
  req.correlationId = correlationId;

  // 3. Set the response header so clients/gateways can trace it in responses too
  res.setHeader(CORRELATION_HEADER, correlationId);

  next();
};
