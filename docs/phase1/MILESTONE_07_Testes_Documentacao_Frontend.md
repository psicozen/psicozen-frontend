# Marco 7: Testes e Documentação - Frontend

**Cronograma:** Semana 5-6
**Dependências Frontend:** Todos os marcos anteriores (M1-M6)
**Dependências Backend:** ⚠️ Backend Marco 7 completo (API totalmente funcional)
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Testes abrangentes (unit, integration, E2E), otimização de performance, documentação completa e garantia de qualidade final antes da entrega da Fase 1. Garantir ≥70% de cobertura de testes conforme CLAUDE.md do frontend.

**Entregável Principal:** Frontend pronto para produção com testes completos, performance otimizada e documentação atualizada.

---

## ⚠️ Dependências do Backend (OBRIGATÓRIAS)

Antes de iniciar testes E2E, o **Backend completo** deve estar funcional:
- ✅ Todos os endpoints da API respondendo corretamente
- ✅ Database com migrations aplicadas
- ✅ Seed data para testes (organizações, usuários, categorias)
- ✅ CORS configurado para aceitar requisições do frontend

---

## Detalhamento de Tarefas

### Tarefa 7.1: Unit Tests - Completar Todos os Módulos

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 8 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma (apenas testes isolados)

**Subtarefas:**
- [ ] Verificar cobertura ≥70% para todos os módulos:
  - [ ] `features/auth/` (hooks, services)
  - [ ] `features/organizations/` (hooks, services, components)
  - [ ] `features/emociograma/` (components, services, hooks)
  - [ ] `stores/` (auth.store, organization.store)
  - [ ] `shared/hooks/` (usePermissions, etc.)
  - [ ] `shared/components/` (Can, ProtectedRoute, etc.)
- [ ] Executar: `npm run test:coverage`
- [ ] Identificar gaps e escrever testes faltantes
- [ ] Testar edge cases

**Executar Coverage Report:**
```bash
npm run test:coverage

# Saída esperada:
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|-------------------
All files                 |   75.45 |    72.12 |   78.33 |   76.21 |
 features/auth/           |   80.23 |    76.45 |   82.11 |   81.05 |
 features/organizations/  |   78.12 |    74.33 |   80.45 |   79.01 |
 features/emociograma/    |   73.45 |    70.21 |   76.12 |   74.33 |
 stores/                  |   82.11 |    78.90 |   84.22 |   83.05 |
 shared/                  |   70.33 |    68.12 |   72.45 |   71.22 |
--------------------------|---------|----------|---------|---------|-------------------
```

**Critérios de Aceite:**
- ✅ Cobertura geral ≥70% (conforme CLAUDE.md)
- ✅ Todos os componentes críticos testados
- ✅ Services com mocks de API
- ✅ Hooks testados com renderHook

---

### Tarefa 7.2: Integration Tests - Backend API

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 6 horas
**Responsável:** Frontend Developer
**Dependência Backend:** ✅ Backend M7 - API funcional em ambiente de teste

**Subtarefas:**
- [ ] Configurar ambiente de teste integrado (backend rodando)
- [ ] Criar arquivo: `__tests__/integration/api-integration.test.tsx`
- [ ] Testar integração real com backend:
  - [ ] Login → recebe token → busca organizações
  - [ ] Submit emociograma → retorna submissão criada
  - [ ] Fetch relatórios → retorna dados agregados
  - [ ] Resolve alert → alerta marcado como resolvido
- [ ] Sem mocks (requisições reais)
- [ ] Usar banco de dados de teste

**Integration Test Example:**
```typescript
// __tests__/integration/api-integration.test.tsx

/**
 * IMPORTANTE: Estes testes requerem backend rodando em localhost:3000
 * Executar antes: cd ../psicozen-backend && npm run start:test
 */

import { emociogramaService } from '@/features/emociograma/services/emociograma.service';
import { authService } from '@/features/auth/services/auth.service';
import { organizationService } from '@/features/organizations/services/organization.service';

describe('API Integration Tests', () => {
  let accessToken: string;
  let organizationId: string;

  beforeAll(async () => {
    // Setup: Login e obter token
    const response = await authService.sendMagicLink({ email: 'test@example.com' });
    // ... (simular verificação de magic link)
    // accessToken = ...
    // organizationId = ...
  });

  describe('Emociograma Flow', () => {
    it('deve submeter emociograma e buscar da API', async () => {
      // Submeter
      const submission = await emociogramaService.submitEmociograma({
        emotionLevel: 7,
        categoryId: 'cat-123',
        isAnonymous: false,
        comment: 'Teste integração',
      });

      expect(submission.id).toBeDefined();
      expect(submission.emotionLevel).toBe(7);

      // Buscar histórico
      const history = await emociogramaService.getMySubmissions(1, 10);

      expect(history.data.length).toBeGreaterThan(0);
      expect(history.data[0].emotionLevel).toBe(7);
    });
  });

  describe('Organizations Flow', () => {
    it('deve buscar organizações do usuário', async () => {
      const organizations = await organizationService.getUserOrganizations();

      expect(organizations.length).toBeGreaterThan(0);
      expect(organizations[0].organization.id).toBeDefined();
    });
  });
});
```

**Critérios de Aceite:**
- ✅ Testes rodam contra backend real
- ✅ Fluxos completos testados
- ✅ Sem mocks de API
- ✅ Database de teste isolado

---

### Tarefa 7.3: E2E Tests - User Journeys com Playwright

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 10 horas
**Responsável:** QA + Frontend Developer
**Dependência Backend:** ✅ Backend M7 - Sistema completo funcionando

**Subtarefas:**
- [ ] Instalar Playwright: `npm install -D @playwright/test`
- [ ] Configurar Playwright: `playwright.config.ts`
- [ ] Criar testes E2E:
  - [ ] `tests/e2e/colaborador-journey.spec.ts` - Jornada completa do colaborador
  - [ ] `tests/e2e/gestor-journey.spec.ts` - Jornada do gestor
  - [ ] `tests/e2e/admin-journey.spec.ts` - Jornada do admin
- [ ] Testar flows completos (login → navegação → ações → logout)
- [ ] Screenshots em caso de falha
- [ ] Executar em múltiplos browsers (Chrome, Firefox, Safari)

**Playwright Config:**
```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

**E2E Test - Colaborador Journey:**
```typescript
// tests/e2e/colaborador-journey.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Jornada do Colaborador', () => {
  test('deve completar fluxo completo: login → selecionar org → submeter emociograma → ver histórico', async ({ page }) => {
    // 1. Acessar página de login
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // 2. Fazer login (Magic Link simulado via teste)
    await page.fill('input[name="email"]', 'colaborador@example.com');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Email enviado')).toBeVisible();

    // Simular verificação de magic link (em teste, pode usar token direto)
    await page.goto('/auth/callback?token=valid_test_token');

    // 3. Selecionar organização
    await expect(page.getByText('Selecione uma Organização')).toBeVisible();
    await page.click('button:has-text("Empresa Teste")');

    // 4. Dashboard carregado
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /Olá/ })).toBeVisible();

    // 5. Ir para novo emociograma
    await page.click('a[href="/dashboard/emociograma/novo"]');
    await expect(page.getByText('Registrar Emociograma')).toBeVisible();

    // 6. Selecionar emoção
    await page.click('button[aria-label*="Estressado"]'); // Nível 8
    await expect(page.getByText('Estressado')).toBeVisible();

    // 7. Selecionar categoria
    await page.click('button:has-text("Trabalho")');

    // 8. Adicionar comentário
    await page.fill('textarea[placeholder*="comentário"]', 'Muitos prazos apertados');

    // 9. Marcar como anônimo
    await page.check('input[type="checkbox"][id="isAnonymous"]');

    // 10. Submeter
    await page.click('button[type="submit"]');

    // 11. Verificar toast de sucesso
    await expect(page.getByText('Emociograma registrado com sucesso')).toBeVisible();

    // 12. Redirecionado para histórico
    await expect(page).toHaveURL('/dashboard/emociograma');

    // 13. Verificar submissão na lista
    await expect(page.getByText('😣')).toBeVisible();
    await expect(page.getByText('Anônimo')).toBeVisible();

    // 14. Fazer logout
    await page.click('button[aria-label="User menu"]');
    await page.click('button:has-text("Sair")');

    await expect(page).toHaveURL('/login');
  });
});
```

**E2E Test - Gestor Journey:**
```typescript
// tests/e2e/gestor-journey.spec.ts

test.describe('Jornada do Gestor', () => {
  test('deve ver relatórios da equipe e resolver alerta', async ({ page }) => {
    // Login como gestor
    await loginAsGestor(page);

    // Ir para relatórios
    await page.click('a[href="/dashboard/relatorios/equipe"]');
    await expect(page.getByRole('heading', { name: 'Relatórios da Equipe' })).toBeVisible();

    // Aplicar filtros
    await page.fill('input[id="startDate"]', '2025-01-01');
    await page.fill('input[id="endDate"]', '2025-01-31');
    await page.click('button:has-text("Aplicar Filtros")');

    // Verificar cards de KPI carregados
    await expect(page.getByText('Total Submissões')).toBeVisible();
    await expect(page.getByText('Média Emocional')).toBeVisible();

    // Ir para alertas
    await page.click('a[href="/dashboard/alertas"]');
    await expect(page.getByRole('heading', { name: 'Alertas Emocionais' })).toBeVisible();

    // Resolver primeiro alerta
    await page.click('button:has-text("Resolver")').first();
    await page.fill('textarea', 'Conversei com o colaborador, situação melhorou');
    await page.click('button:has-text("Confirmar Resolução")');

    // Verificar toast de sucesso
    await expect(page.getByText('Alerta resolvido com sucesso')).toBeVisible();
  });
});
```

**Executar E2E Tests:**
```bash
# Executar todos os testes E2E
npx playwright test

# Executar em modo debug
npx playwright test --debug

# Executar em browser específico
npx playwright test --project=chromium

# Ver relatório HTML
npx playwright show-report
```

**Critérios de Aceite:**
- ✅ Testes E2E passam em todos os browsers
- ✅ Jornadas completas testadas
- ✅ Screenshots em falhas
- ✅ CI configurado (opcional)

---

### Tarefa 7.4: Performance Optimization - Lighthouse

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 6 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma

**Subtarefas:**
- [ ] Executar Lighthouse audit em todas as páginas principais
- [ ] Otimizar Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Otimizar imagens (usar Next.js Image)
- [ ] Code splitting e lazy loading
- [ ] Minificar e comprimir assets
- [ ] Adicionar loading skeletons

**Optimizations Checklist:**
```markdown
# Performance Optimization Checklist

## Core Web Vitals
- [ ] LCP < 2.5s (carregamento inicial rápido)
- [ ] FID < 100ms (interatividade responsiva)
- [ ] CLS < 0.1 (sem shifts de layout)

## Assets
- [ ] Imagens otimizadas com Next.js Image
- [ ] Fonts carregados com next/font (já configurado)
- [ ] SVG icons em vez de PNG quando possível
- [ ] Lazy loading para componentes pesados (gráficos)

## Code Splitting
- [ ] Dynamic imports para páginas pesadas
- [ ] Recharts carregado sob demanda
- [ ] Componentes de modal lazy loaded

## Caching
- [ ] React Query para cache de dados (opcional)
- [ ] localStorage para dados offline
- [ ] Service Worker para PWA (futuro)

## Bundle Size
- [ ] Analisar bundle: `npm run build && npm run analyze`
- [ ] Remover dependências não utilizadas
- [ ] Tree shaking configurado
```

**Lighthouse Audit:**
```bash
# Executar Lighthouse (Chrome DevTools ou CLI)
npx lighthouse http://localhost:3001/dashboard --view

# Metas:
# Performance: ≥ 90
# Accessibility: ≥ 90
# Best Practices: ≥ 90
# SEO: ≥ 80
```

**Critérios de Aceite:**
- ✅ Lighthouse score Performance ≥ 90
- ✅ Core Web Vitals dentro dos limites
- ✅ Bundle size otimizado
- ✅ Loading skeletons implementados

---

### Tarefa 7.5: Accessibility (a11y) Tests

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma

**Subtarefas:**
- [ ] Instalar: `npm install -D @axe-core/react jest-axe`
- [ ] Adicionar testes de acessibilidade:
  - [ ] Contraste de cores adequado
  - [ ] Navegação por teclado funcional
  - [ ] ARIA labels corretos
  - [ ] Landmarks semânticos (<main>, <nav>, etc.)
- [ ] Testar com leitores de tela (VoiceOver, NVDA)
- [ ] Corrigir violações encontradas

**Accessibility Test:**
```typescript
// __tests__/accessibility/emociograma-form.a11y.test.tsx

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SubmitEmociogramaForm } from '@/features/emociograma/components/submit-emociograma-form';

expect.extend(toHaveNoViolations);

describe('SubmitEmociogramaForm Accessibility', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = render(<SubmitEmociogramaForm />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('deve permitir navegação por teclado', () => {
    const { getAllByRole } = render(<SubmitEmociogramaForm />);
    const buttons = getAllByRole('button');

    // Todos os botões devem ser focáveis
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabindex');
    });
  });
});
```

**WCAG Compliance Checklist:**
```markdown
# WCAG 2.1 AA Compliance Checklist

## Percepção
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande
- [ ] Alternativas de texto para emojis (aria-label)

## Operabilidade
- [ ] Todos os controles acessíveis via teclado
- [ ] Focus visível em todos os elementos interativos
- [ ] Sem armadilhas de teclado

## Compreensibilidade
- [ ] Labels claros em formulários
- [ ] Mensagens de erro descritivas
- [ ] Linguagem simples e direta

## Robustez
- [ ] HTML semântico válido
- [ ] ARIA usado corretamente
- [ ] Compatível com tecnologias assistivas
```

**Critérios de Aceite:**
- ✅ Sem violações axe-core
- ✅ Navegação por teclado funcional
- ✅ WCAG 2.1 AA compliant
- ✅ Testado com leitor de tela

---

### Tarefa 7.6: Atualizar Documentação - README.md

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma

**Subtarefas:**
- [ ] Atualizar `README.md` com features da Fase 1
- [ ] Documentar estrutura de pastas atualizada
- [ ] Adicionar seção de Emociograma
- [ ] Atualizar comandos de desenvolvimento
- [ ] Adicionar troubleshooting

**README Update:**
```markdown
# PsicoZen Frontend - Fase 1

## Recursos Implementados (Fase 1)

✅ **Autenticação Multi-Tenant**
- Login com Magic Link (Supabase)
- Seleção de organização
- Context de organização automático (header x-organization-id)

✅ **Sistema de Roles**
- Hierarquia: Admin > Gestor > Colaborador
- Controle de acesso baseado em permissões
- Componentes protegidos: <Can>, <ProtectedRoute>

✅ **Interface Emociograma**
- Submissão diária de emoções (escala 1-10 com emojis)
- Seleção de categoria (10 categorias predefinidas)
- Comentário opcional com moderação
- Anonimato opcional (escolha do colaborador)

✅ **Relatórios e Analytics**
- Dashboard de KPIs (total submissões, média, motivação)
- Gráficos de evolução temporal (Recharts)
- Distribuição por nível e categoria
- Ranking de motivação

✅ **Sistema de Alertas**
- Dashboard de alertas para Gestores/Admins
- Resolução de alertas com notas
- Notificações em tempo real (polling)

✅ **Exportação e LGPD**
- Export CSV/Excel de relatórios
- Export de dados pessoais (JSON)
- Anonimização de dados
- Solicitação de exclusão

## Comandos

```bash
# Desenvolvimento
npm run dev              # http://localhost:3001
npm run build
npm run start

# Testes
npm run test             # Unit tests
npm run test:watch
npm run test:coverage
npx playwright test      # E2E tests

# Linting
npm run lint
```

## Estrutura de Pastas (Fase 1)

```
src/
├── features/
│   ├── auth/                      # Autenticação (já existente)
│   ├── organizations/             # NOVO: Multi-tenant
│   │   ├── components/
│   │   │   └── organization-selector.tsx
│   │   ├── hooks/
│   │   │   └── use-current-organization.ts
│   │   └── services/
│   │       └── organization.service.ts
│   │
│   ├── emociograma/               # NOVO: Emociograma
│   │   ├── components/
│   │   │   ├── emotion-selector.tsx
│   │   │   ├── category-selector.tsx
│   │   │   ├── submit-emociograma-form.tsx
│   │   │   ├── emociograma-history.tsx
│   │   │   ├── report-filters.tsx
│   │   │   ├── emotion-trend-chart.tsx
│   │   │   ├── alerts-list.tsx
│   │   │   └── export-button.tsx
│   │   ├── services/
│   │   │   ├── emociograma.service.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── alerts.service.ts
│   │   │   └── export.service.ts
│   │   └── hooks/
│   │       └── use-alert-notifications.ts
│   │
│   └── users/                     # NOVO: LGPD
│       ├── components/
│       │   ├── lgpd-data-export.tsx
│       │   ├── lgpd-data-anonymization.tsx
│       │   └── lgpd-data-deletion.tsx
│       └── services/
│           └── lgpd.service.ts
│
├── stores/                        # Zustand stores
│   ├── auth.store.ts
│   └── organization.store.ts      # NOVO
│
├── shared/
│   ├── components/
│   │   ├── can.tsx                # NOVO
│   │   ├── protected-route.tsx    # NOVO
│   │   └── sidebar-navigation.tsx # NOVO
│   └── hooks/
│       ├── use-permissions.ts     # NOVO
│       └── use-role-redirect.ts   # NOVO
│
└── types/
    ├── organization.types.ts      # NOVO
    ├── roles.types.ts             # NOVO
    ├── emociograma.types.ts       # NOVO
    ├── reports.types.ts           # NOVO
    └── alerts.types.ts            # NOVO
```

## Integração Backend

Este frontend integra com PsicoZen Backend (NestJS). Requisitos:
- Backend rodando em: `http://localhost:3000`
- CORS configurado para aceitar `http://localhost:3001`
- Todas as migrations aplicadas
- Seed data criado (organizações, categorias)

## Troubleshooting

**Erro: Organization ID não encontrado**
- Verificar se selecionou organização em `/select-organization`
- Checar localStorage: `psicozen-organization-storage`
- Verificar se backend retorna organizações em `/users/me/organizations`

**Erro 403 Forbidden**
- Verificar se usuário tem role correto na organização
- Verificar header `x-organization-id` sendo enviado
- Checar permissões no backend

**Gráficos não renderizam**
- Verificar se Recharts instalado: `npm install recharts`
- Verificar se dados estão no formato correto
- Checar console para erros
```

**Critérios de Aceite:**
- ✅ README atualizado
- ✅ Estrutura de pastas documentada
- ✅ Troubleshooting adicionado
- ✅ Integração com backend documentada

---

### Tarefa 7.7: Criar Storybook (Opcional)

**Prioridade:** 🟢 Baixa (Opcional)
**Tempo Estimado:** 8 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma

**Subtarefas:**
- [ ] Instalar Storybook: `npx storybook@latest init`
- [ ] Criar stories para componentes principais:
  - [ ] EmotionSelector.stories.tsx
  - [ ] CategorySelector.stories.tsx
  - [ ] AlertsList.stories.tsx
  - [ ] ReportSummaryCards.stories.tsx
- [ ] Documentar props e variantes
- [ ] Deploy Storybook (Chromatic ou Netlify)

**Story Example:**
```typescript
// src/features/emociograma/components/emotion-selector.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { EmotionSelector } from './emotion-selector';

const meta: Meta<typeof EmotionSelector> = {
  title: 'Emociograma/EmotionSelector',
  component: EmotionSelector,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmotionSelector>;

export const Default: Story = {
  args: {
    value: null,
    onChange: (level) => console.log('Selected:', level),
  },
};

export const WithSelection: Story = {
  args: {
    value: 7,
    onChange: (level) => console.log('Selected:', level),
  },
};

export const WithError: Story = {
  args: {
    value: null,
    onChange: (level) => console.log('Selected:', level),
    error: 'Por favor, selecione como você está se sentindo',
  },
};
```

**Critérios de Aceite:**
- ✅ Storybook configurado
- ✅ Stories criados para componentes principais
- ✅ Documentação visual funcionando

---

### Tarefa 7.8: Performance Monitoring - Web Vitals

**Prioridade:** 🟢 Média
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer
**Dependência Backend:** Nenhuma

**Subtarefas:**
- [ ] Configurar Web Vitals tracking
- [ ] Adicionar em `app/layout.tsx`
- [ ] Log de métricas no console (desenvolvimento)
- [ ] Enviar para analytics (produção - opcional)
- [ ] Monitorar LCP, FID, CLS, TTFB

**Web Vitals Setup:**
```typescript
// app/layout.tsx (ADICIONAR)

import { Analytics } from '@/shared/components/analytics';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

```typescript
// src/shared/components/analytics.tsx

'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function Analytics() {
  useReportWebVitals((metric) => {
    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric);
    }

    // Enviar para analytics em produção (Google Analytics, Vercel Analytics, etc.)
    // window.gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   metric_id: metric.id,
    //   metric_value: metric.value,
    //   metric_delta: metric.delta,
    // });
  });

  return null;
}
```

**Critérios de Aceite:**
- ✅ Web Vitals rastreados
- ✅ Logs no console (dev)
- ✅ Métricas dentro dos limites

---

### Tarefa 7.9: Documentação - Guia do Usuário

**Prioridade:** 🟢 Média
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer + Designer
**Dependência Backend:** Nenhuma

**Subtarefas:**
- [ ] Criar: `docs/GUIA_USUARIO.md`
- [ ] Documentar como usar o Emociograma:
  - [ ] Como fazer login
  - [ ] Como selecionar organização
  - [ ] Como registrar emoção
  - [ ] Como ver histórico
  - [ ] Como exportar dados (LGPD)
- [ ] Screenshots de cada tela
- [ ] FAQ (perguntas frequentes)

**User Guide Outline:**
```markdown
# Guia do Usuário - PsicoZen

## Introdução

PsicoZen é uma plataforma de gestão emocional que permite registrar seu estado emocional
diariamente e acompanhar sua evolução ao longo do tempo.

## Como Usar

### 1. Fazer Login

1. Acesse http://psicozen.com.br/login
2. Digite seu email corporativo
3. Clique em "Enviar Link de Acesso"
4. Verifique seu email e clique no link recebido

### 2. Selecionar Organização

1. Após login, você verá lista de organizações
2. Clique na organização desejada
3. Você será redirecionado para o dashboard

### 3. Registrar Emoção Diária

1. No dashboard, clique em "Registrar Emoção"
2. Selecione o emoji que representa como você se sente (1-10)
3. Escolha a categoria (Trabalho, Pessoal, Saúde, etc.)
4. Adicione um comentário (opcional)
5. Marque "Anônimo" se desejar privacidade
6. Clique em "Registrar"

### 4. Ver Seu Histórico

1. Acesse "Meu Emociograma" no menu lateral
2. Veja todas as suas submissões
3. Acompanhe sua evolução emocional

## Para Gestores

[Instruções de como ver relatórios, resolver alertas...]

## Para Admins

[Instruções de configurações, gerenciamento...]

## FAQ

**P: O que acontece se eu registrar uma emoção negativa (nível 6+)?**
R: Seu gestor receberá um alerta automático para poder oferecer suporte, mas sua identidade
será preservada se você escolheu anonimato.

**P: Posso editar uma submissão após enviar?**
R: Não, as submissões não podem ser editadas para manter integridade dos dados.

**P: Como funciona o anonimato?**
R: Quando você marca como anônimo, seu nome não aparece para gestores. Apenas admins
podem ver submissões identificadas para fins de suporte.
```

**Critérios de Aceite:**
- ✅ Guia do usuário criado
- ✅ Screenshots incluídos
- ✅ FAQ completo

---

### Tarefa 7.10: QA Final - Checklist Completo

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 6 horas
**Responsável:** QA Team + Frontend Developer
**Dependência Backend:** ✅ Backend M7 completo (sistema funcionando)

**Subtarefas:**
- [ ] Executar todos os testes (unit + integration + E2E)
- [ ] Verificar cobertura ≥70%
- [ ] Testar em múltiplos browsers (Chrome, Firefox, Safari, Edge)
- [ ] Testar em mobile (iOS Safari, Chrome Android)
- [ ] Testar fluxos completos manualmente
- [ ] Verificar responsividade em diferentes resoluções
- [ ] Verificar acessibilidade
- [ ] Criar relatório QA

**QA Checklist:**
```markdown
# Checklist de QA - PsicoZen Frontend Fase 1

## Funcional

### Autenticação
- [ ] Login com Magic Link funciona
- [ ] Logout limpa sessão corretamente
- [ ] Refresh token funciona
- [ ] Proteção de rotas funcional

### Organizações
- [ ] Seleção de organização funciona
- [ ] Context de organização persiste
- [ ] Troca de organização funciona
- [ ] Header x-organization-id enviado

### Emociograma
- [ ] Submissão de emoção funciona
- [ ] Anonimato funciona corretamente
- [ ] Comentário é salvo
- [ ] Histórico lista submissões
- [ ] Paginação funciona

### Relatórios (Gestor)
- [ ] Dashboard carrega KPIs
- [ ] Gráficos renderizam
- [ ] Filtros funcionam
- [ ] Export CSV funciona

### Relatórios (Admin)
- [ ] Todos os dados da org visíveis
- [ ] Ranking de motivação funciona
- [ ] Export Excel funciona

### Alertas
- [ ] Dashboard lista alertas
- [ ] Resolução funciona
- [ ] Notificações aparecem

### LGPD
- [ ] Export de dados funciona
- [ ] Anonimização funciona
- [ ] Exclusão envia email

## Técnico

### Performance
- [ ] Lighthouse score ≥ 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 500KB (gzipped)

### Acessibilidade
- [ ] Sem violações axe-core
- [ ] Navegação por teclado
- [ ] Contraste adequado
- [ ] ARIA labels corretos

### Compatibilidade
- [ ] Chrome desktop ✓
- [ ] Firefox desktop ✓
- [ ] Safari desktop ✓
- [ ] Edge desktop ✓
- [ ] Chrome mobile ✓
- [ ] Safari iOS ✓

### Responsividade
- [ ] Mobile (< 640px) ✓
- [ ] Tablet (640-1024px) ✓
- [ ] Desktop (> 1024px) ✓

## Segurança
- [ ] Tokens não expostos em logs
- [ ] XSS prevenido
- [ ] HTTPS em produção
- [ ] Cookies httpOnly
```

**QA Report Template:**
```markdown
# Relatório QA - PsicoZen Frontend Fase 1

## Resumo Executivo
- **Data:** 2025-01-XX
- **Versão:** 1.0.0
- **Testes Executados:** 450
- **Passou:** 447 (99.3%)
- **Falhou:** 3 (0.7%)
- **Cobertura:** 75.4%

## Problemas Encontrados

### Críticos (0)
Nenhum

### Altos (1)
1. Loading infinito ao buscar relatório sem filtros [CORRIGIDO]

### Médios (2)
1. Tooltip de emoji não aparece em mobile [CORRIGIDO]
2. Export Excel lento para >10K registros [EM ANDAMENTO]

### Baixos (3)
1. Typo em mensagem de erro
2. Contraste insuficiente em badge amarelo
3. Focus outline invisível em dark mode (futuro)

## Performance
- Lighthouse Performance: 92 ✅
- LCP: 1.8s ✅
- FID: 45ms ✅
- CLS: 0.05 ✅

## Recomendação
✅ **APROVADO PARA PRODUÇÃO**
(após correção de problemas médios e baixos)
```

**Critérios de Aceite:**
- ✅ Checklist completo
- ✅ Relatório QA gerado
- ✅ Todos os problemas críticos resolvidos
- ✅ Performance validada

---

## Definição de Pronto

Marco 7 está completo quando:

- ✅ **Cobertura de Testes:** ≥70% (unit tests) conforme CLAUDE.md
- ✅ **E2E Tests:** Playwright configurado e todos os testes passando
- ✅ **Performance:** Lighthouse ≥ 90, Core Web Vitals OK
- ✅ **Accessibility:** WCAG 2.1 AA compliant
- ✅ **Documentation:** README, User Guide atualizados
- ✅ **QA:** Checklist completo, problemas críticos resolvidos
- ✅ **Production Ready:** Frontend deployável em produção
- ✅ **Backend Integration:** ⚠️ Backend M7 completo e testado

---

## Critérios de Sucesso da Fase 1

Fase 1 Frontend está **COMPLETA** quando:

✅ **Todos os 7 Marcos Entregues:**
1. Autenticação Multi-Tenant
2. Sistema de Roles
3. Interface Emociograma
4. Relatórios e Analytics
5. Sistema de Alertas UI
6. Exportação e LGPD
7. Testes e Documentação

✅ **Padrões de Qualidade:**
- Cobertura de testes ≥70%
- Lighthouse Performance ≥ 90
- Acessibilidade WCAG 2.1 AA
- Zero bugs críticos

✅ **Requisitos Funcionais:**
- Colaboradores registram emoções
- Gestores visualizam relatórios de equipe
- Admins visualizam relatórios gerais
- Alertas funcionam em tempo real
- Export e LGPD funcionais

✅ **Requisitos Técnicos:**
- Clean Architecture mantida
- Next.js 16 App Router
- TypeScript strict mode
- Zustand para state management
- Integração completa com backend

---

## Próximos Passos - Fase 2

**Pulse Surveys:**
- Interface para pesquisas rápidas de 4-6 questões
- Gráficos de resultados
- Análise de tendências

**e-NPS:**
- Formulário de Employee Net Promoter Score
- Dashboard de NPS
- Tracking de evolução

**Comunicação:**
- Mural de avisos
- Mensagens motivacionais
- Chat corporativo básico

---

## Recursos

- [Playwright Testing](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Axe Accessibility](https://www.deque.com/axe/)
- [Storybook](https://storybook.js.org/)
- [Web Vitals](https://web.dev/vitals/)
