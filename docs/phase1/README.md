# PsicoZen Frontend - Implementação Fase 1

**Status:** 🔴 Não Iniciado
**Cronograma:** 5-6 semanas (sincronizado com backend)
**Conclusão Prevista:** [A definir]

---

## Visão Geral

Este diretório contém o plano de implementação completo para **PsicoZen Frontend Fase 1**, dividido em 7 marcos detalhados que se integram com os marcos do backend. Cada documento inclui task breakdown, code examples, acceptance criteria e **dependências do backend**.

**Objetivos da Fase 1:**
1. Autenticação Multi-Tenant com seleção de organização
2. Sistema de controle de acesso baseado em Roles (UI)
3. Interface de submissão diária de Emociograma
4. Dashboards de relatórios e analytics (Gestor e Admin)
5. Sistema de alertas com notificações em tempo real
6. Funcionalidades de Export e conformidade LGPD

---

## Marcos (Milestones)

### [Marco 1: Autenticação Multi-Tenant](MILESTONE_01_Autenticacao_MultiTenant.md)
**Semana 1** | **Backend:** Backend M1 (Organizations)

Estender autenticação existente para suportar seleção de organização.

**Entregáveis Principais:**
- Organization types e service
- Organization Zustand store com persistência
- Organization Selector component
- HTTP Client injetando `x-organization-id` header
- Página de seleção de organização
- Hook `useCurrentOrganization`

**Arquivos Críticos:**
- `types/organization.types.ts`
- `stores/organization.store.ts`
- `features/organizations/services/organization.service.ts`
- `features/organizations/components/organization-selector.tsx`
- `app/select-organization/page.tsx`

**Dependências Backend:**
- ✅ Backend M1: Tabela `organizations`, endpoint `/users/me/organizations`

---

### [Marco 2: Sistema de Roles Frontend](MILESTONE_02_Sistema_Roles_Frontend.md)
**Semana 1-2** | **Backend:** Backend M2 (Enhanced RBAC)

Sistema de controle de acesso no frontend com componentes de proteção.

**Entregáveis Principais:**
- Roles types e permissions
- Hook `usePermissions` para verificação de permissões
- Components: `<Can>`, `<ProtectedRoute>`
- Sidebar navigation com menu filtrado por role
- Dashboards específicos por role (Admin, Gestor, Colaborador)
- Página 403 (Access Denied)

**Arquivos Críticos:**
- `types/roles.types.ts`
- `shared/hooks/use-permissions.ts`
- `shared/components/can.tsx`
- `shared/components/protected-route.tsx`
- `shared/components/sidebar-navigation.tsx`

**Dependências Backend:**
- ✅ Backend M2: Roles hierárquicos, permissions, `getRolesByOrganization()`

---

### [Marco 3: Interface Emociograma](MILESTONE_03_Interface_Emociograma.md)
**Semana 2-3** | **Backend:** Backend M3 (Emociograma Core) + M5 (API Endpoints)

Interface de submissão e visualização de emociograma.

**Entregáveis Principais:**
- Emociograma types (submission, category)
- Emociograma service (submit, getMySubmissions)
- EmotionSelector component (10 emojis interativos)
- CategorySelector component
- SubmitEmociogramaForm (React Hook Form + Zod)
- EmociogramaHistory component (lista com paginação)
- Páginas: submissão e histórico

**Arquivos Críticos:**
- `types/emociograma.types.ts`
- `features/emociograma/services/emociograma.service.ts`
- `features/emociograma/components/emotion-selector.tsx`
- `features/emociograma/components/submit-emociograma-form.tsx`
- `app/dashboard/emociograma/novo/page.tsx`

**Dependências Backend:**
- ✅ Backend M3: Tabelas emociograma, entities, repositories
- ✅ Backend M5: `POST /emociograma`, `GET /emociograma/my-submissions`, `GET /emociograma/categories`

---

### [Marco 4: Relatórios e Analytics](MILESTONE_04_Relatorios_Analytics.md)
**Semana 3-4** | **Backend:** Backend M3 + M5 (agregações e endpoints)

Dashboards de relatórios com gráficos e analytics.

**Entregáveis Principais:**
- Reports types e service
- ReportFilters component (date range, departamento, equipe)
- ReportSummaryCards (KPIs)
- EmotionTrendChart (Recharts line chart)
- DistributionCharts (bar chart + pie chart)
- MotivationRanking component
- Páginas: relatórios de equipe e organização

**Arquivos Críticos:**
- `types/reports.types.ts`
- `features/emociograma/services/reports.service.ts`
- `features/emociograma/components/emotion-trend-chart.tsx`
- `app/dashboard/relatorios/equipe/page.tsx`
- `app/dashboard/relatorios/organizacao/page.tsx`

**Dependências Backend:**
- ✅ Backend M3: Repository com `getAggregatedByTimeRange()`, `getMostMotivated()`, `getLeastMotivated()`
- ✅ Backend M5: `GET /emociograma/team/aggregated`, `GET /emociograma/organization/report`

---

### [Marco 5: Sistema de Alertas - UI](MILESTONE_05_Sistema_Alertas_UI.md)
**Semana 4** | **Backend:** Backend M4 (Alert System) + M5 (endpoints)

Interface de gerenciamento de alertas para Gestores/Admins.

**Entregáveis Principais:**
- Alerts types e service
- AlertDashboardCards (KPIs de alertas)
- AlertsList component com paginação
- ResolveAlertModal (resolução com notas)
- Hook `useAlertNotifications` (polling)
- Página de alertas com auto-refresh

**Arquivos Críticos:**
- `types/alerts.types.ts`
- `features/emociograma/services/alerts.service.ts`
- `features/emociograma/components/alerts-list.tsx`
- `features/emociograma/hooks/use-alert-notifications.ts`
- `app/dashboard/alertas/page.tsx`

**Dependências Backend:**
- ✅ Backend M4: Tabela `emociograma_alerts`, alert service
- ✅ Backend M5: `GET /alerts/dashboard`, `GET /alerts`, `PATCH /alerts/:id/resolve`

---

### [Marco 6: Exportação e LGPD](MILESTONE_06_Exportacao_LGPD_UI.md)
**Semana 4-5** | **Backend:** Backend M5 (Export) + M6 (LGPD)

Export de dados e conformidade LGPD.

**Entregáveis Principais:**
- Export service (CSV/Excel download)
- LGPD service (export, anonymize, delete)
- ExportButton component (dropdown com formatos)
- LGPDDataExport component
- LGPDDataAnonymization component
- LGPDDataDeletion component (confirmação dupla)
- Página de configurações de privacidade

**Arquivos Críticos:**
- `features/emociograma/services/export.service.ts`
- `features/users/services/lgpd.service.ts`
- `features/emociograma/components/export-button.tsx`
- `features/users/components/lgpd-data-*.tsx`
- `app/dashboard/configuracoes/privacidade/page.tsx`

**Dependências Backend:**
- ✅ Backend M5: `GET /emociograma/export` (CSV/Excel)
- ✅ Backend M6: `GET /users/data-export`, `POST /users/data-anonymize`, `DELETE /users/data-deletion`

---

### [Marco 7: Testes e Documentação](MILESTONE_07_Testes_Documentacao_Frontend.md)
**Semana 5-6** | **Backend:** Backend M7 (sistema completo)

Testes completos, otimização, documentação final.

**Entregáveis Principais:**
- ≥70% cobertura de testes (unit + integration)
- Playwright E2E tests (colaborador, gestor, admin journeys)
- Lighthouse optimization (≥90 performance score)
- Accessibility tests (WCAG 2.1 AA)
- README atualizado
- Guia do usuário
- QA report final

**Deliverables Críticos:**
- Todos os testes passando
- Performance benchmarks atingidos
- Documentação completa
- Pronto para produção

**Dependências Backend:**
- ✅ Backend M7: API completa, migrations aplicadas, seed data

---

## Sequência de Implementação

```
Semana 1:
  └─ Frontend M1: Autenticação Multi-Tenant
  └─ Frontend M2: Sistema Roles (início)
  └─ ⚠️ Aguardar: Backend M1 completo

Semana 2:
  └─ Frontend M2: Sistema Roles (completo)
  └─ Frontend M3: Interface Emociograma (início)
  └─ ⚠️ Aguardar: Backend M2 e M3 completos

Semana 3:
  └─ Frontend M3: Interface Emociograma (completo)
  └─ Frontend M4: Relatórios (início)
  └─ ⚠️ Aguardar: Backend M3 e M5 completos

Semana 4:
  └─ Frontend M4: Relatórios (completo)
  └─ Frontend M5: Alertas UI
  └─ Frontend M6: Export e LGPD (início)
  └─ ⚠️ Aguardar: Backend M4, M5 e M6 completos

Semana 5:
  └─ Frontend M6: Export e LGPD (completo)
  └─ Frontend M7: Testes (início)
  └─ ⚠️ Aguardar: Backend M7 completo

Semana 6:
  └─ Frontend M7: Testes (completo)
  └─ QA final integrado (Frontend + Backend)
  └─ Deploy para produção
```

---

## Grafo de Dependências

### Frontend ↔ Backend Integration

```
Frontend M1 (Auth Multi-Tenant)
  ↓ precisa de
Backend M1 (Organizations API)
  ↓
Frontend M2 (Roles System)
  ↓ precisa de
Backend M2 (Enhanced RBAC)
  ↓
Frontend M3 (Emociograma UI)
  ↓ precisa de
Backend M3 (Emociograma Core) + Backend M5 (API Endpoints)
  ↓
Frontend M4 (Relatórios)
  ↓ precisa de
Backend M3 (aggregations) + Backend M5 (report endpoints)
  ↓
Frontend M5 (Alertas UI)
  ↓ precisa de
Backend M4 (Alert System) + Backend M5 (alert endpoints)
  ↓
Frontend M6 (Export + LGPD)
  ↓ precisa de
Backend M5 (Export) + Backend M6 (LGPD)
  ↓
Frontend M7 (Testes E2E)
  ↓ precisa de
Backend M7 (Sistema Completo)
```

**Caminho Crítico:** M1 → M2 → M3 → M4 → M6 → M7

---

## Matriz de Dependências Backend

| Frontend Milestone | Backend Milestone Requerido | Endpoints Necessários |
|--------------------|----------------------------|----------------------|
| M1: Auth Multi-Tenant | Backend M1 | `GET /users/me/organizations` |
| M2: Roles System | Backend M2 | Roles hierarchy, `getRolesByOrganization()` |
| M3: Emociograma UI | Backend M3 + M5 | `POST /emociograma`, `GET /emociograma/my-submissions`, `GET /emociograma/categories` |
| M4: Relatórios | Backend M3 + M5 | `GET /emociograma/team/aggregated`, `GET /emociograma/organization/report` |
| M5: Alertas UI | Backend M4 + M5 | `GET /alerts/dashboard`, `GET /alerts`, `PATCH /alerts/:id/resolve` |
| M6: Export + LGPD | Backend M5 + M6 | `GET /emociograma/export`, `GET /users/data-export`, `POST /users/data-anonymize` |
| M7: Testes E2E | Backend M7 | API completa funcionando |

---

## Acompanhamento de Progresso

| Marco | Status | Progresso | Cobertura Testes | Backend Dependency | Notas |
|-------|--------|-----------|------------------|-------------------|-------|
| M1: Auth Multi-Tenant | 🔴 | 0% | N/A | Backend M1 | Aguardar orgs API |
| M2: Roles System | 🔴 | 0% | N/A | Backend M2 | Aguardar RBAC |
| M3: Emociograma UI | 🔴 | 0% | N/A | Backend M3+M5 | Aguardar endpoints |
| M4: Relatórios | 🔴 | 0% | N/A | Backend M3+M5 | Aguardar agregações |
| M5: Alertas UI | 🔴 | 0% | N/A | Backend M4+M5 | Aguardar alerts API |
| M6: Export + LGPD | 🔴 | 0% | N/A | Backend M5+M6 | Aguardar export/LGPD |
| M7: Testes E2E | 🔴 | 0% | N/A | Backend M7 | Aguardar API completa |

**Legenda:**
- 🔴 Não Iniciado (aguardando backend)
- 🟡 Em Progresso
- 🟢 Completo (UI)
- ✅ Completo e Testado (com backend)

---

## Conceitos Principais

### Multi-Tenancy
- Usuário pode ter acesso a múltiplas organizações
- Seleção persiste em localStorage
- Header `x-organization-id` enviado em todas as requisições
- Context global via Zustand store

### Hierarquia de Roles
```
Super Admin (nível 0) - Administrador da plataforma
  └─ Admin (nível 100) - Proprietário da organização
      └─ Gestor (nível 200) - Gerente de equipe
          └─ Colaborador (nível 300) - Funcionário
```

### Emociograma - Escala de Emoções
```
😄 1-5: Emoções POSITIVAS (muito feliz → levemente irritado)
😫 6-10: Emoções NEGATIVAS (cansado → muito triste) [ACIONA ALERTAS]
```

### Controle de Acesso UI

| Recurso | Colaborador | Gestor | Admin |
|---------|-------------|--------|-------|
| Registrar emoção | ✅ | ✅ | ✅ |
| Ver próprio histórico | ✅ | ✅ | ✅ |
| Relatórios da equipe | ❌ | ✅ | ✅ |
| Relatórios da organização | ❌ | ❌ | ✅ |
| Dashboard de alertas | ❌ | ✅ | ✅ |
| Exportar dados (CSV/Excel) | ❌ | ✅ | ✅ |
| Configurações da org | ❌ | ❌ | ✅ |
| LGPD (próprios dados) | ✅ | ✅ | ✅ |

---

## Stack Tecnológico

### Core
- **Next.js:** 16.1.1 (App Router, React Server Components)
- **React:** 19.2.3
- **TypeScript:** 5.x (strict mode)

### State Management
- **Zustand:** 5.x - Global state (auth, organization)
- **React Hook Form:** 7.x - Form state

### UI & Styling
- **Tailwind CSS:** v4
- **Recharts:** Gráficos e charts
- **Lucide Icons:** Icons modernos
- **Sonner:** Toast notifications

### Testing
- **Jest:** 30.x - Unit tests
- **React Testing Library:** 16.x
- **Playwright:** E2E tests
- **Axe-core:** Accessibility tests

### API
- **Axios:** 1.13.x - HTTP client
- **Zod:** 4.x - Validation

---

## Comandos Essenciais

### Desenvolvimento
```bash
# Iniciar dev server
npm run dev              # http://localhost:3001

# Build produção
npm run build
npm run start
```

### Testes
```bash
# Unit tests
npm run test
npm run test:watch
npm run test:coverage

# E2E tests (Playwright)
npx playwright test
npx playwright test --ui          # Modo UI
npx playwright test --debug       # Debug
npx playwright show-report        # Ver relatório
```

### Qualidade
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## Variáveis de Ambiente

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_NAME=PsicoZen
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## Integração com Backend

### Pré-requisitos
- Backend rodando em `http://localhost:3000`
- CORS configurado para aceitar `http://localhost:3001`
- Database com migrations aplicadas
- Seed data criado:
  - Pelo menos 1 organização de teste
  - Usuários com roles variados
  - Categorias de emociograma (10 categorias)

### Headers Enviados
Todas as requisições autenticadas incluem:
```
Authorization: Bearer <access_token>
x-organization-id: <uuid>
```

### Endpoints Utilizados

**Autenticação:**
- `POST /auth/send-magic-link`
- `GET /auth/callback`
- `POST /auth/refresh`
- `POST /auth/logout`

**Organizações:**
- `GET /users/me/organizations`
- `GET /organizations/:id`
- `PATCH /organizations/:id/settings`

**Emociograma:**
- `POST /emociograma`
- `GET /emociograma/my-submissions`
- `GET /emociograma/categories`
- `GET /emociograma/team/aggregated`
- `GET /emociograma/organization/report`
- `GET /emociograma/export`

**Alertas:**
- `GET /alerts/dashboard`
- `GET /alerts`
- `PATCH /alerts/:id/resolve`

**LGPD:**
- `GET /users/data-export`
- `POST /users/data-anonymize`
- `DELETE /users/data-deletion`

---

## Troubleshooting

### Problemas Comuns

**1. "Organization ID não encontrado"**
- Verificar se usuário selecionou organização em `/select-organization`
- Checar localStorage: `psicozen-organization-storage`
- Verificar se backend retorna organizações em `/users/me/organizations`

**2. "403 Forbidden ao acessar relatórios"**
- Verificar se usuário tem role GESTOR ou ADMIN
- Verificar se header `x-organization-id` está sendo enviado
- Checar backend RolesGuard logs

**3. "Gráficos não renderizam"**
- Verificar se Recharts instalado: `npm install recharts`
- Verificar se dados estão no formato correto (array de objetos)
- Abrir console para ver erros

**4. "Tests failing com module errors"**
- Verificar `jest.config.ts` moduleNameMapper
- Verificar `tsconfig.json` paths
- Reiniciar Jest: `npm run test:watch`

**5. "Backend connection refused"**
- Verificar se backend está rodando: `cd ../psicozen-backend && npm run start:dev`
- Verificar `.env` tem `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Verificar CORS no backend

---

## Checklist de Prontidão

### Antes de Deploy

**Código:**
- [ ] Todos os testes passando
- [ ] Cobertura ≥70%
- [ ] Lighthouse score ≥90
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Sem console.errors

**Configuração:**
- [ ] Environment variables configuradas
- [ ] HTTPS configurado
- [ ] Backend URL de produção
- [ ] Analytics configurado (opcional)

**Documentação:**
- [ ] README atualizado
- [ ] User guide criado
- [ ] API integration documentada

**QA:**
- [ ] Testado em Chrome, Firefox, Safari
- [ ] Testado em mobile (iOS + Android)
- [ ] Fluxos completos validados
- [ ] Backend integração testada

---

## Métricas de Sucesso

### Funcional
✅ Colaboradores registram emoções diariamente
✅ Gestores visualizam relatórios de equipe
✅ Admins gerenciam organização completa
✅ Alertas notificam em tempo real
✅ Export CSV/Excel funciona
✅ LGPD compliance implementado

### Técnico
✅ Cobertura de testes ≥70%
✅ Performance Lighthouse ≥90
✅ Core Web Vitals OK (LCP, FID, CLS)
✅ Bundle size < 500KB (gzipped)
✅ Zero bugs críticos

### Negócio
✅ Reduz rastreamento manual (elimina formulários físicos)
✅ Fornece dados em tempo real para RH/Gestores
✅ Melhora tempo de resposta a problemas emocionais
✅ Conformidade regulatória (LGPD)

---

## Preview da Próxima Fase

**Fase 2 - Engagement Features:**
- **Pulse Surveys:** Interface de pesquisas rápidas
- **e-NPS:** Employee Net Promoter Score tracking
- **Quick Feedback:** Sistema de feedback peer-to-peer
- **Communication:** Mural de avisos e mensagens

**Fase 3 - Gamification:**
- **Training Paths:** Trilhas de desenvolvimento
- **Badges & Points:** Sistema de reconhecimento
- **Leaderboards:** Rankings de engajamento

---

## Recursos

### Documentação
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [Recharts](https://recharts.org/)

### Backend
- [Backend Phase 1 Docs](../../psicozen-backend/docs/phase1/README.md)
- [API Swagger](http://localhost:3000/api/docs)

### Suporte
- Issues: https://github.com/psicozen/psicozen-frontend/issues
- Backend Issues: https://github.com/psicozen/psicozen-backend/issues
- Team Chat: [Link do Slack/Discord]

---

## Contribuindo

1. Criar branch: `git checkout -b feature/MILESTONE-XX-nome-tarefa`
2. Implementar tarefa conforme milestone doc
3. Escrever testes (mínimo 70% coverage)
4. Executar linting: `npm run lint`
5. Commit seguindo padrão: `feat: adiciona EmotionSelector component`
6. Criar PR para `develop` branch
7. Aguardar review e aprovação

---

## Deployment

**Staging:**
- URL: https://staging.psicozen.com.br
- Auto-deploy da branch `develop`
- Backend: https://api-staging.psicozen.com.br

**Production:**
- URL: https://psicozen.com.br
- Deploy manual da branch `main`
- Backend: https://api.psicozen.com.br

---

## Contato

- **Product Owner:** [Nome]
- **Tech Lead Backend:** [Nome]
- **Tech Lead Frontend:** [Nome]
- **QA Lead:** [Nome]
