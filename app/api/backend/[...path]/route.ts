/**
 * Backend API Proxy
 *
 * This route acts as a reverse proxy to hide the actual backend URL from the client.
 * All requests to /api/backend/* are forwarded to the real backend API.
 *
 * Security benefits:
 * - Backend URL not exposed in client-side code
 * - Single point of control for backend communication
 * - Easier to implement rate limiting and caching
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Get backend URL with validation
 */
function getBackendUrl(): string {
  const BACKEND_URL = process.env.BACKEND_API_URL;

  if (!BACKEND_URL) {
    throw new Error('BACKEND_API_URL environment variable is not set');
  }

  return BACKEND_URL;
}

/**
 * Handle all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const BACKEND_URL = getBackendUrl();
    const { path } = await params;

    // Construct the target URL
    const targetPath = path.join('/');
    const targetUrl = `${BACKEND_URL}/${targetPath}`;

    // Copy search params from original request
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const fullTargetUrl = searchParams
      ? `${targetUrl}?${searchParams}`
      : targetUrl;

    // Prepare headers (exclude host and connection headers)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip headers that shouldn't be forwarded
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Forward the request to the backend
    const response = await fetch(fullTargetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.text()
        : undefined,
      // Don't follow redirects, let the client handle them
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

    // Return the backend response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Backend Proxy] Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Proxy error: Failed to connect to backend',
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
