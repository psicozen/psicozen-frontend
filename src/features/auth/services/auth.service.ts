/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { httpClient } from '@/lib/http/client';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  MagicLinkRequest,
  MagicLinkVerification,
} from '@/types/auth.types';

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

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
      `${this.baseUrl}/magic-link/send`,
      data,
    );

    if (!response.success) {
      throw new Error('Failed to send magic link');
    }

    return response.data;
  }

  /**
   * Verify magic link token and authenticate user
   */
  async verifyMagicLink(
    data: MagicLinkVerification,
  ): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      `${this.baseUrl}/magic-link/verify`,
      data,
    );

    if (!response.success) {
      throw new Error('Failed to verify magic link');
    }

    return {
      ...response.data,
      user: this.transformUser(response.data.user),
    };
  }

  /**
   * Traditional email/password login
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      `${this.baseUrl}/login`,
      credentials,
    );

    if (!response.success) {
      throw new Error('Login failed');
    }

    return {
      ...response.data,
      user: this.transformUser(response.data.user),
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/logout`);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await httpClient.post<AuthTokens>(
      `${this.baseUrl}/refresh`,
      { refreshToken },
    );

    if (!response.success) {
      throw new Error('Token refresh failed');
    }

    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await httpClient.get<User>(`${this.baseUrl}/profile`);

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
