/**
 * HTTP Client Unit Tests
 */

import MockAdapter from 'axios-mock-adapter';
import { httpClient } from './client';
import { ApiError, NetworkError, TimeoutError } from '../errors/api-error';
import type { ApiSuccessResponse } from '@/types/api.types';

describe('HttpClient', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    // Create a mock adapter for the httpClient axios instance
    mock = new MockAdapter(httpClient.getAxiosInstance());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('GET requests', () => {
    it('should successfully make GET request', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockResponse: ApiSuccessResponse<typeof mockData> = {
        success: true,
        data: mockData,
      };

      mock.onGet('/test').reply(200, mockResponse);

      const response = await httpClient.get('/test');

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data).toEqual(mockData);
      }
    });

    it('should handle API error responses', async () => {
      mock.onGet('/error').reply(400, {
        success: false,
        statusCode: 400,
        message: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: '/error',
        method: 'GET',
      });

      await expect(httpClient.get('/error')).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      mock.onGet('/network-error').networkError();

      await expect(httpClient.get('/network-error')).rejects.toThrow(
        NetworkError,
      );
    });

    it('should handle timeout errors', async () => {
      mock.onGet('/timeout').timeout();

      await expect(httpClient.get('/timeout')).rejects.toThrow(TimeoutError);
    });
  });

  describe('POST requests', () => {
    it('should successfully make POST request', async () => {
      const mockData = { id: '1', name: 'Created' };
      const mockResponse: ApiSuccessResponse<typeof mockData> = {
        success: true,
        data: mockData,
      };

      mock.onPost('/test', { name: 'Test' }).reply(201, mockResponse);

      const response = await httpClient.post('/test', { name: 'Test' });

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data).toEqual(mockData);
      }
    });

    it('should handle validation errors', async () => {
      mock.onPost('/validate').reply(400, {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        timestamp: new Date().toISOString(),
        path: '/validate',
        method: 'POST',
        errors: {
          email: 'Invalid email format',
        },
      });

      try {
        await httpClient.post('/validate', {});
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).isValidationError()).toBe(true);
        expect((error as ApiError).errors).toEqual({
          email: 'Invalid email format',
        });
      }
    });
  });

  describe('Authentication', () => {
    it('should inject auth token in request headers', async () => {
      const mockToken = 'test-token-123';
      let capturedHeaders: Record<string, string> = {};

      httpClient.registerAuthHandlers(
        () => mockToken,
        () => {},
      );

      mock.onGet('/protected').reply((config) => {
        capturedHeaders = config.headers as Record<string, string>;
        return [
          200,
          { success: true, data: { protected: true } } as ApiSuccessResponse<{
            protected: boolean;
          }>,
        ];
      });

      await httpClient.get('/protected');

      expect(capturedHeaders.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should handle 401 unauthorized', async () => {
      let tokenCleared = false;

      httpClient.registerAuthHandlers(
        () => 'invalid-token',
        (token) => {
          if (token === null) tokenCleared = true;
        },
      );

      mock.onGet('/unauthorized').reply(401, {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/unauthorized',
        method: 'GET',
      });

      try {
        await httpClient.get('/unauthorized');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).isAuthError()).toBe(true);
        expect(tokenCleared).toBe(true);
      }
    });
  });

  describe('Error Classification', () => {
    it('should identify client errors', async () => {
      mock.onGet('/client-error').reply(400, {
        success: false,
        statusCode: 400,
        message: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: '/client-error',
        method: 'GET',
      });

      try {
        await httpClient.get('/client-error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).isClientError()).toBe(true);
        expect((error as ApiError).isServerError()).toBe(false);
      }
    });

    it('should identify server errors', async () => {
      mock.onGet('/server-error').reply(500, {
        success: false,
        statusCode: 500,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: '/server-error',
        method: 'GET',
      });

      try {
        await httpClient.get('/server-error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).isServerError()).toBe(true);
        expect((error as ApiError).isClientError()).toBe(false);
      }
    });
  });
});
