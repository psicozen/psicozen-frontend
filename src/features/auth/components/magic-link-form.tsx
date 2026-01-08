/**
 * Magic Link Login Form
 * Passwordless authentication via email
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ApiError } from '@/lib/errors/api-error';

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export function MagicLinkForm() {
  const { sendMagicLink } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: MagicLinkFormData) => {
    try {
      await sendMagicLink(data);
      setEmailSent(true);
      toast.success('Magic link sent!', {
        description: 'Check your email for the login link',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error('Failed to send magic link', {
          description: error.message,
        });
      } else {
        toast.error('Something went wrong', {
          description: 'Please try again later',
        });
      }
    }
  };

  if (emailSent) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Check your email
        </h3>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          We've sent you a magic link to sign in. Click the link in your email to
          continue.
        </p>

        <Button
          variant="outline"
          fullWidth
          onClick={() => setEmailSent(false)}
        >
          Send another link
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Sign in with Magic Link
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Send Magic Link
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        We'll send you a secure link to sign in without a password
      </p>
    </div>
  );
}
