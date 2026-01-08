/**
 * useAuth Hook Unit Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { useAuth } from './use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { httpClient } from '@/lib/http/client';
import type { User, AuthTokens } from '@/types/auth.types';
import type { ApiSuccessResponse } from '@/types/api.types';

describe('useAuth Hook', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(httpClient.getAxiosInstance());
  });

  beforeEach(() => {
    act(() => {
      useAuthStore.getState().logout();
    });
    localStorage.clear();
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('sendMagicLink', () => {
    it('should send magic link successfully', async () => {
      const mockResponse: ApiSuccessResponse<{
        message: string;
        email: string;
      }> = {
        success: true,
        data: {
          message: 'Magic link sent',
          email: 'test@example.com',
        },
      };

      mock.onPost('/auth/magic-link/send').reply(200, mockResponse);

      const { result } = renderHook(() => useAuth());

      let response;
      await act(async () => {
        response = await result.current.sendMagicLink({
          email: 'test@example.com',
        });
      });

      expect(response).toEqual(mockResponse.data);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during magic link send', async () => {
      mock.onPost('/auth/magic-link/send').reply(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              200,
              {
                success: true,
                data: { message: 'Sent', email: 'test@example.com' },
              } as ApiSuccessResponse<{ message: string; email: string }>,
            ]);
          }, 100);
        });
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.sendMagicLink({ email: 'test@example.com' });
      });

      // Should be loading immediately
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Should finish loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('verifyMagicLink', () => {
    it('should verify magic link and login user', async () => {
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

      mock.onPost('/auth/magic-link/verify').reply(200, mockResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.verifyMagicLink({
          token: 'magic-token',
          email: 'test@example.com',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.tokens).toEqual(mockTokens);
    });
  });

  describe('login', () => {
    it('should login user with credentials', async () => {
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

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('test@example.com');
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
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

      // Login first
      act(() => {
        useAuthStore.getState().login(mockUser, mockTokens);
      });

      mock.onPost('/auth/logout').reply(200, { success: true, data: null });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAuthenticated).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.tokens).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
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

      // Login first
      act(() => {
        useAuthStore.getState().login(mockUser, mockTokens);
      });

      const updatedUser: User = {
        ...mockUser,
        email: 'updated@example.com',
      };

      const mockResponse: ApiSuccessResponse<User> = {
        success: true,
        data: updatedUser,
      };

      mock.onPatch('/auth/profile').reply(200, mockResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.updateProfile({ email: 'updated@example.com' });
      });

      expect(result.current.user?.email).toBe('updated@example.com');
    });

    it('should throw error if no user logged in', async () => {
      const { result } = renderHook(() => useAuth());

      await expect(
        async () => await result.current.updateProfile({ email: 'test@example.com' }),
      ).rejects.toThrow('No user logged in');
    });
  });
});
