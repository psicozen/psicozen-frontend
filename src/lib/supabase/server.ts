/**
 * Supabase Server Client
 * Server-side Supabase client using server-only environment variables
 *
 * This client should only be used in:
 * - Server Components
 * - Server Actions
 * - API Routes
 * - Route Handlers
 *
 * Benefits:
 * - Supabase credentials not exposed to browser
 * - Can use service role key for admin operations
 * - Better security for sensitive operations
 */

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Use NEXT_PUBLIC_ variables (they work on both client and server)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

/**
 * Create Supabase client for server-side use with user context
 * Reads auth token from cookies to maintain user session
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

/**
 * Create Supabase admin client with service role key
 * Use with caution - bypasses Row Level Security (RLS)
 *
 * Only use for:
 * - Admin operations
 * - Background jobs
 * - Operations that need to bypass RLS
 *
 * @throws Error if SUPABASE_SERVICE_ROLE_KEY is not configured
 */
export function createAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY not configured.\n' +
      'This is only needed for admin operations that bypass RLS.\n' +
      'If you need admin access, add SUPABASE_SERVICE_ROLE_KEY to .env.local'
    );
  }

  return createClient(supabaseUrl!, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
