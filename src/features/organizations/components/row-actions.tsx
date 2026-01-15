'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Organization } from '../types';
import { useOrganizationStore } from '../store';
import { Button } from '@/shared/ui/button';

interface RowActionsProps {
  organization: Organization;
  onDelete?: () => void;
}

export function RowActions({ organization, onDelete }: RowActionsProps) {
  const router = useRouter();
  const deleteOrganization = useOrganizationStore((state) => state.deleteOrganization);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta organização?')) return;

    setIsDeleting(true);
    try {
      await deleteOrganization(organization.id);
      toast.success('Organização excluída com sucesso');
      onDelete?.();
    } catch (error) {
      toast.error('Erro ao excluir organização');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <Link href={`/admin/organizations/${organization.id}/settings`}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Excluir</span>
      </Button>
    </div>
  );
}
