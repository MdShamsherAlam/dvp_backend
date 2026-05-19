// src/services/auth.service.ts
// Core business logic for authentication:
// register, login, refresh, logout

import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { tokenService } from './token.service';
import { env } from '../config/env';
import { ITokenPayload, IAuthTokens, IUser } from '../types';
import { IUserDocument } from '../models/user.model';

// ── Custom Error Classes ──────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ── Auth Service ──────────────────────────────────────────────

export class AuthService {

  // Register a new user
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: Partial<IUser> }> {
    // Check if email already taken
    const emailExists = await userRepository.emailExists(data.email);
    if (emailExists) {
      throw new AuthError('Email is already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, env.bcryptSaltRounds);

    // Create user
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Return user without password
    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  // Login — validate credentials and issue tokens
  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: Partial<IUser>; tokens: IAuthTokens }> {
    // Find user (with password field included)
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AuthError('Account is deactivated. Please contact support.', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid email or password', 401);
    }

    // Build token payload
    const payload: ITokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    // Generate access + refresh tokens
    const tokens = await tokenService.generateTokenPair(payload);

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  // Refresh — issue new access token using refresh token
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let payload: ITokenPayload;

    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthError('Invalid or expired refresh token', 401);
    }

    // Verify token matches what we stored in Redis
    const storedToken = await tokenService.getRefreshToken(payload.userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new AuthError('Refresh token is invalid or has been revoked', 401);
    }

    // Issue new access token
    const newAccessToken = tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return { accessToken: newAccessToken };
  }

  // Logout — blacklist access token and delete refresh token
  async logout(accessToken: string, userId: string): Promise<void> {
    await Promise.all([
      tokenService.blacklistToken(accessToken),
      tokenService.deleteRefreshToken(userId),
    ]);
  }

  // Get user profile by ID
  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AuthError('User not found', 404);
    }
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
