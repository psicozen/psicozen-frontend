/**
 * Login Page
 * Authentication page with Magic Link
 * Server Component - only MagicLinkForm is client-side
 */

import { MagicLinkForm } from '@/features/auth/components/magic-link-form';

export const metadata = {
  title: 'Sign In | PsicoZen',
  description: 'Sign in to your PsicoZen account using magic link',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to PsicoZen
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Your mental health companion
          </p>
        </div>

        <MagicLinkForm />
      </div>
    </div>
  );
}
