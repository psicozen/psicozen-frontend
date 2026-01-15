import { httpClient } from '@/lib/http/client';
import {
  Organization,
  CreateOrganizationDTO,
  OrganizationSettings,
  OrganizationListResponse,
  OrganizationResponse,
} from './types';

const BASE_URL = '/organizations';

export class OrganizationService {
  /**
   * List all organizations (with pagination support in future)
   */
  static async getAll(): Promise<Organization[]> {
    // The backend response is wrapped in ApiResponseDto, handled by HttpClient interceptor
    const response = await httpClient.get<Organization[]>(BASE_URL);
    if ('data' in response) {
      return response.data;
    }
    throw new Error('Unexpected response format');
  }

  /**
   * Get organization by ID
   */
  static async getById(id: string): Promise<Organization> {
    const response = await httpClient.get<Organization>(`${BASE_URL}/${id}`);
    if ('data' in response) {
      return response.data;
    }
    throw new Error('Unexpected response format');
  }

  /**
   * Create a new organization
   */
  static async create(data: CreateOrganizationDTO): Promise<Organization> {
    const response = await httpClient.post<Organization>(BASE_URL, data);
    if ('data' in response) {
      return response.data;
    }
    throw new Error('Unexpected response format');
  }

  /**
   * Update organization settings
   */
  static async updateSettings(
    id: string,
    settings: Partial<OrganizationSettings>,
  ): Promise<Organization> {
    const response = await httpClient.patch<Organization>(
      `${BASE_URL}/${id}/settings`,
      { settings },
    );
    if ('data' in response) {
      return response.data;
    }
    throw new Error('Unexpected response format');
  }

  /**
   * Delete (soft-delete) an organization
   */
  static async delete(id: string): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`);
  }
}
