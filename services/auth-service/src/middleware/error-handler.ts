// src/middleware/error-handler.ts
// Global Express error handler.
// Must be the last middleware registered in index.ts.

import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../services/auth.service';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Known auth errors (AuthError class)
  if (err instanceof AuthError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && (err as NodeJS.ErrnoException & { code: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
    return;
  }

  // Generic fallback
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
