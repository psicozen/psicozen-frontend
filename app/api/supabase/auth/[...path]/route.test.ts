/**
 * Supabase Auth Proxy Route Tests
 * @jest-environment node
 */

// Mock environment variables BEFORE importing route
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

import { NextRequest } from 'next/server';
import { GET, POST } from './route';

// Mock fetch
global.fetch = jest.fn();

describe('Supabase Auth Proxy Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST - Magic Link', () => {
    it('should proxy magic link request to Supabase', async () => {
      const mockResponse = {
        access_token: null,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: null,
        user: null,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(mockResponse),
      });

      const requestBody = {
        email: 'test@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      };

      const request = new NextRequest('http://localhost:3000/api/supabase/auth/magiclink', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const params = Promise.resolve({ path: ['magiclink'] });
      const response = await POST(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.supabase.co/auth/v1/magiclink',
        expect.objectContaining({
          method: 'POST',
        })
      );

      // Check that Supabase API key was added
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1].headers;
      expect(headers.get('apikey')).toBe('test-anon-key');

      expect(response.status).toBe(200);
    });
  });

  describe('GET - Session', () => {
    it('should proxy session request to Supabase', async () => {
      const mockSession = {
        access_token: 'test-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token',
        user: {
          id: '123',
          email: 'test@example.com',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(mockSession),
      });

      const request = new NextRequest('http://localhost:3000/api/supabase/auth/session', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
        },
      });

      const params = Promise.resolve({ path: ['session'] });
      const response = await GET(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.supabase.co/auth/v1/session',
        expect.any(Object)
      );

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1].headers;

      // Should forward auth header
      expect(headers.get('authorization')).toBe('Bearer test-token');
      // Should add API key
      expect(headers.get('apikey')).toBe('test-anon-key');

      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 502 on Supabase connection error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/supabase/auth/session', {
        method: 'GET',
      });

      const params = Promise.resolve({ path: ['session'] });
      const response = await GET(request, { params });

      expect(response.status).toBe(502);

      const body = await response.json();
      expect(body.error).toContain('Proxy error');
    });
  });

  describe('Query Parameters', () => {
    it('should forward query parameters to Supabase', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: JSON.stringify({}),
      });

      const request = new NextRequest(
        'http://localhost:3000/api/supabase/auth/callback?token=abc123&type=magiclink',
        {
          method: 'GET',
        }
      );

      const params = Promise.resolve({ path: ['callback'] });
      await GET(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.supabase.co/auth/v1/callback?token=abc123&type=magiclink',
        expect.any(Object)
      );
    });
  });
});
