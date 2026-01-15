/**
 * Supabase Server Actions
 * Secure server-side operations for Supabase
 *
 * These actions run on the server and don't expose credentials to the browser.
 * Use these instead of client-side Supabase calls for better security.
 */

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from './server';

/**
 * Get current user session from server-side
 * @returns User session or null if not authenticated
 */
export async function getSession() {
  try {
    const supabase = await createServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('[Supabase] Session error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('[Supabase] Failed to get session:', error);
    return null;
  }
}

/**
 * Get current user from server-side
 * @returns User or null if not authenticated
 */
export async function getUser() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('[Supabase] User error:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('[Supabase] Failed to get user:', error);
    return null;
  }
}

/**
 * Sign out user server-side
 * Clears session and redirects to login
 */
export async function signOut() {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();

    // Clear auth cookies
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
  } catch (error) {
    console.error('[Supabase] Sign out error:', error);
  }

  redirect('/login');
}

/**
 * Refresh user session server-side
 * @returns Updated session or null if refresh failed
 */
export async function refreshSession() {
  try {
    const supabase = await createServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();

    if (error) {
      console.error('[Supabase] Refresh error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('[Supabase] Failed to refresh session:', error);
    return null;
  }
}
