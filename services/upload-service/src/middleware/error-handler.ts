import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({ success: false, message: 'Internal server error' });
};
