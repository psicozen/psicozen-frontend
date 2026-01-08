/**
 * Environment Configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'PsicoZen',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
