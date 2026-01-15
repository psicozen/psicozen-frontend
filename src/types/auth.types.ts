/**
 * Authentication Types
 */

export interface User {
  id: string;
  email: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MagicLinkRequest {
  email: string;
  redirectTo?: string;
}

export interface MagicLinkVerification {
  token_hash: string;
  type: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
