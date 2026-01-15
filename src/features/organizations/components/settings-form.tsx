'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card } from '@/shared/ui/card';
import { Organization, OrganizationSettings, OrganizationType } from '../types';
import { useOrganizationStore } from '../store';

const settingsSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  type: z.enum(['company', 'department', 'team'] as const),
  settings: z.object({
    timezone: z.string().min(1, 'Fuso horário é obrigatório'),
    locale: z.string().min(1, 'Localidade é obrigatória'),
    emociogramaEnabled: z.boolean(),
    alertThreshold: z.number().min(1).max(10),
    dataRetentionDays: z.number().min(1).max(3650),
    anonymityDefault: z.boolean(),
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  organization?: Organization;
  mode: 'create' | 'edit';
}

export function SettingsForm({ organization, mode }: SettingsFormProps) {
  const router = useRouter();
  const createOrganization = useOrganizationStore((state) => state.createOrganization);
  const updateSettings = useOrganizationStore((state) => state.updateSettings);

  const defaultValues: SettingsFormValues = {
    name: organization?.name || '',
    type: organization?.type || 'company',
    settings: {
      timezone: organization?.settings?.timezone || 'America/Sao_Paulo',
      locale: organization?.settings?.locale || 'pt-BR',
      emociogramaEnabled: organization?.settings?.emociogramaEnabled ?? true,
      alertThreshold: organization?.settings?.alertThreshold ?? 6,
      dataRetentionDays: organization?.settings?.dataRetentionDays ?? 365,
      anonymityDefault: organization?.settings?.anonymityDefault ?? false,
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      if (mode === 'create') {
        await createOrganization(data);
        toast.success('Organização criada com sucesso');
        router.push('/admin/organizations');
      } else if (organization) {
        // Update functionality calls updateSettings which only updates the settings part usually
        // But here we are mixing Name update. Backend updateSettings only does settings.
        // Assuming there isn't a name update method yet, we will just update settings.
        // If name update is needed, backend should support it.
        await updateSettings(organization.id, data.settings);
        toast.success('Configurações atualizadas');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Informações Gerais</h3>
        
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Nome</label>
          <Input id="name" {...register('name')} disabled={mode === 'edit'} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          {mode === 'edit' && <p className="text-xs text-muted-foreground">O nome não pode ser alterado após a criação.</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="type" className="text-sm font-medium">Tipo</label>
          <select 
            id="type" 
            {...register('type')} 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={mode === 'edit'}
          >
            <option value="company">Empresa</option>
            <option value="department">Departamento</option>
            <option value="team">Time</option>
          </select>
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Configurações</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="timezone" className="text-sm font-medium">Fuso Horário</label>
            <Input id="timezone" {...register('settings.timezone')} />
            {errors.settings?.timezone && <p className="text-sm text-red-500">{errors.settings.timezone.message}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="locale" className="text-sm font-medium">Localidade</label>
            <Input id="locale" {...register('settings.locale')} />
            {errors.settings?.locale && <p className="text-sm text-red-500">{errors.settings.locale.message}</p>}
          </div>
        </div>

         <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="alertThreshold" className="text-sm font-medium">Limite de Alerta (1-10)</label>
            <Input 
              id="alertThreshold" 
              type="number" 
              {...register('settings.alertThreshold', { valueAsNumber: true })} 
            />
            {errors.settings?.alertThreshold && <p className="text-sm text-red-500">{errors.settings.alertThreshold.message}</p>}
          </div>
           <div className="grid gap-2">
            <label htmlFor="dataRetentionDays" className="text-sm font-medium">Retenção de Dados (Dias)</label>
            <Input 
              id="dataRetentionDays" 
              type="number" 
              {...register('settings.dataRetentionDays', { valueAsNumber: true })} 
            />
            {errors.settings?.dataRetentionDays && <p className="text-sm text-red-500">{errors.settings.dataRetentionDays.message}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="emociogramaEnabled" 
            {...register('settings.emociogramaEnabled')} 
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="emociogramaEnabled" className="text-sm font-medium">
            Habilitar Emociograma
          </label>
        </div>

         <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="anonymityDefault" 
            {...register('settings.anonymityDefault')} 
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="anonymityDefault" className="text-sm font-medium">
            Anonimato Padrão
          </label>
        </div>

      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (mode === 'create' ? 'Criar Organização' : 'Salvar Alterações')}
        </Button>
      </div>
    </form>
  );
}
