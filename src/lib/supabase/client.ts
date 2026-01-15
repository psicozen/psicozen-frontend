/**
 * Supabase Client - Browser Client
 *
 * Current implementation uses NEXT_PUBLIC_ variables for client-side auth.
 * This is necessary for:
 * - Auth state management (onAuthStateChange)
 * - Magic link callbacks
 * - Session persistence
 *
 * ℹ️ SECURITY NOTE:
 * - Supabase anon key is SAFE to expose (it's public by design)
 * - Row Level Security (RLS) policies protect your data
 * - Service role key should NEVER be exposed (it's not here)
 *
 * 🔮 FUTURE MIGRATION (optional):
 * For additional security, consider migrating to:
 * - Server Components: Use createServerClient() from '@/lib/supabase/server'
 * - Server Actions: For mutations and sensitive operations
 * - This requires refactoring auth state management
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
    'Check your .env.local file.'
  );
}

/**
 * Browser client for Supabase authentication and real-time features
 * Safe to use - anon key is public by design and protected by RLS
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
