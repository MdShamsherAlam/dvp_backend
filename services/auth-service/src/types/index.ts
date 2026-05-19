// src/types/index.ts
// Shared TypeScript interfaces for auth-service

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Extend Express Request to carry user payload after auth
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}
