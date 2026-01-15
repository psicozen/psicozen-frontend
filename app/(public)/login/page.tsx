import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { MagicLinkForm } from '@/features/auth/components/magic-link-form';

export const metadata = {
  title: 'Entrar | PsicoZen',
  description: 'Acesse sua conta PsicoZen',
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F6F2E8] px-4 font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 flex absolute top-10 left-10 items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
          <div className="flex justify-center mb-6">
            <Image
              src="/logo-psicozen.png"
              alt="PsicoZen"
              width={200}
              height={200}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </div>

        <MagicLinkForm />
      </div>
    </div>
  );
}
