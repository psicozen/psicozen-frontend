# Marco 2: Sistema de Roles no Frontend

**Cronograma:** Semana 1-2
**Dependências:** Marco 1 (Organization Store)
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Implementar sistema de controle de acesso baseado em roles (Admin, Gestor, Colaborador) no frontend com componentes de proteção, hooks de autorização e renderização condicional baseada em permissões.

**Entregável Principal:** Interface adapta-se automaticamente aos roles do usuário, ocultando/mostrando funcionalidades conforme permissões.

---

## Detalhamento de Tarefas

### Tarefa 2.1: Criar Types - Roles e Permissions

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/types/roles.types.ts`
- [ ] Definir enum `Role` (deve corresponder ao backend)
- [ ] Definir enum `EmociogramaPermissions`
- [ ] Definir interface `RolePermissions`
- [ ] Criar type guards

**Types Code:**
```typescript
// src/types/roles.types.ts

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  GESTOR = 'gestor',
  COLABORADOR = 'colaborador',
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 0,
  [Role.ADMIN]: 100,
  [Role.GESTOR]: 200,
  [Role.COLABORADOR]: 300,
};

export enum EmociogramaPermissions {
  // Colaborador
  SUBMIT_OWN = 'emociograma:submit:own',
  VIEW_OWN = 'emociograma:view:own',

  // Gestor
  VIEW_TEAM_AGGREGATED = 'emociograma:view:team_aggregated',
  VIEW_TEAM_ANONYMIZED = 'emociograma:view:team_anonymized',
  EXPORT_TEAM_DATA = 'emociograma:export:team',

  // Admin
  VIEW_ALL_AGGREGATED = 'emociograma:view:all_aggregated',
  VIEW_ALL_IDENTIFIED = 'emociograma:view:all_identified',
  EXPORT_ALL_DATA = 'emociograma:export:all',
  CONFIGURE_ALERTS = 'emociograma:configure:alerts',
  MANAGE_CATEGORIES = 'emociograma:manage:categories',
}

export interface RolePermissions {
  [Role.COLABORADOR]: EmociogramaPermissions[];
  [Role.GESTOR]: EmociogramaPermissions[];
  [Role.ADMIN]: EmociogramaPermissions[];
  [Role.SUPER_ADMIN]: EmociogramaPermissions[];
}

export const EMOCIOGRAMA_ROLE_PERMISSIONS: RolePermissions = {
  [Role.COLABORADOR]: [
    EmociogramaPermissions.SUBMIT_OWN,
    EmociogramaPermissions.VIEW_OWN,
  ],
  [Role.GESTOR]: [
    EmociogramaPermissions.SUBMIT_OWN,
    EmociogramaPermissions.VIEW_OWN,
    EmociogramaPermissions.VIEW_TEAM_AGGREGATED,
    EmociogramaPermissions.VIEW_TEAM_ANONYMIZED,
    EmociogramaPermissions.EXPORT_TEAM_DATA,
  ],
  [Role.ADMIN]: [
    EmociogramaPermissions.SUBMIT_OWN,
    EmociogramaPermissions.VIEW_OWN,
    EmociogramaPermissions.VIEW_TEAM_AGGREGATED,
    EmociogramaPermissions.VIEW_TEAM_ANONYMIZED,
    EmociogramaPermissions.EXPORT_TEAM_DATA,
    EmociogramaPermissions.VIEW_ALL_AGGREGATED,
    EmociogramaPermissions.VIEW_ALL_IDENTIFIED,
    EmociogramaPermissions.EXPORT_ALL_DATA,
    EmociogramaPermissions.CONFIGURE_ALERTS,
    EmociogramaPermissions.MANAGE_CATEGORIES,
  ],
  [Role.SUPER_ADMIN]: [
    // Todas as permissões
    ...Object.values(EmociogramaPermissions),
  ],
};

// Type guards
export function isRole(value: string): value is Role {
  return Object.values(Role).includes(value as Role);
}

export function hasHigherRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] <= ROLE_HIERARCHY[requiredRole];
}
```

**Critérios de Aceite:**
- ✅ Enums correspondem ao backend
- ✅ Mapeamento de permissões completo
- ✅ Type guards implementados

---

### Tarefa 2.2: Criar Hook - usePermissions

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/shared/hooks/use-permissions.ts`
- [ ] Hook verifica se usuário tem permissão específica
- [ ] Hook verifica se usuário tem role específico
- [ ] Hook verifica hierarquia de roles
- [ ] Criar `use-permissions.test.ts`

**Hook Code:**
```typescript
// src/shared/hooks/use-permissions.ts

import { useCurrentOrganization } from '@/features/organizations/hooks/use-current-organization';
import { Role, EmociogramaPermissions, EMOCIOGRAMA_ROLE_PERMISSIONS, hasHigherRole } from '@/types/roles.types';

export interface UsePermissionsReturn {
  hasPermission: (permission: EmociogramaPermissions) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  canAccess: (requiredRole: Role) => boolean;
  userRoles: string[];
}

export function usePermissions(): UsePermissionsReturn {
  const { userRoles } = useCurrentOrganization();

  /**
   * Verifica se usuário tem permissão específica
   */
  const hasPermission = (permission: EmociogramaPermissions): boolean => {
    return userRoles.some(role => {
      const rolePermissions = EMOCIOGRAMA_ROLE_PERMISSIONS[role as Role];
      return rolePermissions?.includes(permission);
    });
  };

  /**
   * Verifica se usuário tem role específico
   */
  const hasRole = (role: Role): boolean => {
    return userRoles.includes(role);
  };

  /**
   * Verifica se usuário tem pelo menos um dos roles
   */
  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };

  /**
   * Verifica se usuário pode acessar funcionalidade que requer role mínimo
   * Usa hierarquia: Admin pode acessar o que Gestor acessa
   */
  const canAccess = (requiredRole: Role): boolean => {
    return userRoles.some(userRole => {
      return hasHigherRole(userRole as Role, requiredRole);
    });
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccess,
    userRoles,
  };
}
```

**Hook Test:**
```typescript
// src/shared/hooks/use-permissions.test.ts

import { renderHook } from '@testing-library/react';
import { usePermissions } from './use-permissions';
import { useCurrentOrganization } from '@/features/organizations/hooks/use-current-organization';
import { Role, EmociogramaPermissions } from '@/types/roles.types';

jest.mock('@/features/organizations/hooks/use-current-organization');

describe('usePermissions', () => {
  it('deve retornar true se usuário tem permissão', () => {
    (useCurrentOrganization as jest.Mock).mockReturnValue({
      userRoles: ['admin'],
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(EmociogramaPermissions.VIEW_ALL_AGGREGATED)).toBe(true);
  });

  it('deve retornar false se usuário não tem permissão', () => {
    (useCurrentOrganization as jest.Mock).mockReturnValue({
      userRoles: ['colaborador'],
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(EmociogramaPermissions.VIEW_ALL_AGGREGATED)).toBe(false);
  });

  it('deve verificar hierarquia corretamente (Admin pode acessar Gestor)', () => {
    (useCurrentOrganization as jest.Mock).mockReturnValue({
      userRoles: ['admin'],
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canAccess(Role.GESTOR)).toBe(true);
  });
});
```

**Critérios de Aceite:**
- ✅ Hook verifica permissões corretamente
- ✅ Hierarquia de roles respeitada
- ✅ Testes com ≥80% cobertura

---

### Tarefa 2.3: Criar Component - ProtectedRoute

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/shared/components/protected-route.tsx`
- [ ] Component verifica se usuário tem role necessário
- [ ] Redireciona ou mostra erro 403 se não autorizado
- [ ] Suportar múltiplos roles (any ou all)
- [ ] Criar `protected-route.test.tsx`

**Component Code:**
```typescript
// src/shared/components/protected-route.tsx

'use client';

import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role } from '@/types/roles.types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: Role[];
  requireAll?: boolean; // Se true, requer TODOS os roles. Se false, requer QUALQUER um
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requireAll = false,
  fallback,
}: ProtectedRouteProps) {
  const { hasAnyRole, hasRole } = usePermissions();
  const router = useRouter();

  const hasAccess = requireAll
    ? requiredRoles.every(role => hasRole(role))
    : hasAnyRole(requiredRoles);

  useEffect(() => {
    if (!hasAccess && !fallback) {
      // Redirecionar para página de acesso negado
      router.push('/403');
    }
  }, [hasAccess, fallback, router]);

  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
}
```

**Component Test:**
```typescript
// src/shared/components/protected-route.test.tsx

import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './protected-route';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role } from '@/types/roles.types';

jest.mock('@/shared/hooks/use-permissions');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('ProtectedRoute', () => {
  it('deve renderizar children se usuário tem role', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasAnyRole: jest.fn().mockReturnValue(true),
      hasRole: jest.fn().mockReturnValue(true),
    });

    render(
      <ProtectedRoute requiredRoles={[Role.ADMIN]}>
        <div>Conteúdo protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument();
  });

  it('deve mostrar fallback se usuário não tem role', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasAnyRole: jest.fn().mockReturnValue(false),
      hasRole: jest.fn().mockReturnValue(false),
    });

    render(
      <ProtectedRoute requiredRoles={[Role.ADMIN]} fallback={<div>Sem acesso</div>}>
        <div>Conteúdo protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Sem acesso')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo protegido')).not.toBeInTheDocument();
  });
});
```

**Critérios de Aceite:**
- ✅ Component protege rotas por role
- ✅ Fallback funciona
- ✅ Redireciona se não autorizado
- ✅ Testes com ≥80% cobertura

---

### Tarefa 2.4: Criar Component - Can (Renderização Condicional)

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/shared/components/can.tsx`
- [ ] Component renderiza children apenas se usuário tem permissão/role
- [ ] Suportar verificação por permission ou role
- [ ] Suportar fallback
- [ ] Criar `can.test.tsx`

**Component Code:**
```typescript
// src/shared/components/can.tsx

'use client';

import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role, EmociogramaPermissions } from '@/types/roles.types';

interface CanProps {
  children: React.ReactNode;
  permission?: EmociogramaPermissions;
  role?: Role;
  anyRole?: Role[];
  fallback?: React.ReactNode;
}

export function Can({ children, permission, role, anyRole, fallback }: CanProps) {
  const { hasPermission, hasRole, hasAnyRole } = usePermissions();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (role) {
    hasAccess = hasRole(role);
  } else if (anyRole) {
    hasAccess = hasAnyRole(anyRole);
  }

  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
}
```

**Usage Example:**
```typescript
// Uso em componentes

<Can permission={EmociogramaPermissions.VIEW_ALL_AGGREGATED}>
  <AdminDashboard />
</Can>

<Can role={Role.GESTOR}>
  <TeamReportButton />
</Can>

<Can anyRole={[Role.ADMIN, Role.GESTOR]}>
  <ExportButton />
</Can>

<Can
  permission={EmociogramaPermissions.CONFIGURE_ALERTS}
  fallback={<p>Você não tem permissão para configurar alertas</p>}
>
  <AlertSettingsForm />
</Can>
```

**Component Test:**
```typescript
// src/shared/components/can.test.tsx

import { render, screen } from '@testing-library/react';
import { Can } from './can';
import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role, EmociogramaPermissions } from '@/types/roles.types';

jest.mock('@/shared/hooks/use-permissions');

describe('Can', () => {
  it('deve renderizar children se usuário tem permissão', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(true),
    });

    render(
      <Can permission={EmociogramaPermissions.VIEW_ALL_AGGREGATED}>
        <div>Dashboard Admin</div>
      </Can>,
    );

    expect(screen.getByText('Dashboard Admin')).toBeInTheDocument();
  });

  it('não deve renderizar se usuário não tem permissão', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false),
    });

    render(
      <Can permission={EmociogramaPermissions.VIEW_ALL_AGGREGATED}>
        <div>Dashboard Admin</div>
      </Can>,
    );

    expect(screen.queryByText('Dashboard Admin')).not.toBeInTheDocument();
  });

  it('deve mostrar fallback se não autorizado', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasRole: jest.fn().mockReturnValue(false),
    });

    render(
      <Can role={Role.ADMIN} fallback={<div>Acesso negado</div>}>
        <div>Admin Panel</div>
      </Can>,
    );

    expect(screen.getByText('Acesso negado')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });
});
```

**Critérios de Aceite:**
- ✅ Component renderiza condicionalmente
- ✅ Suporta permission, role, anyRole
- ✅ Fallback funciona
- ✅ Testes com ≥80% cobertura

---

### Tarefa 2.5: Criar useRoleRedirect Hook

**Prioridade:** 🟢 Média
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/shared/hooks/use-role-redirect.ts`
- [ ] Hook redireciona usuário baseado em role
- [ ] Útil para redirecionar após login
- [ ] Admin → `/dashboard/admin`
- [ ] Gestor → `/dashboard/gestor`
- [ ] Colaborador → `/dashboard/colaborador`
- [ ] Criar teste

**Hook Code:**
```typescript
// src/shared/hooks/use-role-redirect.ts

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentOrganization } from '@/features/organizations/hooks/use-current-organization';
import { Role } from '@/types/roles.types';

const ROLE_ROUTES: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/dashboard/super-admin',
  [Role.ADMIN]: '/dashboard/admin',
  [Role.GESTOR]: '/dashboard/gestor',
  [Role.COLABORADOR]: '/dashboard',
};

export function useRoleRedirect(enabled: boolean = true) {
  const router = useRouter();
  const { userRoles } = useCurrentOrganization();

  useEffect(() => {
    if (!enabled || userRoles.length === 0) return;

    // Pegar role mais alto (menor hierarchy_level)
    const highestRole = userRoles.includes(Role.SUPER_ADMIN)
      ? Role.SUPER_ADMIN
      : userRoles.includes(Role.ADMIN)
      ? Role.ADMIN
      : userRoles.includes(Role.GESTOR)
      ? Role.GESTOR
      : Role.COLABORADOR;

    const targetRoute = ROLE_ROUTES[highestRole];

    if (targetRoute) {
      router.push(targetRoute);
    }
  }, [enabled, userRoles, router]);
}
```

**Critérios de Aceite:**
- ✅ Hook redireciona baseado em role
- ✅ Role mais alto tem prioridade
- ✅ Pode ser desabilitado

---

### Tarefa 2.6: Criar Página 403 - Access Denied

**Prioridade:** 🟢 Média
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `app/403/page.tsx`
- [ ] Design de página de acesso negado
- [ ] Link para voltar ao dashboard
- [ ] Mensagem clara explicando falta de permissão

**Page Code:**
```typescript
// app/403/page.tsx

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function AccessDeniedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md px-8">
        <div className="mb-6">
          <ShieldAlert className="h-20 w-20 text-red-500 mx-auto" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Acesso Negado</h1>

        <p className="text-gray-600 mb-8">
          Você não tem permissão para acessar esta página. Se você acredita que deveria ter acesso,
          entre em contato com o administrador da sua organização.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="primary">Voltar ao Dashboard</Button>
          </Link>

          <Link href="/select-organization">
            <Button variant="outline">Trocar Organização</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Página 403 criada
- ✅ Design claro e acessível
- ✅ Links de navegação funcionais

---

### Tarefa 2.7: Criar Sidebar Navigation com Role-Based Menu

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 4 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/shared/components/sidebar-navigation.tsx`
- [ ] Menu items filtrados por role
- [ ] Admin vê: Dashboard, Emociograma, Relatórios, Alertas, Configurações
- [ ] Gestor vê: Dashboard, Emociograma, Relatórios da Equipe, Alertas
- [ ] Colaborador vê: Dashboard, Meu Emociograma
- [ ] Highlight item ativo
- [ ] Responsivo (drawer em mobile)
- [ ] Criar teste

**Component Code:**
```typescript
// src/shared/components/sidebar-navigation.tsx

'use client';

import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role, EmociogramaPermissions } from '@/types/roles.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  BarChart3,
  Bell,
  Settings,
  Users,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: EmociogramaPermissions;
  role?: Role;
  anyRole?: Role[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Meu Emociograma',
    href: '/dashboard/emociograma',
    icon: <Heart className="h-5 w-5" />,
    anyRole: [Role.COLABORADOR, Role.GESTOR, Role.ADMIN],
  },
  {
    label: 'Relatórios da Equipe',
    href: '/dashboard/relatorios/equipe',
    icon: <BarChart3 className="h-5 w-5" />,
    permission: EmociogramaPermissions.VIEW_TEAM_AGGREGATED,
  },
  {
    label: 'Relatórios Gerais',
    href: '/dashboard/relatorios/organizacao',
    icon: <BarChart3 className="h-5 w-5" />,
    permission: EmociogramaPermissions.VIEW_ALL_AGGREGATED,
  },
  {
    label: 'Alertas',
    href: '/dashboard/alertas',
    icon: <Bell className="h-5 w-5" />,
    anyRole: [Role.GESTOR, Role.ADMIN],
  },
  {
    label: 'Gerenciar Usuários',
    href: '/dashboard/usuarios',
    icon: <Users className="h-5 w-5" />,
    role: Role.ADMIN,
  },
  {
    label: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: <Settings className="h-5 w-5" />,
    role: Role.ADMIN,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const { hasPermission, hasRole, hasAnyRole } = usePermissions();

  // Filtrar menu items baseado em permissões
  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.permission && !hasPermission(item.permission)) return false;
    if (item.role && !hasRole(item.role)) return false;
    if (item.anyRole && !hasAnyRole(item.anyRole)) return false;
    return true;
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
```

**Critérios de Aceite:**
- ✅ Menu filtrado por permissões
- ✅ Item ativo destacado
- ✅ Responsivo em mobile
- ✅ Testes com ≥80% cobertura

---

### Tarefa 2.8: Criar Dashboard Layouts por Role

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar `app/dashboard/page.tsx` (default - Colaborador)
- [ ] Criar `app/dashboard/admin/page.tsx`
- [ ] Criar `app/dashboard/gestor/page.tsx`
- [ ] Cada dashboard mostra widgets relevantes ao role
- [ ] Usar `<ProtectedRoute>` para proteger

**Admin Dashboard:**
```typescript
// app/dashboard/admin/page.tsx

import { ProtectedRoute } from '@/shared/components/protected-route';
import { Role } from '@/types/roles.types';
import { Card } from '@/shared/ui/card';
import { Users, Heart, Bell, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Colaboradores</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Submissões Hoje</p>
                <p className="text-2xl font-bold text-gray-900">187</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alertas Ativos</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Índice Motivação</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Reports */}
        {/* Será implementado no Marco 4 */}
      </div>
    </ProtectedRoute>
  );
}
```

**Gestor Dashboard:**
```typescript
// app/dashboard/gestor/page.tsx

import { ProtectedRoute } from '@/shared/components/protected-route';
import { Role } from '@/types/roles.types';

export default function GestorDashboardPage() {
  return (
    <ProtectedRoute requiredRoles={[Role.GESTOR, Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Gestor</h1>

        {/* KPI Cards para equipe */}
        {/* Gráficos de equipe */}
        {/* Lista de alertas da equipe */}
      </div>
    </ProtectedRoute>
  );
}
```

**Colaborador Dashboard:**
```typescript
// app/dashboard/page.tsx (DEFAULT)

'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Card } from '@/shared/ui/card';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Olá, {user?.firstName || 'Colaborador'}!
      </h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <Heart className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Registrar Emoção</h3>
          <p className="text-sm text-gray-600 mb-4">
            Como você está se sentindo hoje?
          </p>
          <Link href="/dashboard/emociograma/novo">
            <Button variant="primary" className="w-full">
              Registrar Agora
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Meu Histórico</h3>
          <p className="text-sm text-gray-600 mb-4">
            Veja sua evolução emocional
          </p>
          <Link href="/dashboard/emociograma">
            <Button variant="outline" className="w-full">
              Ver Histórico
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <Calendar className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendário</h3>
          <p className="text-sm text-gray-600 mb-4">
            7 dias registrados este mês
          </p>
          <Link href="/dashboard/calendario">
            <Button variant="outline" className="w-full">
              Ver Calendário
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ 3 dashboards criados (Admin, Gestor, Colaborador)
- ✅ Cada dashboard protegido por role
- ✅ Design responsivo

---

## Definição de Pronto

Marco 2 está completo quando:

- ✅ **Types:** Roles e permissions definidos
- ✅ **Hooks:** `usePermissions` e `useRoleRedirect` funcionais
- ✅ **Components:** `<Can>` e `<ProtectedRoute>` criados
- ✅ **Navigation:** Sidebar com menu filtrado por role
- ✅ **Dashboards:** Páginas específicas por role
- ✅ **Tests:** Cobertura ≥80% (unit tests)
- ✅ **Integration:** Sistema de roles integrado com organization store

---

## Matriz de Acesso UI

| Tela/Recurso | Colaborador | Gestor | Admin |
|--------------|-------------|--------|-------|
| Dashboard pessoal | ✅ | ✅ | ✅ |
| Registrar emoção | ✅ | ✅ | ✅ |
| Ver próprio histórico | ✅ | ✅ | ✅ |
| Relatórios da equipe | ❌ | ✅ | ✅ |
| Relatórios gerais | ❌ | ❌ | ✅ |
| Alertas da equipe | ❌ | ✅ | ✅ |
| Configurações da org | ❌ | ❌ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |

---

## Recursos

- [Zustand State Management](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Lucide Icons](https://lucide.dev/)
