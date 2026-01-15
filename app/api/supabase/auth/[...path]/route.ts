/**
 * Supabase Auth Proxy
 *
 * This route acts as a reverse proxy for Supabase Auth API calls.
 * Hides Supabase URL from client-side code for better security.
 *
 * Security benefits:
 * - Supabase URL not exposed in client-side code
 * - Can add additional validation/logging
 * - Single point of control for auth communication
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Get Supabase credentials with validation
 */
function getSupabaseCredentials(): { url: string; anonKey: string } {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
  }

  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

/**
 * Handle all HTTP methods for Supabase Auth
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY } = getSupabaseCredentials();
    const { path } = await params;

    // Construct the target URL
    const targetPath = path.join('/');
    const targetUrl = `${SUPABASE_URL}/auth/v1/${targetPath}`;

    // Copy search params from original request
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const fullTargetUrl = searchParams
      ? `${targetUrl}?${searchParams}`
      : targetUrl;

    // Prepare headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip headers that shouldn't be forwarded
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Always include Supabase API key
    headers.set('apikey', SUPABASE_ANON_KEY);

    // Forward the request to Supabase
    const response = await fetch(fullTargetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.text()
        : undefined,
      redirect: 'manual',
    });

    // Copy response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip headers that shouldn't be forwarded
      if (!['connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Return the Supabase response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Supabase Auth Proxy] Error:', error);

    return NextResponse.json(
      {
        error: 'Proxy error: Failed to connect to Supabase',
        statusCode: 502,
      },
      { status: 502 }
    );
  }
}

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
