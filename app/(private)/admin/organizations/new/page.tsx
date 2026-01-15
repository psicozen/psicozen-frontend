'use client';

import { SettingsForm } from '@/features/organizations/components/settings-form';

export default function NewOrganizationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Nova Organização</h1>
      </div>
      
      <SettingsForm mode="create" />
    </div>
  );
}
