'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';
import { useOrganizationStore } from '@/features/organizations/store';
import { RowActions } from '@/features/organizations/components/row-actions';

export default function OrganizationsPage() {
  const { organizations, isLoading, error, fetchOrganizations } = useOrganizationStore();

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  if (isLoading && organizations.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500">Erro ao carregar organizações: {error}</p>
        <Button onClick={() => fetchOrganizations()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Organização
          </Link>
        </Button>
      </div>

      <Card>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Slug</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tipo</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Criado em</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma organização encontrada.
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <tr key={org.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{org.name}</td>
                    <td className="p-4 align-middle">{org.slug}</td>
                    <td className="p-4 align-middle capitalize">
                      {org.type === 'company' ? 'Empresa' : org.type === 'department' ? 'Departamento' : 'Time'}
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {org.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {format(new Date(org.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="p-4 align-middle text-right">
                       <RowActions organization={org} onDelete={() => fetchOrganizations()} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
