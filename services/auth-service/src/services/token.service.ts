// src/services/token.service.ts
// Handles all JWT and Redis token operations:
// - Access token issuance & verification
// - Refresh token storage in Redis
// - Token blacklisting on logout

import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis';
import { env } from '../config/env';
import { ITokenPayload, IAuthTokens } from '../types';

const REFRESH_TOKEN_PREFIX = 'refresh:';
const BLACKLIST_PREFIX = 'blacklist:';

export class TokenService {
  // ── Access Token ─────────────────────────────────────────────

  generateAccessToken(payload: ITokenPayload): string {
    return jwt.sign(payload, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verifyAccessToken(token: string): ITokenPayload {
    return jwt.verify(token, env.jwt.accessSecret) as ITokenPayload;
  }

  // ── Refresh Token ─────────────────────────────────────────────

  generateRefreshToken(payload: ITokenPayload): string {
    return jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verifyRefreshToken(token: string): ITokenPayload {
    return jwt.verify(token, env.jwt.refreshSecret) as ITokenPayload;
  }

  // Store refresh token in Redis (7 days TTL)
  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const ttlSeconds = 7 * 24 * 60 * 60; // 7 days
    await redisClient.set(
      `${REFRESH_TOKEN_PREFIX}${userId}`,
      refreshToken,
      'EX',
      ttlSeconds
    );
  }

  // Retrieve stored refresh token from Redis
  async getRefreshToken(userId: string): Promise<string | null> {
    return redisClient.get(`${REFRESH_TOKEN_PREFIX}${userId}`);
  }

  // Delete refresh token from Redis (on logout)
  async deleteRefreshToken(userId: string): Promise<void> {
    await redisClient.del(`${REFRESH_TOKEN_PREFIX}${userId}`);
  }

  // ── Token Blacklist (Logout) ──────────────────────────────────

  // Blacklist an access token until its natural expiry
  async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as { exp?: number };
      if (!decoded?.exp) return;

      const now = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - now;

      if (ttl > 0) {
        await redisClient.set(`${BLACKLIST_PREFIX}${token}`, '1', 'EX', ttl);
      }
    } catch {
      // If token is already invalid, no need to blacklist
    }
  }

  // Check if a token has been blacklisted
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await redisClient.get(`${BLACKLIST_PREFIX}${token}`);
    return result !== null;
  }

  // ── Generate Both Tokens ─────────────────────────────────────

  async generateTokenPair(payload: ITokenPayload): Promise<IAuthTokens> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    await this.saveRefreshToken(payload.userId, refreshToken);
    return { accessToken, refreshToken };
  }
}

export const tokenService = new TokenService();
