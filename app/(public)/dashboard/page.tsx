/**
 * Dashboard Page
 * Protected route - requires authentication
 */

'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">PsicoZen</h1>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome, {user?.email}
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Here's your dashboard overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Stats
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Your analytics will appear here
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              No recent activity
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-foreground">
              Get Started
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Explore features and start your journey
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
