'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

import { SettingsForm } from '@/features/organizations/components/settings-form';
import { useOrganizationStore } from '@/features/organizations/store';
import { OrganizationService } from '@/features/organizations/service';
import { Organization } from '@/features/organizations/types';
import { Spinner } from '@/shared/ui/spinner';
import { Button } from '@/shared/ui/button';

export default function OrganizationSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganization() {
      try {
        const data = await OrganizationService.getById(id);
        setOrganization(data);
      } catch (err) {
        console.error(err);
        setError('Falha ao carregar organização');
      } finally {
        setLoading(false);
      }
    }

    loadOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500">{error || 'Organização não encontrada'}</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar Organização</h1>
      </div>
      
      <SettingsForm mode="edit" organization={organization} />
    </div>
  );
}
