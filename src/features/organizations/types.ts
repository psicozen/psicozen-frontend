export type OrganizationType = 'company' | 'department' | 'team';

export interface OrganizationSettings {
  timezone: string;
  locale: string;
  emociogramaEnabled: boolean;
  alertThreshold: number;
  dataRetentionDays: number;
  anonymityDefault: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  settings: OrganizationSettings;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateOrganizationDTO {
  name: string;
  type: OrganizationType;
  settings?: Partial<OrganizationSettings>;
  parentId?: string;
}

export interface UpdateOrganizationSettingsDTO {
  settings: Partial<OrganizationSettings>;
}

export interface OrganizationResponse {
  data: Organization;
}

export interface OrganizationListResponse {
  data: Organization[];
}
