/**
 * Authentication Service Unit Tests
 */

import MockAdapter from 'axios-mock-adapter';
import { authService } from './auth.service';
import { httpClient } from '@/lib/http/client';
import type { User, AuthTokens } from '@/types/auth.types';
import type { ApiSuccessResponse } from '@/types/api.types';

describe('AuthService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(httpClient.getAxiosInstance());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('sendMagicLink', () => {
    it('should send magic link successfully', async () => {
      const email = 'test@example.com';
      const mockResponse: ApiSuccessResponse<{
        message: string;
        email: string;
      }> = {
        success: true,
        data: {
          message: 'Magic link sent to your email',
          email,
        },
      };

      mock.onPost('/auth/send-magic-link').reply(200, mockResponse);

      const result = await authService.sendMagicLink({ email });

      expect(result.email).toBe(email);
      expect(result.message).toContain('Magic link sent');
    });
  });

  describe('verifyMagicLink', () => {
    it('should verify magic link and return user with tokens', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTokens: AuthTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      const mockResponse: ApiSuccessResponse<{
        user: User;
        tokens: AuthTokens;
      }> = {
        success: true,
        data: {
          user: mockUser,
          tokens: mockTokens,
        },
      };

      mock.onGet(/\/auth\/callback/).reply(200, mockResponse);

      const result = await authService.verifyMagicLink({
        token_hash: 'magic-token-hash',
        type: 'magiclink',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.tokens).toEqual(mockTokens);
    });
  });

  describe('login', () => {
    it('should login with email and password', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTokens: AuthTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      const mockResponse: ApiSuccessResponse<{
        user: User;
        tokens: AuthTokens;
      }> = {
        success: true,
        data: {
          user: mockUser,
          tokens: mockTokens,
        },
      };

      mock.onPost('/auth/login').reply(200, mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      mock.onPost('/auth/logout').reply(200, { success: true, data: null });

      await expect(authService.logout()).resolves.not.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      const mockTokens: AuthTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      const mockResponse: ApiSuccessResponse<AuthTokens> = {
        success: true,
        data: mockTokens,
      };

      mock.onPost('/auth/refresh').reply(200, mockResponse);

      const result = await authService.refreshToken('old-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });
  });

  describe('getProfile', () => {
    it('should fetch user profile', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse: ApiSuccessResponse<User> = {
        success: true,
        data: mockUser,
      };

      mock.onGet('/auth/profile').reply(200, mockResponse);

      const result = await authService.getProfile();

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updatedUser: User = {
        id: '1',
        email: 'updated@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse: ApiSuccessResponse<User> = {
        success: true,
        data: updatedUser,
      };

      mock.onPatch('/auth/profile').reply(200, mockResponse);

      const result = await authService.updateProfile({
        email: 'updated@example.com',
      });

      expect(result.email).toBe('updated@example.com');
    });
  });
});
