/**
 * HTTP Client
 * Axios instance with interceptors and retry logic
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import { ApiError, NetworkError, TimeoutError } from '../errors/api-error';
import type { ApiResponse } from '@/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000; // 30 seconds

class HttpClient {
  private client: AxiosInstance;
  private tokenGetter: (() => Promise<string | null>) | null = null;
  private tokenSetter: ((token: string | null) => Promise<void>) | null = null;
  private orgIdGetter: (() => string | null) | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupRetry();
  }

  /**
   * Register token getter/setter for auth interceptor
   * Now supports async token retrieval (for Supabase)
   */
  public registerAuthHandlers(
    getter: () => Promise<string | null>,
    setter: (token: string | null) => Promise<void>,
  ): void {
    this.tokenGetter = getter;
    this.tokenSetter = setter;
  }

  /**
   * Register org ID getter for header interceptor
   */
  public registerOrgIdHandlers(getter: () => string | null): void {
    this.orgIdGetter = getter;
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - inject auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (this.tokenGetter) {
          const token = await this.tokenGetter();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        if (this.orgIdGetter) {
          const orgId = this.orgIdGetter();
          if (orgId) {
            config.headers['x-organization-id'] = orgId;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        // Check if response follows ApiResponse structure
        if (response.data && 'success' in response.data) {
          if (!response.data.success) {
            // Backend returned error in success structure
            throw ApiError.fromResponse(response.data);
          }
        }
        return response;
      },
      async (error) => {
        // Network errors
        if (!error.response) {
          if (error.code === 'ECONNABORTED') {
            throw new TimeoutError();
          }
          throw new NetworkError(error.message);
        }

        const response = error.response;

        // Handle 401 - clear session and redirect to login
        if (response.status === 401 && this.tokenSetter) {
          await this.tokenSetter(null);
          // Frontend will handle redirect in useAuth hook
        }

        // Transform to ApiError
        const apiError = ApiError.fromResponse({
          statusCode: response.status,
          message: response.data?.message || error.message,
          path: response.config.url,
          method: response.config.method?.toUpperCase(),
          errors: response.data?.errors,
        });

        throw apiError;
      },
    );
  }

  /**
   * Get axios instance for testing purposes
   * @internal Used for mocking in tests
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Setup axios-retry with exponential backoff
   * Only retry temporary server errors (502, 503, 504)
   */
  private setupRetry(): void {
    axiosRetry(this.client, {
      retries: 2, // Reduced from 3 for faster failure
      retryDelay: (retryCount, error) => {
        // Respect Retry-After header if present
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter) {
          const delay = parseInt(retryAfter, 10) * 1000;
          return delay;
        }
        // Exponential backoff: 1s, 2s
        return axiosRetry.exponentialDelay(retryCount);
      },
      retryCondition: (error) => {
        const status = error.response?.status ?? 0;

        // Only retry network errors and temporary server errors
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          status === 502 || // Bad Gateway
          status === 503 || // Service Unavailable
          status === 504    // Gateway Timeout
        );
        // Don't retry 500 Internal Server Error (permanent)
      },
      onRetry: (retryCount, error, requestConfig) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Retry attempt ${retryCount} for ${requestConfig.url}`,
            error.message,
          );
        }
      },
    });
  }

  /**
   * GET request with optional AbortSignal for cancellation
   */
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST request with optional AbortSignal for cancellation
   */
  public async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT request with optional AbortSignal for cancellation
   */
  public async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request with optional AbortSignal for cancellation
   */
  public async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request with optional AbortSignal for cancellation
   */
  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Create AbortController for request cancellation
   * Usage: const controller = httpClient.createAbortController();
   *        await httpClient.get('/endpoint', { signal: controller.signal });
   *        controller.abort(); // Cancel request
   */
  public createAbortController(): AbortController {
    return new AbortController();
  }
}

// Singleton instance
export const httpClient = new HttpClient();
