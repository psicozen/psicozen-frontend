/**
 * Environment Configuration
 * Centralized access to environment variables with type safety
 *
 * Note: API URL is not exposed here anymore. The frontend uses
 * /api/backend/* proxy routes for all backend communication.
 */

export const env = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'PsicoZen',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
