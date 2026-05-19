// src/repositories/user.repository.ts
// All MongoDB queries are encapsulated here.
// No business logic — only data access operations.

import { UserModel, IUserDocument } from '../models/user.model';

export class UserRepository {
  // Find user by email — includes password field (hidden by default in schema)
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email }).select('+password');
  }

  // Find user by ID — without password
  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  // Create a new user
  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<IUserDocument> {
    const user = new UserModel(data);
    return user.save();
  }

  // Check if email already exists
  async emailExists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
