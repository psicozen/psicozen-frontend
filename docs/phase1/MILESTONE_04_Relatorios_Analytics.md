# Marco 4: Relatórios e Analytics

**Cronograma:** Semana 3-4
**Dependências Frontend:** Marco 2 (Roles System), Marco 3 (Interface Emociograma)
**Dependências Backend:** ⚠️ Backend Marco 3 (Emociograma Core - repositório com queries de agregação)
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Criar dashboards de relatórios e analytics para Gestores e Admins visualizarem dados agregados da equipe/organização. Inclui gráficos de evolução emocional, distribuição por categoria, tendências e identificação de colaboradores mais/menos motivados.

**Entregável Principal:** Gestores e Admins podem visualizar relatórios completos com insights acionáveis.

---

## ⚠️ Dependências do Backend (OBRIGATÓRIAS)

Antes de iniciar este marco, o **Backend Marco 3** deve estar completo com:
- ✅ `GET /emociograma/team/aggregated` - Relatórios da equipe (Gestor)
- ✅ `GET /emociograma/organization/report` - Relatórios da organização (Admin)
- ✅ Repository com queries: `getAggregatedByTimeRange()`, `getMostMotivated()`, `getLeastMotivated()`
- ✅ DTOs de resposta: `AggregatedReportResponse` com summary, trends, distribution, alerts

---

## Detalhamento de Tarefas

### Tarefa 4.1: Criar Types - Reports & Analytics

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Backend M3 (DTOs de resposta)

**Subtarefas:**
- [ ] Criar arquivo: `src/types/reports.types.ts`
- [ ] Definir interfaces correspondentes aos DTOs do backend:
  - [ ] `AggregatedReportResponse`
  - [ ] `ReportSummary`
  - [ ] `ReportTrends`
  - [ ] `ReportDistribution`
  - [ ] `ReportAlerts`
- [ ] Criar types para filtros de relatório

**Types Code:**
```typescript
// src/types/reports.types.ts

export interface ReportSummary {
  totalSubmissions: number;
  averageEmotionLevel: number;
  motivationScore: number; // 0-100 (emotion level invertido)
  anonymityRate: number; // % anônimo
}

export interface ReportTrends {
  direction: 'improving' | 'stable' | 'declining';
  dailyAverages: { date: string; avgLevel: number }[];
}

export interface ReportDistribution {
  byLevel: { level: number; count: number; percentage: number }[];
  byCategory: { categoryId: string; count: number; percentage: number }[];
}

export interface ReportAlerts {
  totalAlertsTriggered: number;
  criticalCount: number; // >= 9
  highCount: number; // 7-8
  mediumCount: number; // 6
}

export interface AggregatedReportResponse {
  summary: ReportSummary;
  trends: ReportTrends;
  distribution: ReportDistribution;
  alerts: ReportAlerts;
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  department?: string;
  team?: string;
  categoryId?: string;
}

export interface UserMotivationScore {
  userId: string;
  averageEmotionLevel: number;
  submissionCount: number;
  lastSubmittedAt: Date;
}
```

**Critérios de Aceite:**
- ✅ Types correspondem exatamente aos DTOs do backend
- ✅ Todas as interfaces definidas
- ✅ Types fortemente tipados

---

### Tarefa 4.2: Criar Reports Service

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 completo (endpoints de agregação)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/services/reports.service.ts`
- [ ] Implementar métodos:
  - [ ] `getTeamReport()` - Relatório da equipe (Gestor)
  - [ ] `getOrganizationReport()` - Relatório geral (Admin)
  - [ ] `getMostMotivated()` - Top motivados
  - [ ] `getLeastMotivated()` - Menos motivados
- [ ] Criar `reports.service.test.ts`

**Service Code:**
```typescript
// src/features/emociograma/services/reports.service.ts

import { httpClient } from '@/lib/http/client';
import { AggregatedReportResponse, ReportFilters, UserMotivationScore } from '@/types/reports.types';

export class ReportsService {
  /**
   * Obter relatório agregado da equipe (Gestor)
   * 🔗 Backend: GET /emociograma/team/aggregated
   */
  async getTeamReport(filters: ReportFilters): Promise<AggregatedReportResponse> {
    const response = await httpClient.get<AggregatedReportResponse>(
      '/emociograma/team/aggregated',
      {
        params: {
          startDate: filters.startDate.toISOString(),
          endDate: filters.endDate.toISOString(),
          department: filters.department,
          team: filters.team,
          categoryId: filters.categoryId,
        },
      },
    );

    if (!response.success) {
      throw new Error('Erro ao buscar relatório da equipe');
    }

    return response.data;
  }

  /**
   * Obter relatório da organização (Admin)
   * 🔗 Backend: GET /emociograma/organization/report
   */
  async getOrganizationReport(filters: ReportFilters): Promise<AggregatedReportResponse> {
    const response = await httpClient.get<AggregatedReportResponse>(
      '/emociograma/organization/report',
      {
        params: {
          startDate: filters.startDate.toISOString(),
          endDate: filters.endDate.toISOString(),
          department: filters.department,
          team: filters.team,
          categoryId: filters.categoryId,
        },
      },
    );

    if (!response.success) {
      throw new Error('Erro ao buscar relatório da organização');
    }

    return response.data;
  }

  /**
   * Obter colaboradores mais motivados
   * 🔗 Backend: GET /emociograma/organization/analytics?type=most_motivated
   */
  async getMostMotivated(limit: number = 10): Promise<UserMotivationScore[]> {
    const response = await httpClient.get<UserMotivationScore[]>(
      '/emociograma/organization/analytics',
      {
        params: { type: 'most_motivated', limit },
      },
    );

    if (!response.success) {
      throw new Error('Erro ao buscar colaboradores mais motivados');
    }

    return response.data;
  }

  /**
   * Obter colaboradores menos motivados
   * 🔗 Backend: GET /emociograma/organization/analytics?type=least_motivated
   */
  async getLeastMotivated(limit: number = 10): Promise<UserMotivationScore[]> {
    const response = await httpClient.get<UserMotivationScore[]>(
      '/emociograma/organization/analytics',
      {
        params: { type: 'least_motivated', limit },
      },
    );

    if (!response.success) {
      throw new Error('Erro ao buscar colaboradores menos motivados');
    }

    return response.data;
  }
}

export const reportsService = new ReportsService();
```

**Critérios de Aceite:**
- ✅ Service implementado
- ✅ Métodos correspondem aos endpoints do backend
- ✅ Testes com ≥80% cobertura

---

### Tarefa 4.3: Criar Component - Report Filters

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma (apenas UI)

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/report-filters.tsx`
- [ ] Date range picker (início e fim)
- [ ] Select de departamento
- [ ] Select de equipe
- [ ] Select de categoria
- [ ] Botão "Aplicar Filtros"
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/report-filters.tsx

'use client';

import { useState } from 'react';
import { ReportFilters } from '@/types/reports.types';
import { Button } from '@/shared/ui/button';
import { Calendar, Filter } from 'lucide-react';

interface ReportFiltersProps {
  onApplyFilters: (filters: ReportFilters) => void;
  isLoading?: boolean;
}

export function ReportFiltersComponent({ onApplyFilters, isLoading }: ReportFiltersProps) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Primeiro dia do mês
  );
  const [endDate, setEndDate] = useState<Date>(new Date()); // Hoje

  const [department, setDepartment] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  const handleApply = () => {
    onApplyFilters({
      startDate,
      endDate,
      department: department || undefined,
      team: team || undefined,
      categoryId: categoryId || undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Data Início */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data Início
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Data Fim */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data Fim
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Departamento */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="Engenharia">Engenharia</option>
            <option value="RH">RH</option>
            <option value="Vendas">Vendas</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Equipe */}
        <div>
          <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
            Equipe
          </label>
          <select
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleApply}
          isLoading={isLoading}
          className="w-full md:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Filtros de data funcionam
- ✅ Selects de departamento/equipe funcionam
- ✅ Callback onApplyFilters chamado
- ✅ Design responsivo

---

### Tarefa 4.4: Criar Component - ReportSummaryCards

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 - `AggregatedReportResponse.summary`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/report-summary-cards.tsx`
- [ ] Cards de KPI: Total Submissões, Média Emocional, Índice Motivação, Taxa Anonimato
- [ ] Indicadores visuais (cores baseadas em thresholds)
- [ ] Ícones do Lucide
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/report-summary-cards.tsx

import { ReportSummary } from '@/types/reports.types';
import { Card } from '@/shared/ui/card';
import { Heart, TrendingUp, Users, EyeOff } from 'lucide-react';

interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  // Determinar cor baseada em média emocional
  const getEmotionColor = (avgLevel: number) => {
    if (avgLevel <= 3) return 'text-green-600 bg-green-100';
    if (avgLevel <= 5) return 'text-blue-600 bg-blue-100';
    if (avgLevel <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const emotionColor = getEmotionColor(summary.averageEmotionLevel);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Submissões */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Submissões</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalSubmissions}</p>
          </div>
        </div>
      </Card>

      {/* Média Emocional */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${emotionColor}`}>
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Média Emocional</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.averageEmotionLevel.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">Escala 1-10</p>
          </div>
        </div>
      </Card>

      {/* Índice de Motivação */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Índice Motivação</p>
            <p className="text-2xl font-bold text-gray-900">{summary.motivationScore}%</p>
            <p className="text-xs text-gray-500">0-100</p>
          </div>
        </div>
      </Card>

      {/* Taxa de Anonimato */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <EyeOff className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Submissões Anônimas</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.anonymityRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ 4 cards de KPI renderizados
- ✅ Cores dinâmicas baseadas em valores
- ✅ Design responsivo
- ✅ Testes com ≥80% cobertura

---

### Tarefa 4.5: Criar Component - EmotionTrendChart

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 6 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 - `AggregatedReportResponse.trends`

**Subtarefas:**
- [ ] Instalar biblioteca de gráficos: `npm install recharts`
- [ ] Criar arquivo: `src/features/emociograma/components/emotion-trend-chart.tsx`
- [ ] Line chart mostrando evolução diária
- [ ] Linha de threshold (6) marcada em vermelho
- [ ] Tooltip com detalhes ao hover
- [ ] Indicador de tendência (improving/stable/declining)
- [ ] Criar teste

**Dependencies:**
```bash
npm install recharts
npm install --save-dev @types/recharts
```

**Component Code:**
```typescript
// src/features/emociograma/components/emotion-trend-chart.tsx

'use client';

import { ReportTrends } from '@/types/reports.types';
import { Card } from '@/shared/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EmotionTrendChartProps {
  trends: ReportTrends;
}

export function EmotionTrendChart({ trends }: EmotionTrendChartProps) {
  const trendIcon = {
    improving: <TrendingDown className="h-5 w-5 text-green-600" />,
    stable: <Minus className="h-5 w-5 text-blue-600" />,
    declining: <TrendingUp className="h-5 w-5 text-red-600" />,
  };

  const trendLabel = {
    improving: 'Melhorando',
    stable: 'Estável',
    declining: 'Piorando',
  };

  const trendColor = {
    improving: 'text-green-600 bg-green-50',
    stable: 'text-blue-600 bg-blue-50',
    declining: 'text-red-600 bg-red-50',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Evolução Emocional</h3>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${trendColor[trends.direction]}`}>
          {trendIcon[trends.direction]}
          <span className="text-sm font-medium">{trendLabel[trends.direction]}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trends.dailyAverages}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          />
          <YAxis domain={[0, 10]} stroke="#6B7280" />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
            labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
            formatter={(value: number) => [value.toFixed(2), 'Média Emocional']}
          />

          {/* Linha de threshold (6 = alerta) */}
          <ReferenceLine y={6} stroke="#EF4444" strokeDasharray="5 5" label="Limite de Alerta" />

          {/* Linha de dados */}
          <Line
            type="monotone"
            dataKey="avgLevel"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Valores abaixo de 6 indicam bem-estar. Valores ≥ 6 geram alertas automáticos.
      </p>
    </Card>
  );
}
```

**Critérios de Aceite:**
- ✅ Gráfico renderiza evolução diária
- ✅ Linha de threshold visível
- ✅ Indicador de tendência
- ✅ Responsivo
- ✅ Testes com ≥80% cobertura

---

### Tarefa 4.6: Criar Component - DistributionCharts

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 5 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 - `AggregatedReportResponse.distribution`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/distribution-charts.tsx`
- [ ] Bar chart - distribuição por nível emocional
- [ ] Pie chart - distribuição por categoria
- [ ] Tooltips com percentuais
- [ ] Cores significativas (verde = positivo, vermelho = negativo)
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/distribution-charts.tsx

'use client';

import { ReportDistribution } from '@/types/reports.types';
import { Card } from '@/shared/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DistributionChartsProps {
  distribution: ReportDistribution;
}

export function DistributionCharts({ distribution }: DistributionChartsProps) {
  // Cores para níveis emocionais
  const getEmotionLevelColor = (level: number) => {
    if (level <= 3) return '#10B981'; // Verde
    if (level <= 5) return '#3B82F6'; // Azul
    if (level <= 7) return '#F59E0B'; // Amarelo
    return '#EF4444'; // Vermelho
  };

  const levelChartData = distribution.byLevel.map((item) => ({
    level: `Nível ${item.level}`,
    count: item.count,
    percentage: item.percentage,
    fill: getEmotionLevelColor(item.level),
  }));

  // Cores para categorias (palette variada)
  const CATEGORY_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6'];

  const categoryChartData = distribution.byCategory.map((item, index) => ({
    name: item.categoryId, // TODO: Resolver nome da categoria
    value: item.count,
    percentage: item.percentage,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribuição por Nível Emocional */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Nível Emocional</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={levelChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="level" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage.toFixed(1)}%)`,
                'Submissões',
              ]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Distribuição por Categoria */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Categoria</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${percentage.toFixed(0)}%`}
              outerRadius={100}
              dataKey="value"
            >
              {categoryChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage.toFixed(1)}%)`,
                'Submissões',
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Bar chart renderiza distribuição por nível
- ✅ Pie chart renderiza distribuição por categoria
- ✅ Tooltips mostram percentuais
- ✅ Cores significativas
- ✅ Testes com ≥80% cobertura

---

### Tarefa 4.7: Criar Component - MotivationRanking

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 - métodos `getMostMotivated()` e `getLeastMotivated()`

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/motivation-ranking.tsx`
- [ ] Tabs: "Mais Motivados" e "Menos Motivados"
- [ ] Lista de usuários com avatar, nome, média emocional
- [ ] Badge de ranking (1º, 2º, 3º)
- [ ] Privacidade: apenas admins veem nomes (gestores veem anonimizado)
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/motivation-ranking.tsx

'use client';

import { useState, useEffect } from 'react';
import { reportsService } from '../services/reports.service';
import { UserMotivationScore } from '@/types/reports.types';
import { Card } from '@/shared/ui/card';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { EmociogramaPermissions } from '@/types/roles.types';

export function MotivationRanking() {
  const [mostMotivated, setMostMotivated] = useState<UserMotivationScore[]>([]);
  const [leastMotivated, setLeastMotivated] = useState<UserMotivationScore[]>([]);
  const [activeTab, setActiveTab] = useState<'most' | 'least'>('most');
  const [isLoading, setIsLoading] = useState(true);

  const { hasPermission } = usePermissions();
  const canViewIdentified = hasPermission(EmociogramaPermissions.VIEW_ALL_IDENTIFIED);

  useEffect(() => {
    async function fetchRankings() {
      setIsLoading(true);

      try {
        const [most, least] = await Promise.all([
          reportsService.getMostMotivated(10),
          reportsService.getLeastMotivated(10),
        ]);

        setMostMotivated(most);
        setLeastMotivated(least);
      } catch (error) {
        console.error('Erro ao buscar rankings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRankings();
  }, []);

  const currentList = activeTab === 'most' ? mostMotivated : leastMotivated;

  if (isLoading) {
    return <div>Carregando rankings...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Motivação</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('most')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
            ${activeTab === 'most' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
        >
          <TrendingUp className="h-4 w-4" />
          Mais Motivados
        </button>

        <button
          onClick={() => setActiveTab('least')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
            ${activeTab === 'least' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
        >
          <TrendingDown className="h-4 w-4" />
          Menos Motivados
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {currentList.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            {/* Posição */}
            <div className="flex-shrink-0 w-8 text-center">
              {index < 3 ? (
                <Award className={`h-6 w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-700'}`} />
              ) : (
                <span className="text-sm font-bold text-gray-500">{index + 1}º</span>
              )}
            </div>

            {/* Usuário */}
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {canViewIdentified ? `Usuário ${user.userId.slice(0, 8)}` : 'Colaborador Anônimo'}
              </p>
              <p className="text-xs text-gray-500">
                {user.submissionCount} submissões
              </p>
            </div>

            {/* Média */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {user.averageEmotionLevel.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Média</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

**Critérios de Aceite:**
- ✅ Tabs funcionam
- ✅ Rankings carregados
- ✅ Privacidade respeitada (anonimização)
- ✅ Medalhas para top 3
- ✅ Testes com ≥80% cobertura

---

### Tarefa 4.8: Criar Página - Relatórios da Equipe (Gestor)

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 completo + Backend M5 (endpoints)

**Subtarefas:**
- [ ] Criar arquivo: `app/dashboard/relatorios/equipe/page.tsx`
- [ ] Renderizar `<ReportFiltersComponent>`
- [ ] Renderizar `<ReportSummaryCards>`
- [ ] Renderizar `<EmotionTrendChart>`
- [ ] Renderizar `<DistributionCharts>`
- [ ] Proteger com role GESTOR
- [ ] Loading states

**Page Code:**
```typescript
// app/dashboard/relatorios/equipe/page.tsx

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/shared/components/protected-route';
import { Role } from '@/types/roles.types';
import { ReportFiltersComponent } from '@/features/emociograma/components/report-filters';
import { ReportSummaryCards } from '@/features/emociograma/components/report-summary-cards';
import { EmotionTrendChart } from '@/features/emociograma/components/emotion-trend-chart';
import { DistributionCharts } from '@/features/emociograma/components/distribution-charts';
import { reportsService } from '@/features/emociograma/services/reports.service';
import { AggregatedReportResponse, ReportFilters } from '@/types/reports.types';
import { Loader2 } from 'lucide-react';

export default function TeamReportsPage() {
  const [report, setReport] = useState<AggregatedReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = async (filters: ReportFilters) => {
    setIsLoading(true);

    try {
      const data = await reportsService.getTeamReport(filters);
      setReport(data);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={[Role.GESTOR, Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios da Equipe</h1>

        {/* Filtros */}
        <ReportFiltersComponent onApplyFilters={handleApplyFilters} isLoading={isLoading} />

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Relatório */}
        {!isLoading && report && (
          <>
            <ReportSummaryCards summary={report.summary} />
            <EmotionTrendChart trends={report.trends} />
            <DistributionCharts distribution={report.distribution} />
          </>
        )}

        {/* Empty State */}
        {!isLoading && !report && (
          <div className="text-center py-12 text-gray-600">
            Selecione filtros e clique em "Aplicar Filtros" para visualizar o relatório.
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

**Critérios de Aceite:**
- ✅ Página protegida por role GESTOR
- ✅ Filtros funcionam
- ✅ Relatórios renderizam
- ✅ Loading states
- ✅ Empty state

---

### Tarefa 4.9: Criar Página - Relatórios da Organização (Admin)

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M3 completo + Backend M5 (endpoints)

**Subtarefas:**
- [ ] Criar arquivo: `app/dashboard/relatorios/organizacao/page.tsx`
- [ ] Similar à página de equipe mas com dados de toda organização
- [ ] Adicionar `<MotivationRanking>` (apenas Admin)
- [ ] Proteger com role ADMIN
- [ ] Mostrar mais detalhes que página de Gestor

**Page Code:**
```typescript
// app/dashboard/relatorios/organizacao/page.tsx

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/shared/components/protected-route';
import { Role } from '@/types/roles.types';
import { ReportFiltersComponent } from '@/features/emociograma/components/report-filters';
import { ReportSummaryCards } from '@/features/emociograma/components/report-summary-cards';
import { EmotionTrendChart } from '@/features/emociograma/components/emotion-trend-chart';
import { DistributionCharts } from '@/features/emociograma/components/distribution-charts';
import { MotivationRanking } from '@/features/emociograma/components/motivation-ranking';
import { reportsService } from '@/features/emociograma/services/reports.service';
import { AggregatedReportResponse, ReportFilters } from '@/types/reports.types';

export default function OrganizationReportsPage() {
  const [report, setReport] = useState<AggregatedReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = async (filters: ReportFilters) => {
    setIsLoading(true);

    try {
      const data = await reportsService.getOrganizationReport(filters);
      setReport(data);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios da Organização</h1>

        <ReportFiltersComponent onApplyFilters={handleApplyFilters} isLoading={isLoading} />

        {!isLoading && report && (
          <>
            <ReportSummaryCards summary={report.summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EmotionTrendChart trends={report.trends} />
              </div>
              <div>
                {/* Alertas Summary Card */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Alertas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Crítico (≥9)</span>
                      <span className="font-bold text-red-600">{report.alerts.criticalCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Alto (7-8)</span>
                      <span className="font-bold text-orange-600">{report.alerts.highCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Médio (6)</span>
                      <span className="font-bold text-yellow-600">{report.alerts.mediumCount}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <DistributionCharts distribution={report.distribution} />
            <MotivationRanking />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

**Critérios de Aceite:**
- ✅ Página protegida por role ADMIN
- ✅ Todos os componentes renderizados
- ✅ Dados completos da organização

---

## Definição de Pronto

Marco 4 está completo quando:

- ✅ **Types:** Types de reports criados
- ✅ **Service:** ReportsService implementado
- ✅ **Components:** Filtros, KPI cards, gráficos criados
- ✅ **Charts:** Recharts integrado e funcional
- ✅ **Pages:** Páginas de relatórios (Equipe e Organização)
- ✅ **Tests:** Cobertura ≥80% (unit tests)
- ✅ **Backend Integration:** ⚠️ Backend M3 e M5 completos

---

## Dependências Backend CRÍTICAS

**BLOQUEADORES - Frontend não pode avançar sem:**

| Tarefa Frontend | Endpoint Backend Necessário | Backend Milestone |
|-----------------|----------------------------|-------------------|
| 4.2 Reports Service | `GET /emociograma/team/aggregated` | Backend M3 + M5 |
| 4.2 Reports Service | `GET /emociograma/organization/report` | Backend M3 + M5 |
| 4.2 Reports Service | `GET /emociograma/organization/analytics` | Backend M3 + M5 |
| 4.5 Trend Chart | `AggregatedReportResponse.trends` | Backend M3 |
| 4.6 Distribution Charts | `AggregatedReportResponse.distribution` | Backend M3 |
| 4.7 Motivation Ranking | `getMostMotivated()` repository method | Backend M3 |

---

## Recursos

- [Recharts Documentation](https://recharts.org/)
- [date-fns](https://date-fns.org/)
- [Tailwind CSS Charts](https://tailwindcss.com/docs)
