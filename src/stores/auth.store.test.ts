/**
 * Authentication Store Unit Tests
 */

import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './auth.store';
import type { User, AuthTokens } from '@/types/auth.types';

describe('AuthStore', () => {
  beforeEach(() => {
    // Clear store before each test
    act(() => {
      useAuthStore.getState().logout();
    });
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.tokens).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Login', () => {
    it('should set user and tokens on login', () => {
      const { result } = renderHook(() => useAuthStore());

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

      act(() => {
        result.current.login(mockUser, mockTokens);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.tokens).toEqual(mockTokens);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should clear user and tokens on logout', () => {
      const { result } = renderHook(() => useAuthStore());

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

      act(() => {
        result.current.login(mockUser, mockTokens);
      });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.tokens).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Update User', () => {
    it('should update user data', () => {
      const { result } = renderHook(() => useAuthStore());

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

      act(() => {
        result.current.login(mockUser, mockTokens);
      });

      act(() => {
        result.current.updateUser({ email: 'updated@example.com' });
      });

      expect(result.current.user?.email).toBe('updated@example.com');
      expect(result.current.user?.id).toBe('1'); // Other fields remain
    });

    it('should not update if no user is logged in', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateUser({ email: 'updated@example.com' });
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Persistence', () => {
    it('should persist user and tokens to localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

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

      act(() => {
        result.current.login(mockUser, mockTokens);
      });

      const stored = localStorage.getItem('auth-storage');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.user.email).toBe('test@example.com');
      expect(parsed.state.tokens.accessToken).toBe('access-token');
    });

    it('should not persist loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      const stored = localStorage.getItem('auth-storage');
      const parsed = JSON.parse(stored!);

      expect(parsed.state.isLoading).toBeUndefined();
    });
  });
});
