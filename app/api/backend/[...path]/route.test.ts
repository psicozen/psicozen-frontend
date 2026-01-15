/**
 * Backend Proxy Route Tests
 * @jest-environment node
 */

// Mock environment variable BEFORE importing route
process.env.BACKEND_API_URL = 'http://localhost:3001';

import { NextRequest } from 'next/server';
import { GET, POST } from './route';

// Mock fetch
global.fetch = jest.fn();

describe('Backend Proxy Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should proxy GET request to backend', async () => {
      const mockResponse = {
        success: true,
        data: { message: 'Hello' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(mockResponse),
      });

      const request = new NextRequest('http://localhost:3000/api/backend/users', {
        method: 'GET',
      });

      const params = Promise.resolve({ path: ['users'] });
      const response = await GET(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users',
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(response.status).toBe(200);
    });

    it('should forward query parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: JSON.stringify({ success: true }),
      });

      const request = new NextRequest('http://localhost:3000/api/backend/users?page=1&limit=10', {
        method: 'GET',
      });

      const params = Promise.resolve({ path: ['users'] });
      await GET(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('should forward authorization headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: JSON.stringify({ success: true }),
      });

      const request = new NextRequest('http://localhost:3000/api/backend/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
        },
      });

      const params = Promise.resolve({ path: ['users'] });
      await GET(request, { params });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1].headers;

      expect(headers.get('authorization')).toBe('Bearer test-token');
    });
  });

  describe('POST', () => {
    it('should proxy POST request with body', async () => {
      const requestBody = { name: 'John Doe' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ success: true, data: requestBody }),
      });

      const request = new NextRequest('http://localhost:3000/api/backend/users', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const params = Promise.resolve({ path: ['users'] });
      const response = await POST(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );

      expect(response.status).toBe(201);
    });
  });

  describe('Error Handling', () => {
    it('should return 502 on backend connection error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Connection refused'));

      const request = new NextRequest('http://localhost:3000/api/backend/users', {
        method: 'GET',
      });

      const params = Promise.resolve({ path: ['users'] });
      const response = await GET(request, { params });

      expect(response.status).toBe(502);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('Proxy error');
    });
  });

  describe('Nested Paths', () => {
    it('should handle nested API paths', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: JSON.stringify({ success: true }),
      });

      const request = new NextRequest('http://localhost:3000/api/backend/users/123/posts', {
        method: 'GET',
      });

      const params = Promise.resolve({ path: ['users', '123', 'posts'] });
      await GET(request, { params });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users/123/posts',
        expect.any(Object)
      );
    });
  });
});
