# Marco 5: Sistema de Alertas - Interface

**Cronograma:** Semana 4
**Dependências Frontend:** Marco 2 (Roles System)
**Dependências Backend:** ⚠️ Backend Marco 4 (Alert System completo)
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Criar interface para Gestores e Admins visualizarem, gerenciarem e resolverem alertas emocionais. Dashboard de alertas com filtros, notificações em tempo real e rastreamento de resolução.

**Entregável Principal:** Gestores recebem e gerenciam alertas de colaboradores com emoções negativas (≥6).

---

## ⚠️ Dependências do Backend (OBRIGATÓRIAS)

Antes de iniciar este marco, o **Backend Marco 4** deve estar completo com:
- ✅ `GET /alerts/dashboard` - Dashboard de alertas
- ✅ `GET /alerts` - Listar alertas com filtros
- ✅ `PATCH /alerts/:id/resolve` - Resolver alerta
- ✅ `GET /alerts/:id` - Detalhes do alerta
- ✅ Tabela `emociograma_alerts` com campos: severity, is_resolved, resolution_notes

---

## Detalhamento de Tarefas

### Tarefa 5.1: Criar Types - Alerts

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Backend M4 (Alert entity)

**Subtarefas:**
- [ ] Criar arquivo: `src/types/alerts.types.ts`
- [ ] Definir interface `EmociogramaAlert` correspondente ao backend
- [ ] Definir enum `AlertSeverity`
- [ ] Definir enum `AlertType`
- [ ] Criar interface `AlertDashboardResponse`

**Types Code:**
```typescript
// src/types/alerts.types.ts

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertType {
  THRESHOLD_EXCEEDED = 'threshold_exceeded',
  PATTERN_DETECTED = 'pattern_detected',
}

export interface EmociogramaAlert {
  id: string;
  organizationId: string;
  submissionId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  notifiedUsers: string[];
  notificationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertDashboardResponse {
  unresolvedCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  recentAlerts: EmociogramaAlert[];
  resolutionRate: number; // % de alertas resolvidos
}

export interface ResolveAlertData {
  notes?: string;
}
```

**Critérios de Aceite:**
- ✅ Types correspondem ao backend
- ✅ Enums definidos corretamente
- ✅ Interfaces completas

---

### Tarefa 5.2: Criar Alerts Service

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M4 completo (endpoints de alertas)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/services/alerts.service.ts`
- [ ] Implementar métodos:
  - [ ] `getDashboard()` - Dashboard de alertas
  - [ ] `getAlerts()` - Listar com paginação e filtros
  - [ ] `getAlertById()` - Detalhes
  - [ ] `resolveAlert()` - Marcar como resolvido
- [ ] Criar `alerts.service.test.ts`

**Service Code:**
```typescript
// src/features/emociograma/services/alerts.service.ts

import { httpClient } from '@/lib/http/client';
import { EmociogramaAlert, AlertDashboardResponse, ResolveAlertData } from '@/types/alerts.types';
import { PaginatedResult } from '@/types/api.types';

export class AlertsService {
  private baseUrl = '/alerts';

  /**
   * Obter dashboard de alertas
   * 🔗 Backend: GET /alerts/dashboard
   */
  async getDashboard(): Promise<AlertDashboardResponse> {
    const response = await httpClient.get<AlertDashboardResponse>(`${this.baseUrl}/dashboard`);

    if (!response.success) {
      throw new Error('Erro ao buscar dashboard de alertas');
    }

    return response.data;
  }

  /**
   * Listar alertas com filtros
   * 🔗 Backend: GET /alerts
   */
  async getAlerts(
    page: number = 1,
    limit: number = 10,
    filters?: { resolved?: boolean; severity?: string },
  ): Promise<PaginatedResult<EmociogramaAlert>> {
    const response = await httpClient.get<PaginatedResult<EmociogramaAlert>>(this.baseUrl, {
      params: { page, limit, ...filters },
    });

    if (!response.success) {
      throw new Error('Erro ao buscar alertas');
    }

    return response.data;
  }

  /**
   * Obter detalhes de alerta por ID
   * 🔗 Backend: GET /alerts/:id
   */
  async getAlertById(id: string): Promise<EmociogramaAlert> {
    const response = await httpClient.get<EmociogramaAlert>(`${this.baseUrl}/${id}`);

    if (!response.success) {
      throw new Error('Alerta não encontrado');
    }

    return response.data;
  }

  /**
   * Resolver alerta
   * 🔗 Backend: PATCH /alerts/:id/resolve
   */
  async resolveAlert(id: string, data: ResolveAlertData): Promise<EmociogramaAlert> {
    const response = await httpClient.patch<EmociogramaAlert>(`${this.baseUrl}/${id}/resolve`, data);

    if (!response.success) {
      throw new Error('Erro ao resolver alerta');
    }

    return response.data;
  }
}

export const alertsService = new AlertsService();
```

**Critérios de Aceite:**
- ✅ Service implementado
- ✅ Todos os métodos funcionais
- ✅ Testes com ≥80% cobertura

---

### Tarefa 5.3: Criar Component - AlertDashboardCards

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M4 - `GET /alerts/dashboard`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/alert-dashboard-cards.tsx`
- [ ] Cards de KPI: Total Não Resolvidos, Críticos, Altos, Taxa Resolução
- [ ] Cores por severidade (crítico = vermelho, alto = laranja, etc.)
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/alert-dashboard-cards.tsx

import { AlertDashboardResponse } from '@/types/alerts.types';
import { Card } from '@/shared/ui/card';
import { AlertTriangle, AlertCircle, Bell, CheckCircle2 } from 'lucide-react';

interface AlertDashboardCardsProps {
  dashboard: AlertDashboardResponse;
}

export function AlertDashboardCards({ dashboard }: AlertDashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Não Resolvidos */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Bell className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Alertas Ativos</p>
            <p className="text-2xl font-bold text-gray-900">{dashboard.unresolvedCount}</p>
          </div>
        </div>
      </Card>

      {/* Críticos */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Críticos</p>
            <p className="text-2xl font-bold text-red-600">{dashboard.criticalCount}</p>
            <p className="text-xs text-gray-500">Nível ≥ 9</p>
          </div>
        </div>
      </Card>

      {/* Altos */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Alta Prioridade</p>
            <p className="text-2xl font-bold text-orange-600">{dashboard.highCount}</p>
            <p className="text-xs text-gray-500">Nível 7-8</p>
          </div>
        </div>
      </Card>

      {/* Taxa de Resolução */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Taxa Resolução</p>
            <p className="text-2xl font-bold text-green-600">{dashboard.resolutionRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Cards renderizam estatísticas
- ✅ Cores por severidade
- ✅ Design responsivo

---

### Tarefa 5.4: Criar Component - AlertsList

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 5 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M4 - `GET /alerts` com paginação

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/alerts-list.tsx`
- [ ] Listar alertas com paginação
- [ ] Badge de severidade com cores
- [ ] Botão "Resolver" em cada alerta
- [ ] Modal de resolução com campo de notas
- [ ] Filtros: resolvido/não resolvido, severidade
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/alerts-list.tsx

'use client';

import { useState } from 'react';
import { EmociogramaAlert, AlertSeverity } from '@/types/alerts.types';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { alertsService } from '../services/alerts.service';
import { ResolveAlertModal } from './resolve-alert-modal';

interface AlertsListProps {
  alerts: EmociogramaAlert[];
  onAlertResolved?: () => void;
}

export function AlertsList({ alerts, onAlertResolved }: AlertsListProps) {
  const [selectedAlert, setSelectedAlert] = useState<EmociogramaAlert | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const getSeverityBadge = (severity: AlertSeverity) => {
    const badges = {
      [AlertSeverity.CRITICAL]: 'bg-red-100 text-red-800 border-red-200',
      [AlertSeverity.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [AlertSeverity.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [AlertSeverity.LOW]: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const labels = {
      [AlertSeverity.CRITICAL]: 'Crítico',
      [AlertSeverity.HIGH]: 'Alto',
      [AlertSeverity.MEDIUM]: 'Médio',
      [AlertSeverity.LOW]: 'Baixo',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${badges[severity]}`}>
        {labels[severity]}
      </span>
    );
  };

  const handleResolve = async (alertId: string, notes?: string) => {
    setIsResolving(true);

    try {
      await alertsService.resolveAlert(alertId, { notes });
      toast.success('Alerta resolvido com sucesso!');
      setSelectedAlert(null);
      onAlertResolved?.();
    } catch (error) {
      toast.error('Erro ao resolver alerta');
      console.error(error);
    } finally {
      setIsResolving(false);
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Nenhum alerta ativo no momento!</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="p-6">
            <div className="flex items-start gap-4">
              {/* Ícone de Severidade */}
              <div className="flex-shrink-0">
                <AlertTriangle
                  className={`h-6 w-6 ${
                    alert.severity === AlertSeverity.CRITICAL
                      ? 'text-red-600'
                      : alert.severity === AlertSeverity.HIGH
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}
                />
              </div>

              {/* Detalhes */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getSeverityBadge(alert.severity)}

                  <span className="text-sm text-gray-500">
                    {format(new Date(alert.createdAt), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </span>

                  {alert.isResolved && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolvido
                    </span>
                  )}
                </div>

                <p className="text-gray-900 mb-2">{alert.message}</p>

                {alert.isResolved && alert.resolutionNotes && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-900 mb-1">Resolução:</p>
                    <p className="text-sm text-green-700">{alert.resolutionNotes}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Resolvido em {format(new Date(alert.resolvedAt!), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>

              {/* Ações */}
              {!alert.isResolved && (
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    Resolver
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Resolução */}
      {selectedAlert && (
        <ResolveAlertModal
          alert={selectedAlert}
          onResolve={(notes) => handleResolve(selectedAlert.id, notes)}
          onClose={() => setSelectedAlert(null)}
          isLoading={isResolving}
        />
      )}
    </>
  );
}
```

**Critérios de Aceite:**
- ✅ Lista renderiza alertas
- ✅ Badge de severidade com cores
- ✅ Botão resolver funciona
- ✅ Empty state
- ✅ Testes com ≥80% cobertura

---

### Tarefa 5.5: Criar Component - ResolveAlertModal

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma (apenas UI)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/resolve-alert-modal.tsx`
- [ ] Modal com campo de notas de resolução (textarea)
- [ ] Botão "Confirmar Resolução"
- [ ] Validação (notas opcionais mas recomendadas)
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/resolve-alert-modal.tsx

'use client';

import { useState } from 'react';
import { EmociogramaAlert } from '@/types/alerts.types';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { X } from 'lucide-react';

interface ResolveAlertModalProps {
  alert: EmociogramaAlert;
  onResolve: (notes?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function ResolveAlertModal({ alert, onResolve, onClose, isLoading }: ResolveAlertModalProps) {
  const [notes, setNotes] = useState('');

  const handleResolve = () => {
    onResolve(notes || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resolver Alerta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mensagem do Alerta */}
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">{alert.message}</p>
        </div>

        {/* Campo de Notas */}
        <div className="mb-6">
          <label htmlFor="resolution-notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notas de Resolução (opcional)
          </label>
          <Textarea
            id="resolution-notes"
            placeholder="Ex: Conversei com o colaborador, situação está sendo acompanhada..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">{notes.length}/500 caracteres</p>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleResolve}
            className="flex-1"
            isLoading={isLoading}
          >
            Confirmar Resolução
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Modal renderiza
- ✅ Campo de notas funciona
- ✅ Callback onResolve chamado
- ✅ Testes com ≥80% cobertura

---

### Tarefa 5.6: Criar Página - Alertas Dashboard

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M4 completo (todos endpoints de alertas)

**Subtarefas:**
- [ ] Criar arquivo: `app/dashboard/alertas/page.tsx`
- [ ] Renderizar `<AlertDashboardCards>`
- [ ] Renderizar `<AlertsList>`
- [ ] Tabs: "Não Resolvidos" e "Todos"
- [ ] Auto-refresh a cada 30 segundos
- [ ] Proteger com role GESTOR/ADMIN

**Page Code:**
```typescript
// app/dashboard/alertas/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/shared/components/protected-route';
import { Role } from '@/types/roles.types';
import { AlertDashboardCards } from '@/features/emociograma/components/alert-dashboard-cards';
import { AlertsList } from '@/features/emociograma/components/alerts-list';
import { alertsService } from '@/features/emociograma/services/alerts.service';
import { EmociogramaAlert, AlertDashboardResponse } from '@/types/alerts.types';
import { Loader2 } from 'lucide-react';

export default function AlertasPage() {
  const [dashboard, setDashboard] = useState<AlertDashboardResponse | null>(null);
  const [alerts, setAlerts] = useState<EmociogramaAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'unresolved' | 'all'>('unresolved');

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const [dashboardData, alertsData] = await Promise.all([
        alertsService.getDashboard(),
        alertsService.getAlerts(1, 20, {
          resolved: activeTab === 'unresolved' ? false : undefined,
        }),
      ]);

      setDashboard(dashboardData);
      setAlerts(alertsData.data);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <ProtectedRoute requiredRoles={[Role.GESTOR, Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Alertas Emocionais</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {dashboard && <AlertDashboardCards dashboard={dashboard} />}

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('unresolved')}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${activeTab === 'unresolved' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                Não Resolvidos ({dashboard?.unresolvedCount || 0})
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                Todos os Alertas
              </button>
            </div>

            {/* Lista de Alertas */}
            <AlertsList alerts={alerts} onAlertResolved={fetchData} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

**Critérios de Aceite:**
- ✅ Página protegida por role
- ✅ Dashboard cards e lista renderizados
- ✅ Auto-refresh funciona
- ✅ Tabs filtram alertas
- ✅ Resolução funciona

---

### Tarefa 5.7: Criar Notificação Toast - Novo Alerta

**Prioridade:** 🟢 Média
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Backend M4 (webhooks ou polling)

**Subtarefas:**
- [ ] Criar hook: `src/features/emociograma/hooks/use-alert-notifications.ts`
- [ ] Polling a cada 60 segundos para novos alertas
- [ ] Toast quando novo alerta detectado
- [ ] Som de notificação (opcional)
- [ ] Contador de alertas não lidos no menu
- [ ] Criar teste

**Hook Code:**
```typescript
// src/features/emociograma/hooks/use-alert-notifications.ts

'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { alertsService } from '../services/alerts.service';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role } from '@/types/roles.types';

export function useAlertNotifications() {
  const { hasAnyRole } = usePermissions();
  const lastCheckRef = useRef<Date>(new Date());

  useEffect(() => {
    // Apenas para Gestores e Admins
    if (!hasAnyRole([Role.GESTOR, Role.ADMIN])) {
      return;
    }

    const checkNewAlerts = async () => {
      try {
        const dashboard = await alertsService.getDashboard();

        // Se há alertas não resolvidos, mostrar notificação
        if (dashboard.unresolvedCount > 0) {
          toast.warning(`Você tem ${dashboard.unresolvedCount} alerta(s) ativo(s)`, {
            action: {
              label: 'Ver Alertas',
              onClick: () => (window.location.href = '/dashboard/alertas'),
            },
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar novos alertas:', error);
      }
    };

    // Verificar imediatamente
    checkNewAlerts();

    // Polling a cada 60 segundos
    const interval = setInterval(checkNewAlerts, 60000);

    return () => clearInterval(interval);
  }, [hasAnyRole]);
}
```

**Uso no Layout:**
```typescript
// app/dashboard/layout.tsx (ADICIONAR)

import { useAlertNotifications } from '@/features/emociograma/hooks/use-alert-notifications';

export default function DashboardLayout({ children }) {
  useAlertNotifications(); // Auto-ativa notificações

  return (
    <div>
      {/* ... layout existente */}
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Polling funciona
- ✅ Toast aparece para novos alertas
- ✅ Apenas para Gestores/Admins
- ✅ Link para página de alertas

---

## Definição de Pronto

Marco 5 está completo quando:

- ✅ **Types:** Types de alertas criados
- ✅ **Service:** AlertsService implementado
- ✅ **Components:** Dashboard cards, lista, modal de resolução
- ✅ **Page:** Página de alertas funcional
- ✅ **Notifications:** Sistema de notificações em tempo real
- ✅ **Tests:** Cobertura ≥80% (unit tests)
- ✅ **Backend Integration:** ⚠️ Backend M4 completo

---

## Dependências Backend CRÍTICAS

| Tarefa Frontend | Endpoint Backend Necessário | Backend Milestone |
|-----------------|----------------------------|-------------------|
| 5.2 Alerts Service | `GET /alerts/dashboard` | Backend M4 |
| 5.2 Alerts Service | `GET /alerts` | Backend M4 |
| 5.2 Alerts Service | `PATCH /alerts/:id/resolve` | Backend M4 |
| 5.3 Dashboard Cards | `AlertDashboardResponse` | Backend M4 |
| 5.4 Alerts List | Paginação de alertas | Backend M4 |

---

## Recursos

- [Sonner Toast](https://sonner.emilkowal.ski/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)
