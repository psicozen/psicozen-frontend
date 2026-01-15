import { Role, EmociogramaPermissions } from '@/types/roles.types';

// MOCK implementation for UI development
export function usePermissions() {
  // Change this to test different roles during dev
  const currentRole = Role.ADMIN; 

  const hasRole = (role: Role) => currentRole === role;
  
  const hasAnyRole = (roles: Role[]) => roles.includes(currentRole);

  const hasPermission = (permission: EmociogramaPermissions) => true; // Grant all for dev

  return {
    hasRole,
    hasAnyRole,
    hasPermission,
    userRoles: [currentRole],
  };
}
