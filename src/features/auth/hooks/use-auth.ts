/**
 * useAuth Hook
 * Main authentication hook that combines store and service
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '../services/auth.service';
import { httpClient } from '@/lib/http/client';
import type {
  LoginCredentials,
  MagicLinkRequest,
  MagicLinkVerification,
  User,
} from '@/types/auth.types';
import { ApiError } from '@/lib/errors/api-error';

export function useAuth() {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    updateUser,
  } = useAuthStore();

  // Register auth handlers with HTTP client
  useEffect(() => {
    httpClient.registerAuthHandlers(
      () => tokens?.accessToken || null,
      (token) => {
        if (token === null) {
          storeLogout();
        }
      },
    );
  }, [tokens?.accessToken, storeLogout]);

  /**
   * Send magic link to email
   */
  const sendMagicLink = useCallback(
    async (data: MagicLinkRequest) => {
      try {
        setLoading(true);
        const response = await authService.sendMagicLink(data);
        return response;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new Error('Failed to send magic link');
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  /**
   * Verify magic link and authenticate
   */
  const verifyMagicLink = useCallback(
    async (data: MagicLinkVerification) => {
      try {
        setLoading(true);
        const response = await authService.verifyMagicLink(data);
        storeLogin(response.user, response.tokens);
        return response;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new Error('Failed to verify magic link');
      } finally {
        setLoading(false);
      }
    },
    [setLoading, storeLogin],
  );

  /**
   * Login with email/password
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        const response = await authService.login(credentials);
        storeLogin(response.user, response.tokens);
        return response;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new Error('Login failed');
      } finally {
        setLoading(false);
      }
    },
    [setLoading, storeLogin],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeLogout();
      setLoading(false);
    }
  }, [setLoading, storeLogout]);

  /**
   * Refresh current user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const updatedUser = await authService.getProfile();
      updateUser(updatedUser);
      return updatedUser;
    } catch (error) {
      if (error instanceof ApiError && error.isAuthError()) {
        storeLogout();
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setLoading, updateUser, storeLogout]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) {
        throw new Error('No user logged in');
      }

      try {
        setLoading(true);
        const updatedUser = await authService.updateProfile(data);
        updateUser(updatedUser);
        return updatedUser;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new Error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
    [user, setLoading, updateUser],
  );

  return {
    // State
    user,
    tokens,
    isAuthenticated,
    isLoading,

    // Actions
    sendMagicLink,
    verifyMagicLink,
    login,
    logout,
    refreshProfile,
    updateProfile,
  };
}
