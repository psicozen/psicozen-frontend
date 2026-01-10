# Marco 6: Exportação e LGPD - Interface

**Cronograma:** Semana 4-5
**Dependências Frontend:** Marco 3 (Interface Emociograma)
**Dependências Backend:** ⚠️ Backend Marco 5 (Export endpoints) + Backend Marco 6 (LGPD endpoints)
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Implementar funcionalidades de exportação de dados (CSV/Excel) e conformidade com LGPD (exportação de dados pessoais, anonimização, exclusão). Interface acessível para colaboradores exercerem seus direitos e para gestores/admins exportarem relatórios.

**Entregável Principal:** Usuários podem exportar seus dados e exercer direitos LGPD. Gestores/Admins podem exportar relatórios.

---

## ⚠️ Dependências do Backend (OBRIGATÓRIAS)

Antes de iniciar este marco, os seguintes backends devem estar completos:

**Backend Marco 5 (Export):**
- ✅ `GET /emociograma/export` - Export CSV/Excel com filtros
- ✅ Headers corretos: `Content-Type`, `Content-Disposition`
- ✅ Suporte a formatos: CSV, Excel, JSON

**Backend Marco 6 (LGPD):**
- ✅ `GET /users/data-export` - Export de dados pessoais
- ✅ `POST /users/data-anonymize` - Anonimizar dados
- ✅ `DELETE /users/data-deletion` - Solicitar exclusão
- ✅ DTOs: `UserDataExport` com profile + submissions

---

## Detalhamento de Tarefas

### Tarefa 6.1: Criar Export Service

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M5 (Export endpoints)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/services/export.service.ts`
- [ ] Implementar métodos:
  - [ ] `exportTeamData()` - Export dados da equipe (CSV/Excel)
  - [ ] `exportOrganizationData()` - Export dados da org (CSV/Excel)
  - [ ] `downloadFile()` - Helper para download de blob
- [ ] Tratar diferentes formatos (CSV, Excel, JSON)
- [ ] Criar `export.service.test.ts`

**Service Code:**
```typescript
// src/features/emociograma/services/export.service.ts

import { httpClient } from '@/lib/http/client';
import { ReportFilters } from '@/types/reports.types';

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json',
}

export class ExportService {
  /**
   * Export dados da equipe (Gestor)
   * 🔗 Backend: GET /emociograma/export
   */
  async exportTeamData(filters: ReportFilters, format: ExportFormat = ExportFormat.CSV): Promise<void> {
    try {
      const params = {
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        department: filters.department,
        team: filters.team,
        categoryId: filters.categoryId,
        format,
      };

      // Usar httpClient mas com responseType blob
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emociograma/export?${new URLSearchParams(params)}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'x-organization-id': getOrganizationId(),
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const filename = `emociograma_equipe_${format}.${format}`;

      this.downloadFile(blob, filename);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      throw error;
    }
  }

  /**
   * Export dados da organização (Admin)
   * 🔗 Backend: GET /emociograma/export
   */
  async exportOrganizationData(filters: ReportFilters, format: ExportFormat = ExportFormat.CSV): Promise<void> {
    // Implementação similar a exportTeamData
    // (Admin pode exportar todos os dados)
  }

  /**
   * Helper para download de arquivo blob
   */
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();

// Helper functions (assumindo que tokens estão no cookie ou store)
function getAccessToken(): string {
  // Implementar: pegar do cookie ou auth store
  return '';
}

function getOrganizationId(): string {
  // Implementar: pegar do organization store
  return '';
}
```

**Critérios de Aceite:**
- ✅ Service implementado
- ✅ Download de arquivo funciona
- ✅ Suporta CSV e Excel
- ✅ Testes com ≥80% cobertura

---

### Tarefa 6.2: Criar Component - ExportButton

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M5 (Export endpoint)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/export-button.tsx`
- [ ] Dropdown para selecionar formato (CSV, Excel, JSON)
- [ ] Loading state durante download
- [ ] Toast de sucesso/erro
- [ ] Verificar permissão antes de mostrar
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/export-button.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Download, FileSpreadsheet, FileJson } from 'lucide-react';
import { exportService, ExportFormat } from '../services/export.service';
import { ReportFilters } from '@/types/reports.types';
import { toast } from 'sonner';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { EmociogramaPermissions } from '@/types/roles.types';

interface ExportButtonProps {
  filters: ReportFilters;
  scope: 'team' | 'organization';
}

export function ExportButton({ filters, scope }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { hasPermission } = usePermissions();

  const canExport =
    scope === 'team'
      ? hasPermission(EmociogramaPermissions.EXPORT_TEAM_DATA)
      : hasPermission(EmociogramaPermissions.EXPORT_ALL_DATA);

  if (!canExport) {
    return null;
  }

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      if (scope === 'team') {
        await exportService.exportTeamData(filters, format);
      } else {
        await exportService.exportOrganizationData(filters, format);
      }

      toast.success(`Dados exportados em ${format.toUpperCase()} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao exportar dados. Tente novamente.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowMenu(!showMenu)}
        isLoading={isExporting}
        className="inline-flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar Dados
      </Button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleExport(ExportFormat.CSV)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Exportar CSV</span>
          </button>

          <button
            onClick={() => handleExport(ExportFormat.EXCEL)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Exportar Excel</span>
          </button>

          <button
            onClick={() => handleExport(ExportFormat.JSON)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
          >
            <FileJson className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">Exportar JSON</span>
          </button>
        </div>
      )}
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Dropdown com formatos
- ✅ Download funciona
- ✅ Verificação de permissão
- ✅ Testes com ≥80% cobertura

---

### Tarefa 6.3: Criar LGPD Service

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M6 (LGPD endpoints)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/users/services/lgpd.service.ts`
- [ ] Implementar métodos:
  - [ ] `exportMyData()` - Export dados pessoais
  - [ ] `anonymizeMyData()` - Anonimizar submissões
  - [ ] `requestDataDeletion()` - Solicitar exclusão
- [ ] Criar teste

**Service Code:**
```typescript
// src/features/users/services/lgpd.service.ts

import { httpClient } from '@/lib/http/client';

export interface UserDataExport {
  profile: {
    email: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    team?: string;
  };
  submissions: any[]; // Todas as submissões do usuário
  exportedAt: Date;
}

export class LGPDService {
  /**
   * Exportar meus dados pessoais (LGPD - Direito à Portabilidade)
   * 🔗 Backend: GET /users/data-export
   */
  async exportMyData(): Promise<UserDataExport> {
    const response = await httpClient.get<UserDataExport>('/users/data-export');

    if (!response.success) {
      throw new Error('Erro ao exportar dados');
    }

    return response.data;
  }

  /**
   * Anonimizar meus dados (LGPD - Anonimização)
   * 🔗 Backend: POST /users/data-anonymize
   */
  async anonymizeMyData(): Promise<void> {
    const response = await httpClient.post('/users/data-anonymize', {});

    if (!response.success) {
      throw new Error('Erro ao anonimizar dados');
    }
  }

  /**
   * Solicitar exclusão de dados (LGPD - Direito ao Esquecimento)
   * 🔗 Backend: DELETE /users/data-deletion
   */
  async requestDataDeletion(): Promise<void> {
    const response = await httpClient.delete('/users/data-deletion');

    if (!response.success) {
      throw new Error('Erro ao solicitar exclusão de dados');
    }
  }

  /**
   * Download de arquivo JSON com dados exportados
   */
  downloadDataExport(data: UserDataExport): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meus_dados_psicozen_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const lgpdService = new LGPDService();
```

**Critérios de Aceite:**
- ✅ Service implementado
- ✅ Download de JSON funciona
- ✅ Testes com ≥80% cobertura

---

### Tarefa 6.4: Criar Component - LGPDDataExport

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M6 - `GET /users/data-export`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/users/components/lgpd-data-export.tsx`
- [ ] Card explicando direito à portabilidade
- [ ] Botão "Exportar Meus Dados"
- [ ] Loading state
- [ ] Toast de sucesso com download automático
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/users/components/lgpd-data-export.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Download, FileText } from 'lucide-react';
import { lgpdService } from '../services/lgpd.service';
import { toast } from 'sonner';

export function LGPDDataExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const data = await lgpdService.exportMyData();
      lgpdService.downloadDataExport(data);
      toast.success('Seus dados foram exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar dados. Tente novamente.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Exportar Meus Dados</h3>
          <p className="text-sm text-gray-600 mb-4">
            De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito de obter uma cópia
            de todos os seus dados armazenados no sistema. O arquivo será baixado em formato JSON.
          </p>

          <p className="text-sm text-gray-600 mb-4">
            <strong>O que será exportado:</strong>
          </p>
          <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
            <li>Informações do perfil (nome, email, departamento)</li>
            <li>Todas as suas submissões de emociograma</li>
            <li>Preferências e configurações</li>
          </ul>

          <Button
            variant="primary"
            onClick={handleExport}
            isLoading={isExporting}
            className="inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar Agora'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

**Critérios de Aceite:**
- ✅ Card explica direito LGPD
- ✅ Download funciona
- ✅ JSON gerado corretamente
- ✅ Testes com ≥80% cobertura

---

### Tarefa 6.5: Criar Component - LGPDDataAnonymization

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M6 - `POST /users/data-anonymize`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/users/components/lgpd-data-anonymization.tsx`
- [ ] Card explicando anonimização
- [ ] Modal de confirmação (ação irreversível)
- [ ] Botão "Anonimizar Meus Dados"
- [ ] Warning sobre consequências
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/users/components/lgpd-data-anonymization.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { EyeOff, AlertTriangle } from 'lucide-react';
import { lgpdService } from '../services/lgpd.service';
import { toast } from 'sonner';

export function LGPDDataAnonymization() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAnonymizing, setIsAnonymizing] = useState(false);

  const handleAnonymize = async () => {
    setIsAnonymizing(true);

    try {
      await lgpdService.anonymizeMyData();
      toast.success('Seus dados foram anonimizados com sucesso!');
      setShowConfirmModal(false);

      // Reload para atualizar dados
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Erro ao anonimizar dados. Tente novamente.');
      console.error(error);
    } finally {
      setIsAnonymizing(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <EyeOff className="h-6 w-6 text-yellow-600" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonimizar Meus Dados</h3>
            <p className="text-sm text-gray-600 mb-4">
              Você pode solicitar a anonimização de todas as suas submissões de emociograma.
              Seus registros permanecerão no sistema para fins estatísticos, mas sua identidade
              será removida.
            </p>

            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Esta ação é irreversível. Uma vez anonimizados, seus dados
                não poderão ser recuperados ou identificados novamente.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(true)}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              Anonimizar Meus Dados
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Anonimização
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Você tem certeza que deseja anonimizar todos os seus dados? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md mb-6">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p><strong>Consequências:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Todas as suas submissões serão marcadas como anônimas</li>
                  <li>Comentários serão removidos</li>
                  <li>Gestores não poderão identificar suas submissões</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
                disabled={isAnonymizing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleAnonymize}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                isLoading={isAnonymizing}
              >
                Confirmar Anonimização
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

**Critérios de Aceite:**
- ✅ Card explica anonimização
- ✅ Modal de confirmação
- ✅ Ação funciona
- ✅ Warnings claros
- ✅ Testes com ≥80% cobertura

---

### Tarefa 6.6: Criar Component - LGPDDataDeletion

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M6 - `DELETE /users/data-deletion`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/users/components/lgpd-data-deletion.tsx`
- [ ] Card explicando direito ao esquecimento
- [ ] Modal de confirmação dupla (ação muito crítica)
- [ ] Input de confirmação (digitar "EXCLUIR")
- [ ] Email de confirmação enviado pelo backend
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/users/components/lgpd-data-deletion.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { lgpdService } from '../services/lgpd.service';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function LGPDDataDeletion() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { logout } = useAuth();

  const handleDelete = async () => {
    if (confirmText !== 'EXCLUIR') {
      toast.error('Digite "EXCLUIR" para confirmar');
      return;
    }

    setIsDeleting(true);

    try {
      await lgpdService.requestDataDeletion();
      toast.success('Solicitação de exclusão enviada. Você receberá um email de confirmação.');

      // Fazer logout após solicitar exclusão
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (error) {
      toast.error('Erro ao solicitar exclusão. Tente novamente.');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="p-6 border-red-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-red-100 rounded-lg">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Excluir Meus Dados</h3>
            <p className="text-sm text-gray-600 mb-4">
              De acordo com a LGPD, você tem o direito de solicitar a exclusão permanente de todos
              os seus dados pessoais do sistema (Direito ao Esquecimento).
            </p>

            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p><strong>ATENÇÃO: Esta ação é permanente e irreversível!</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Todos os seus dados serão excluídos permanentemente</li>
                  <li>Você não poderá mais acessar o sistema</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(true)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Solicitar Exclusão de Dados
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4 p-4 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-red-900">
                Confirmar Exclusão Permanente
              </h3>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Esta é uma ação <strong>irreversível</strong>. Todos os seus dados serão excluídos
              permanentemente do sistema. Você receberá um email de confirmação final antes da
              exclusão ser processada.
            </p>

            <div className="mb-6">
              <label htmlFor="confirm-text" className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar, digite <strong>EXCLUIR</strong> no campo abaixo:
              </label>
              <input
                type="text"
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Digite EXCLUIR"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmText('');
                }}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
                isLoading={isDeleting}
                disabled={confirmText !== 'EXCLUIR'}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

**Critérios de Aceite:**
- ✅ Card explica direito ao esquecimento
- ✅ Confirmação dupla
- ✅ Input de confirmação funciona
- ✅ Logout após exclusão
- ✅ Testes com ≥80% cobertura

---

### Tarefa 6.7: Criar Página - Configurações de Privacidade

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M6 completo (todos endpoints LGPD)

**Subtarefas:**
- [ ] Criar arquivo: `app/dashboard/configuracoes/privacidade/page.tsx`
- [ ] Renderizar `<LGPDDataExport>`
- [ ] Renderizar `<LGPDDataAnonymization>`
- [ ] Renderizar `<LGPDDataDeletion>`
- [ ] Adicionar link para política de privacidade
- [ ] Acessível para TODOS os roles

**Page Code:**
```typescript
// app/dashboard/configuracoes/privacidade/page.tsx

import { LGPDDataExport } from '@/features/users/components/lgpd-data-export';
import { LGPDDataAnonymization } from '@/features/users/components/lgpd-data-anonymization';
import { LGPDDataDeletion } from '@/features/users/components/lgpd-data-deletion';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacySettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Privacidade e Dados</h1>
        <p className="mt-2 text-gray-600">
          Gerencie seus dados pessoais de acordo com a LGPD (Lei Geral de Proteção de Dados)
        </p>
      </div>

      {/* Informações LGPD */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Seus direitos sob a LGPD:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Direito à Portabilidade:</strong> Obter cópia dos seus dados</li>
            <li><strong>Direito à Anonimização:</strong> Remover sua identidade dos registros</li>
            <li><strong>Direito ao Esquecimento:</strong> Excluir permanentemente seus dados</li>
          </ul>
          <Link href="/politica-privacidade" className="text-blue-700 underline mt-2 inline-block">
            Leia nossa Política de Privacidade completa
          </Link>
        </div>
      </div>

      {/* Exportar Dados */}
      <LGPDDataExport />

      {/* Anonimizar Dados */}
      <LGPDDataAnonymization />

      {/* Excluir Dados */}
      <LGPDDataDeletion />
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Página lista todas as opções LGPD
- ✅ Informações claras sobre direitos
- ✅ Link para política de privacidade
- ✅ Acessível para todos os usuários

---

### Tarefa 6.8: Adicionar Export Button nos Relatórios

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M5 (Export endpoint)

**Subtarefas:**
- [ ] Atualizar `app/dashboard/relatorios/equipe/page.tsx`
- [ ] Atualizar `app/dashboard/relatorios/organizacao/page.tsx`
- [ ] Adicionar `<ExportButton>` no header de cada página
- [ ] Passar filtros atuais para export
- [ ] Criar teste de integração

**Page Update:**
```typescript
// app/dashboard/relatorios/equipe/page.tsx (ADICIONAR)

import { ExportButton } from '@/features/emociograma/components/export-button';

export default function TeamReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  return (
    <ProtectedRoute requiredRoles={[Role.GESTOR, Role.ADMIN]}>
      <div className="space-y-6">
        {/* Header com Export */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios da Equipe</h1>
          <ExportButton filters={filters} scope="team" />
        </div>

        {/* Resto da página */}
      </div>
    </ProtectedRoute>
  );
}
```

**Critérios de Aceite:**
- ✅ Botão de export adicionado
- ✅ Filtros passados corretamente
- ✅ Download funciona

---

## Definição de Pronto

Marco 6 está completo quando:

- ✅ **Types:** Types de LGPD criados
- ✅ **Services:** ExportService e LGPDService implementados
- ✅ **Components:** Export button, LGPD cards criados
- ✅ **Pages:** Página de privacidade funcional
- ✅ **Integration:** Export integrado nas páginas de relatórios
- ✅ **Tests:** Cobertura ≥80% (unit tests)
- ✅ **Backend Integration:** ⚠️ Backend M5 e M6 completos

---

## Dependências Backend CRÍTICAS

| Tarefa Frontend | Endpoint Backend Necessário | Backend Milestone |
|-----------------|----------------------------|-------------------|
| 6.1 Export Service | `GET /emociograma/export` | Backend M5 |
| 6.3 LGPD Service | `GET /users/data-export` | Backend M6 |
| 6.3 LGPD Service | `POST /users/data-anonymize` | Backend M6 |
| 6.3 LGPD Service | `DELETE /users/data-deletion` | Backend M6 |
| 6.4 Data Export | `UserDataExport` DTO | Backend M6 |

---

## Recursos

- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [File Download com Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [Sonner Toast](https://sonner.emilkowal.ski/)
