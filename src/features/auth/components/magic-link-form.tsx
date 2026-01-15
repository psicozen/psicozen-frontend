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
      toast.success('Link mágico enviado!', {
        description: 'Verifique seu e-mail para acessar o sistema',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error('Falha ao enviar link', {
          description: error.message,
        });
      } else {
        toast.error('Algo deu errado', {
          description: 'Por favor, tente novamente mais tarde',
        });
      }
    }
  };

  if (emailSent) {
    return (
      <div className="rounded-2xl border border-white/40 bg-white/60 p-8 shadow-sm backdrop-blur-md">
        <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary">
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="mb-2 text-center text-xl font-bold text-zinc-900">
          Verifique seu e-mail
        </h3>
        <p className="mb-6 text-center text-zinc-600">
          Enviamos um link mágico para você entrar. Clique no link recebido para continuar.
        </p>

        <Button
          variant="outline"
          className="w-full border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => setEmailSent(false)}
        >
          Enviar outro link
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur-md">
      <h2 className="mb-2 text-2xl font-bold text-zinc-900">
        Bem-vindo de volta
      </h2>
      <p className="mb-8 text-zinc-600">
        Digite seu e-mail para receber um link de acesso sem senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail Corporativo"
          type="email"
          placeholder="voce@empresa.com"
          error={errors.email?.message}
          required
          {...register('email')}
          className="bg-white/80 border-zinc-200 focus:border-primary focus:ring-primary/20"
        />

        <Button 
          type="submit" 
          className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 h-11" 
          isLoading={isSubmitting}
        >
          Enviar Link Mágico
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </div>
  );
}
