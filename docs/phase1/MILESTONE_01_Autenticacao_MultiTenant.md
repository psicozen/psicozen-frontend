# Marco 1: Autenticação Multi-Tenant e Organizações

**Cronograma:** Semana 1
**Dependências:** Nenhuma
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Estender o sistema de autenticação existente (Magic Link) para suportar seleção de organização e contexto multi-tenant no frontend. Usuários poderão fazer login e selecionar em qual organização desejam trabalhar.

**Entregável Principal:** Sistema de autenticação com seleção de organização funcional.

---

## Detalhamento de Tarefas

### Tarefa 1.1: Atualizar Types - Adicionar Organization

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/types/organization.types.ts`
- [ ] Definir interface `Organization` correspondente ao backend
- [ ] Definir interface `OrganizationSettings`
- [ ] Atualizar `src/types/auth.types.ts` para incluir organizações do usuário
- [ ] Criar enum `OrganizationType`

**Código dos Types:**
```typescript
// src/types/organization.types.ts

export enum OrganizationType {
  COMPANY = 'company',
  DEPARTMENT = 'department',
  TEAM = 'team',
}

export interface OrganizationSettings {
  timezone: string;
  locale: string;
  emociogramaEnabled: boolean;
  alertThreshold: number;
  dataRetentionDays: number;
  anonymityDefault: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  settings: OrganizationSettings;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOrganization {
  organization: Organization;
  roles: string[]; // ['admin', 'gestor', 'colaborador']
}
```

**Atualizar Auth Types:**
```typescript
// src/types/auth.types.ts (ADICIONAR)

import { UserOrganization } from './organization.types';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  bio?: string;
  preferences: UserPreferences;
  organizations?: UserOrganization[]; // NOVO: organizações do usuário
  supabaseUserId?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Critérios de Aceite:**
- ✅ Types da organização criados
- ✅ User atualizado para incluir organizações
- ✅ Types correspondem ao backend

---

### Tarefa 1.2: Criar Organization Service

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar diretório: `src/features/organizations/`
- [ ] Criar `services/organization.service.ts`
- [ ] Implementar métodos:
  - [ ] `getUserOrganizations()` - Listar organizações do usuário
  - [ ] `getOrganizationById()` - Obter detalhes da organização
  - [ ] `updateSettings()` - Atualizar configurações (Admin)
- [ ] Criar `services/organization.service.test.ts`
- [ ] Usar `httpClient` existente para chamadas API

**Service Code:**
```typescript
// src/features/organizations/services/organization.service.ts

import { httpClient } from '@/lib/http/client';
import { Organization, OrganizationSettings, UserOrganization } from '@/types/organization.types';

export class OrganizationService {
  private baseUrl = '/organizations';

  /**
   * Obter organizações do usuário logado
   */
  async getUserOrganizations(): Promise<UserOrganization[]> {
    const response = await httpClient.get<UserOrganization[]>(`/users/me/organizations`);
    return response.success ? response.data : [];
  }

  /**
   * Obter detalhes de organização por ID
   */
  async getOrganizationById(id: string): Promise<Organization | null> {
    const response = await httpClient.get<Organization>(`${this.baseUrl}/${id}`);
    return response.success ? response.data : null;
  }

  /**
   * Atualizar configurações da organização (Admin only)
   */
  async updateSettings(
    organizationId: string,
    settings: Partial<OrganizationSettings>,
  ): Promise<Organization | null> {
    const response = await httpClient.patch<Organization>(
      `${this.baseUrl}/${organizationId}/settings`,
      settings,
    );
    return response.success ? response.data : null;
  }

  /**
   * Criar nova organização (Super Admin only)
   */
  async createOrganization(data: CreateOrganizationData): Promise<Organization | null> {
    const response = await httpClient.post<Organization>(this.baseUrl, data);
    return response.success ? response.data : null;
  }
}

export const organizationService = new OrganizationService();
```

**Service Test:**
```typescript
// src/features/organizations/services/organization.service.test.ts

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { organizationService } from './organization.service';

describe('OrganizationService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('getUserOrganizations', () => {
    it('deve retornar organizações do usuário', async () => {
      const mockOrgs = [
        {
          organization: { id: 'org-123', name: 'Empresa ABC' },
          roles: ['admin'],
        },
      ];

      mock.onGet('/users/me/organizations').reply(200, {
        success: true,
        data: mockOrgs,
      });

      const result = await organizationService.getUserOrganizations();
      expect(result).toEqual(mockOrgs);
    });
  });
});
```

**Critérios de Aceite:**
- ✅ Service criado com métodos de API
- ✅ Testes unitários com ≥80% cobertura
- ✅ Usa httpClient existente
- ✅ Tratamento de erros adequado

---

### Tarefa 1.3: Criar Organization Store (Zustand)

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/stores/organization.store.ts`
- [ ] Definir estado: `selectedOrganization`, `organizations`, `isLoading`
- [ ] Implementar actions:
  - [ ] `fetchUserOrganizations()` - Carregar organizações do usuário
  - [ ] `selectOrganization()` - Selecionar organização ativa
  - [ ] `clearSelection()` - Limpar seleção
- [ ] Adicionar persistência em localStorage
- [ ] Criar seletores otimizados
- [ ] Criar arquivo de teste: `organization.store.test.ts`

**Store Code:**
```typescript
// src/stores/organization.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization, UserOrganization } from '@/types/organization.types';
import { organizationService } from '@/features/organizations/services/organization.service';

interface OrganizationState {
  // Estado
  selectedOrganization: Organization | null;
  organizations: UserOrganization[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserOrganizations: () => Promise<void>;
  selectOrganization: (organizationId: string) => void;
  clearSelection: () => void;
  setOrganizations: (organizations: UserOrganization[]) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      selectedOrganization: null,
      organizations: [],
      isLoading: false,
      error: null,

      // Buscar organizações do usuário
      fetchUserOrganizations: async () => {
        set({ isLoading: true, error: null });

        try {
          const userOrganizations = await organizationService.getUserOrganizations();
          set({ organizations: userOrganizations, isLoading: false });

          // Se apenas uma organização, selecionar automaticamente
          if (userOrganizations.length === 1) {
            const org = userOrganizations[0].organization;
            set({ selectedOrganization: org });
          }
        } catch (error) {
          set({ error: 'Erro ao carregar organizações', isLoading: false });
          console.error('Erro ao buscar organizações:', error);
        }
      },

      // Selecionar organização ativa
      selectOrganization: (organizationId: string) => {
        const { organizations } = get();
        const userOrg = organizations.find(uo => uo.organization.id === organizationId);

        if (userOrg) {
          set({ selectedOrganization: userOrg.organization });
        }
      },

      // Limpar seleção
      clearSelection: () => {
        set({ selectedOrganization: null });
      },

      // Atualizar lista de organizações
      setOrganizations: (organizations: UserOrganization[]) => {
        set({ organizations });
      },
    }),
    {
      name: 'psicozen-organization-storage',
      partialize: (state) => ({
        selectedOrganization: state.selectedOrganization,
      }),
    },
  ),
);

// Seletores otimizados
export const selectSelectedOrganization = (state: OrganizationState) => state.selectedOrganization;
export const selectOrganizations = (state: OrganizationState) => state.organizations;
export const selectOrganizationId = (state: OrganizationState) => state.selectedOrganization?.id;
export const selectOrganizationSettings = (state: OrganizationState) =>
  state.selectedOrganization?.settings;
```

**Store Test:**
```typescript
// src/stores/organization.store.test.ts

import { renderHook, act } from '@testing-library/react';
import { useOrganizationStore } from './organization.store';

describe('useOrganizationStore', () => {
  beforeEach(() => {
    useOrganizationStore.getState().clearSelection();
  });

  it('deve selecionar organização', () => {
    const { result } = renderHook(() => useOrganizationStore());

    const mockOrg = { id: 'org-123', name: 'Empresa ABC' };
    const mockUserOrg = { organization: mockOrg, roles: ['admin'] };

    act(() => {
      result.current.setOrganizations([mockUserOrg]);
      result.current.selectOrganization('org-123');
    });

    expect(result.current.selectedOrganization).toEqual(mockOrg);
  });
});
```

**Critérios de Aceite:**
- ✅ Store criada com Zustand
- ✅ Persistência em localStorage
- ✅ Seletores otimizados
- ✅ Testes com ≥80% cobertura

---

### Tarefa 1.4: Atualizar HTTP Client - Injetar Organization ID

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Atualizar `src/lib/http/client.ts`
- [ ] Adicionar interceptor de request para injetar header `x-organization-id`
- [ ] Obter organization ID do Zustand store
- [ ] Tratar rotas que não precisam de organization (auth, public routes)
- [ ] Atualizar testes

**HTTP Client Update:**
```typescript
// src/lib/http/client.ts (ATUALIZAR REQUEST INTERCEPTOR)

import { useOrganizationStore } from '@/stores/organization.store';

// Request interceptor - adicionar APÓS auth token injection
httpClient.interceptors.request.use(
  (config) => {
    // ... (código existente de auth token)

    // Injetar organization ID se disponível
    const organizationId = useOrganizationStore.getState().selectedOrganization?.id;

    if (organizationId) {
      config.headers['x-organization-id'] = organizationId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
```

**Critérios de Aceite:**
- ✅ Header `x-organization-id` injetado automaticamente
- ✅ Não quebra rotas públicas
- ✅ Testes atualizados

---

### Tarefa 1.5: Criar Organization Selector Component

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/features/organizations/components/organization-selector.tsx`
- [ ] Usar shadcn/ui `<Select>` component
- [ ] Carregar organizações do usuário
- [ ] Permitir seleção de organização
- [ ] Mostrar nome e tipo da organização
- [ ] Persistir seleção automaticamente
- [ ] Criar `organization-selector.test.tsx`

**Component Code:**
```typescript
// src/features/organizations/components/organization-selector.tsx

'use client';

import { useEffect } from 'react';
import { useOrganizationStore } from '@/stores/organization.store';
import { Building2, ChevronDown } from 'lucide-react';

export function OrganizationSelector() {
  const {
    organizations,
    selectedOrganization,
    fetchUserOrganizations,
    selectOrganization,
    isLoading,
  } = useOrganizationStore();

  useEffect(() => {
    fetchUserOrganizations();
  }, [fetchUserOrganizations]);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Carregando...</div>;
  }

  if (organizations.length === 0) {
    return null;
  }

  // Se apenas uma organização, não mostrar selector
  if (organizations.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Building2 className="h-4 w-4" />
        <span>{organizations[0].organization.name}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <label htmlFor="org-selector" className="sr-only">
        Selecionar organização
      </label>
      <select
        id="org-selector"
        value={selectedOrganization?.id || ''}
        onChange={(e) => selectOrganization(e.target.value)}
        className="
          flex items-center gap-2 px-4 py-2 text-sm font-medium
          bg-white border border-gray-300 rounded-md
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <option value="" disabled>
          Selecionar organização...
        </option>
        {organizations.map((userOrg) => (
          <option key={userOrg.organization.id} value={userOrg.organization.id}>
            {userOrg.organization.name}
            {userOrg.roles.length > 0 && ` (${userOrg.roles.join(', ')})`}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Component Test:**
```typescript
// src/features/organizations/components/organization-selector.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { OrganizationSelector } from './organization-selector';
import { useOrganizationStore } from '@/stores/organization.store';

jest.mock('@/stores/organization.store');

describe('OrganizationSelector', () => {
  it('deve renderizar organizações', () => {
    (useOrganizationStore as unknown as jest.Mock).mockReturnValue({
      organizations: [
        {
          organization: { id: 'org-1', name: 'Empresa A' },
          roles: ['admin'],
        },
        {
          organization: { id: 'org-2', name: 'Empresa B' },
          roles: ['gestor'],
        },
      ],
      selectedOrganization: null,
      selectOrganization: jest.fn(),
      fetchUserOrganizations: jest.fn(),
      isLoading: false,
    });

    render(<OrganizationSelector />);

    expect(screen.getByText('Empresa A (admin)')).toBeInTheDocument();
    expect(screen.getByText('Empresa B (gestor)')).toBeInTheDocument();
  });

  it('deve selecionar organização ao clicar', () => {
    const mockSelectOrganization = jest.fn();

    (useOrganizationStore as unknown as jest.Mock).mockReturnValue({
      organizations: [
        {
          organization: { id: 'org-1', name: 'Empresa A' },
          roles: ['admin'],
        },
      ],
      selectedOrganization: null,
      selectOrganization: mockSelectOrganization,
      fetchUserOrganizations: jest.fn(),
      isLoading: false,
    });

    render(<OrganizationSelector />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'org-1' } });

    expect(mockSelectOrganization).toHaveBeenCalledWith('org-1');
  });
});
```

**Critérios de Aceite:**
- ✅ Component renderiza lista de organizações
- ✅ Seleção persiste no store
- ✅ Auto-seleciona se apenas 1 organização
- ✅ Testes com ≥80% cobertura

---

### Tarefa 1.6: Atualizar Layout - Adicionar Organization Selector

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Atualizar `app/layout.tsx` ou criar dashboard layout
- [ ] Adicionar `<OrganizationSelector />` no header/navbar
- [ ] Posicionar próximo ao user menu
- [ ] Garantir responsividade mobile

**Layout Update:**
```typescript
// app/dashboard/layout.tsx (CRIAR ou ATUALIZAR)

import { OrganizationSelector } from '@/features/organizations/components/organization-selector';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">PsicoZen</h1>

            <div className="flex items-center gap-4">
              {/* Organization Selector */}
              <OrganizationSelector />

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Selector visível no header
- ✅ Responsivo em mobile
- ✅ Não quebra layout existente

---

### Tarefa 1.7: Criar Hook - useCurrentOrganization

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/features/organizations/hooks/use-current-organization.ts`
- [ ] Hook retorna organização selecionada
- [ ] Hook retorna roles do usuário na organização
- [ ] Hook retorna settings da organização
- [ ] Criar `use-current-organization.test.ts`

**Hook Code:**
```typescript
// src/features/organizations/hooks/use-current-organization.ts

import { useOrganizationStore, selectSelectedOrganization, selectOrganizations, selectOrganizationSettings } from '@/stores/organization.store';

export interface UseCurrentOrganizationReturn {
  organization: Organization | null;
  organizationId: string | null;
  settings: OrganizationSettings | null;
  userRoles: string[];
  isAdmin: boolean;
  isGestor: boolean;
  isColaborador: boolean;
  hasRole: (role: string) => boolean;
}

export function useCurrentOrganization(): UseCurrentOrganizationReturn {
  const organization = useOrganizationStore(selectSelectedOrganization);
  const organizations = useOrganizationStore(selectOrganizations);
  const settings = useOrganizationStore(selectOrganizationSettings);

  // Encontrar roles do usuário na organização selecionada
  const userOrg = organizations.find(uo => uo.organization.id === organization?.id);
  const userRoles = userOrg?.roles || [];

  return {
    organization,
    organizationId: organization?.id || null,
    settings,
    userRoles,
    isAdmin: userRoles.includes('admin'),
    isGestor: userRoles.includes('gestor'),
    isColaborador: userRoles.includes('colaborador'),
    hasRole: (role: string) => userRoles.includes(role),
  };
}
```

**Hook Test:**
```typescript
// src/features/organizations/hooks/use-current-organization.test.ts

import { renderHook } from '@testing-library/react';
import { useCurrentOrganization } from './use-current-organization';
import { useOrganizationStore } from '@/stores/organization.store';

jest.mock('@/stores/organization.store');

describe('useCurrentOrganization', () => {
  it('deve retornar roles do usuário na organização', () => {
    (useOrganizationStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        selectedOrganization: { id: 'org-123', name: 'Empresa ABC' },
        organizations: [
          {
            organization: { id: 'org-123', name: 'Empresa ABC' },
            roles: ['admin', 'gestor'],
          },
        ],
      };
      return selector(state);
    });

    const { result } = renderHook(() => useCurrentOrganization());

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isGestor).toBe(true);
    expect(result.current.isColaborador).toBe(false);
  });
});
```

**Critérios de Aceite:**
- ✅ Hook retorna organização e roles
- ✅ Helpers booleanos funcionam
- ✅ Testes com ≥80% cobertura

---

### Tarefa 1.8: Middleware de Proteção - Verificar Organization

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Atualizar `middleware.ts`
- [ ] Verificar se usuário tem organização selecionada
- [ ] Redirecionar para `/select-organization` se não tiver
- [ ] Permitir rotas públicas sem organização
- [ ] Atualizar testes de middleware

**Middleware Update:**
```typescript
// middleware.ts (ADICIONAR VERIFICAÇÃO)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/auth/callback'];
const NO_ORG_REQUIRED = [...PUBLIC_ROUTES, '/select-organization'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar autenticação (código existente)
  const accessToken = request.cookies.get('access_token')?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar organização selecionada
  if (!NO_ORG_REQUIRED.includes(pathname)) {
    const organizationId = request.cookies.get('selected_organization_id')?.value;

    if (!organizationId) {
      return NextResponse.redirect(new URL('/select-organization', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Critérios de Aceite:**
- ✅ Middleware verifica organização
- ✅ Redireciona para seleção se necessário
- ✅ Não quebra rotas públicas

---

### Tarefa 1.9: Criar Página - Select Organization

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `app/select-organization/page.tsx`
- [ ] Listar organizações do usuário
- [ ] Cards clicáveis para seleção
- [ ] Mostrar roles do usuário em cada org
- [ ] Redirecionar para dashboard após seleção
- [ ] Criar teste

**Page Code:**
```typescript
// app/select-organization/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizationStore } from '@/stores/organization.store';
import { Building2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function SelectOrganizationPage() {
  const router = useRouter();
  const { organizations, fetchUserOrganizations, selectOrganization, isLoading } =
    useOrganizationStore();

  useEffect(() => {
    fetchUserOrganizations();
  }, [fetchUserOrganizations]);

  const handleSelectOrganization = (organizationId: string) => {
    selectOrganization(organizationId);
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando organizações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Selecione uma Organização</h1>
          <p className="mt-2 text-gray-600">
            Você tem acesso a {organizations.length} organização{organizations.length > 1 ? 'ões' : ''}
          </p>
        </div>

        <div className="grid gap-4">
          {organizations.map((userOrg) => (
            <button
              key={userOrg.organization.id}
              onClick={() => handleSelectOrganization(userOrg.organization.id)}
              className="
                flex items-start gap-4 p-6 bg-white border-2 border-gray-200
                rounded-lg hover:border-blue-500 hover:shadow-md transition-all
                text-left
              "
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {userOrg.organization.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tipo: {userOrg.organization.type}
                </p>
                <div className="flex gap-2 mt-2">
                  {userOrg.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Página lista organizações do usuário
- ✅ Seleção redireciona para dashboard
- ✅ Mostra roles do usuário
- ✅ Design responsivo

---

### Tarefa 1.10: Atualizar Auth Store - Incluir Organizations

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Atualizar `src/stores/auth.store.ts`
- [ ] Adicionar campo `organizations` ao user
- [ ] Atualizar método `login()` para buscar organizações após login
- [ ] Limpar organization store ao fazer logout
- [ ] Atualizar testes

**Auth Store Update:**
```typescript
// src/stores/auth.store.ts (ATUALIZAR LOGIN E LOGOUT)

import { useOrganizationStore } from './organization.store';

// Na função login (APÓS sucesso):
login: async (credentials: LoginCredentials) => {
  set({ isLoading: true, error: null });

  try {
    const response = await authService.login(credentials);
    set({ user: response.user, isAuthenticated: true, isLoading: false });

    // Buscar organizações do usuário
    await useOrganizationStore.getState().fetchUserOrganizations();

    return response;
  } catch (error) {
    // ... (erro handling)
  }
},

// Na função logout (ADICIONAR):
logout: async () => {
  try {
    await authService.logout();
    set({ user: null, isAuthenticated: false });

    // Limpar organization store
    useOrganizationStore.getState().clearSelection();
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
},
```

**Critérios de Aceite:**
- ✅ Login busca organizações automaticamente
- ✅ Logout limpa organization store
- ✅ Testes atualizados

---

## Definição de Pronto

Marco 1 está completo quando:

- ✅ **Types:** Types de organização criados e integrados
- ✅ **Service:** OrganizationService implementado com testes
- ✅ **Store:** Organization Zustand store com persistência
- ✅ **HTTP Client:** Header `x-organization-id` injetado automaticamente
- ✅ **Components:** OrganizationSelector funcional
- ✅ **Pages:** Página de seleção de organização
- ✅ **Integration:** Auth store integrado com organization store
- ✅ **Tests:** Cobertura ≥80% (unit tests)

---

## Dependências para Próximos Marcos

- **Marco 2 (Sistema de Roles):** Requer `useCurrentOrganization` hook
- **Marco 3 (Interface Emociograma):** Requer organization ID para submissões

---

## Integração com Backend

**Endpoints Utilizados:**
- `GET /users/me/organizations` - Listar organizações do usuário
- `GET /organizations/:id` - Detalhes da organização
- `PATCH /organizations/:id/settings` - Atualizar settings (Admin)

**Headers Enviados:**
- `Authorization: Bearer <access_token>`
- `x-organization-id: <uuid>` - Context da organização

---

## Recursos

- [Zustand Persist](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
