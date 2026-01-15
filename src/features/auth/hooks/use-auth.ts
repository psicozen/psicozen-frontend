/**
 * useAuth Hook
 * Main authentication hook that combines store and service
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '../services/auth.service';
import { supabase } from '@/lib/supabase/client';
import { httpClient } from '@/lib/http/client';
import type { MagicLinkRequest, User } from '@/types/auth.types';
import { ApiError } from '@/lib/errors/api-error';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout: storeLogout,
    setLoading,
    updateUser,
  } = useAuthStore();

  // Register auth handlers with HTTP client
  useEffect(() => {
    httpClient.registerAuthHandlers(
      // Get Supabase access token
      async () => {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.access_token || null;

        // 🔒 DEV ONLY: Log access token for Postman testing
        if (process.env.NODE_ENV === 'development' && accessToken) {
          console.group('🔐 Auth Token (DEV ONLY)');
          console.log('Access Token:', accessToken);
          console.log('Expires At:', data.session?.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : 'N/A');
          console.log('User:', data.session?.user?.email);
          console.groupEnd();
        }

        return accessToken;
      },
      // Handle token invalidation
      async (token) => {
        if (token === null) {
          storeLogout();
          await supabase.auth.signOut();
        }
      },
    );
  }, [storeLogout]);

  // Monitor Supabase auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        storeLogout();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Supabase auto-refreshed the token, no action needed
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Token refreshed automatically by Supabase');
        }
      } else if (event === 'SIGNED_IN' && session) {
        // 🔒 DEV ONLY: Log new session details
        if (process.env.NODE_ENV === 'development') {
          console.group('✅ User Signed In (DEV ONLY)');
          console.log('Access Token:', session.access_token);
          console.log('Expires At:', session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A');
          console.log('User:', session.user.email);
          console.groupEnd();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [storeLogout]);

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
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear local store
      storeLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force local logout even if Supabase signout fails
      storeLogout();
    } finally {
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
        await supabase.auth.signOut();
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
    isAuthenticated,
    isLoading,

    // Actions
    sendMagicLink,
    logout,
    refreshProfile,
    updateProfile,
  };
}
