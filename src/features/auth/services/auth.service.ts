/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { httpClient } from '@/lib/http/client';
import type { User, MagicLinkRequest } from '@/types/auth.types';

export interface MagicLinkResponse {
  message: string;
  email: string;
}

export class AuthService {
  private readonly baseUrl = '/auth';

  /**
   * Helper to transform date strings to Date objects
   */
  private transformUser(user: User): User {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  /**
   * Send magic link to email
   */
  async sendMagicLink(data: MagicLinkRequest): Promise<MagicLinkResponse> {
    const response = await httpClient.post<MagicLinkResponse>(
      `${this.baseUrl}/send-magic-link`,
      data,
    );

    if (!response.success) {
      throw new Error('Failed to send magic link');
    }

    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/logout`);
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await httpClient.get<User>(`${this.baseUrl}/me`);

    if (!response.success) {
      throw new Error('Failed to fetch profile');
    }

    return this.transformUser(response.data);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await httpClient.patch<User>(
      `${this.baseUrl}/profile`,
      data,
    );

    if (!response.success) {
      throw new Error('Failed to update profile');
    }

    return this.transformUser(response.data);
  }
}

// Singleton instance
export const authService = new AuthService();
