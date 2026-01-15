import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization } from './types';
import { OrganizationService } from './service';
import { httpClient } from '@/lib/http/client';

interface OrganizationState {
  // Current context
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  
  // List management
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrganizations: () => Promise<void>;
  createOrganization: (data: any) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;
  updateSettings: (id: string, settings: any) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      currentOrganization: null,
      setCurrentOrganization: (org) => {
        set({ currentOrganization: org });
        // Register org ID getter in HttpClient when context changes
        // This ensures subsequent requests include the header
        // Note: In a real app, this might be better placed in a dedicated auth/init logic
      },

      organizations: [],
      isLoading: false,
      error: null,

      fetchOrganizations: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await OrganizationService.getAll();
          set({ organizations: data, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Failed to fetch organizations', isLoading: false });
        }
      },

      createOrganization: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const newOrg = await OrganizationService.create(data);
          set((state) => ({
            organizations: [...state.organizations, newOrg],
            isLoading: false,
          }));
        } catch (err: any) {
          set({ error: err.message || 'Failed to create organization', isLoading: false });
          throw err;
        }
      },

      deleteOrganization: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await OrganizationService.delete(id);
          set((state) => ({
            organizations: state.organizations.filter((org) => org.id !== id),
            isLoading: false,
          }));
          
          // clear current if deleted
          const current = get().currentOrganization;
          if (current?.id === id) {
            set({ currentOrganization: null });
          }
        } catch (err: any) {
          set({ error: err.message || 'Failed to delete organization', isLoading: false });
          throw err;
        }
      },

      updateSettings: async (id, settings) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrg = await OrganizationService.updateSettings(id, settings);
          set((state) => ({
            organizations: state.organizations.map((org) =>
              org.id === id ? updatedOrg : org
            ),
            // Update current if it's the one modified
            currentOrganization:
              state.currentOrganization?.id === id
                ? updatedOrg
                : state.currentOrganization,
            isLoading: false,
          }));
        } catch (err: any) {
          set({ error: err.message || 'Failed to update settings', isLoading: false });
          throw err;
        }
      },
    }),
    {
      name: 'organization-storage',
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
      }),
    },
  ),
);

// Initialize HttpClient org header injection
// We can use the persisted state to initialize the header
// accessing the store outside of React components
httpClient.registerOrgIdHandlers(() => {
  const state = useOrganizationStore.getState();
  return state.currentOrganization?.id || null;
});
