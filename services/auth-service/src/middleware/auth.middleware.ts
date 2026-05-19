// src/middleware/auth.middleware.ts
// Protects routes by verifying the JWT access token.
// Attaches the decoded user payload to req.user.

import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/token.service';
import { logger } from '../utils/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access token is required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token has been blacklisted (logged out)
    const isBlacklisted = await tokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({
        success: false,
        message: 'Token has been invalidated. Please login again.',
      });
      return;
    }

    // Verify and decode the token
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;

    // Attach the raw token for logout use
    (req as Request & { token: string }).token = token;

    next();
  } catch (error) {
    logger.warn('Invalid token attempt', { error });
    res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};
