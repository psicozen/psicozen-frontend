/**
 * Magic Link Callback Page
 * Handles the redirect from Supabase magic link email
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth.store';
import { Spinner } from '@/shared/ui/spinner';
import type { User } from '@/types/auth.types';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from URL hash (Supabase automatically processes it)
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setIsProcessing(false);
          return;
        }

        if (!data.session) {
          // Check for error in URL hash
          const hash = window.location.hash;
          if (hash.includes('error=')) {
            const params = new URLSearchParams(hash.slice(1));
            const errorDesc =
              params.get('error_description') || 'Link inválido ou expirado';
            setError(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
          } else {
            setError('Sessão não encontrada. Por favor, tente novamente.');
          }
          setIsProcessing(false);
          return;
        }

        // Extract user from Supabase session
        const { session } = data;
        const supabaseUser = session.user;

        // Create User object for local store
        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: supabaseUser.user_metadata?.role,
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date(
            supabaseUser.updated_at || supabaseUser.created_at,
          ),
        };

        // Store user in Zustand (Supabase handles token storage)
        login(user);

        toast.success('Login realizado com sucesso!');
        router.replace('/dashboard/colaborador');
      } catch (err) {
        console.error('Callback error:', err);
        setError(
          'Falha ao processar autenticação. Por favor, tente novamente.',
        );
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [login, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F2E8] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/60 p-8 text-center shadow-xl backdrop-blur-md">
          <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900">
            Erro na autenticação
          </h2>
          <p className="mb-6 text-zinc-600">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary/90"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F2E8] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/60 p-8 text-center shadow-xl backdrop-blur-md">
          <div className="mb-6 flex justify-center">
            <Spinner size="lg" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900">
            Verificando seu acesso...
          </h2>
          <p className="text-zinc-600">
            Aguarde enquanto validamos suas credenciais.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
