'use client';

import { usePermissions } from '@/shared/hooks/use-permissions';
import { Role, EmociogramaPermissions } from '@/types/roles.types';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  BarChart3,
  Bell,
  Settings,
  Users,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

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
    label: 'Emoflow',
    href: '/emoflow',
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

  // Filter menu items based on permissions
  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.permission && !hasPermission(item.permission)) return false;
    if (item.role && !hasRole(item.role)) return false;
    if (item.anyRole && !hasAnyRole(item.anyRole)) return false;
    return true;
  });

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 glass rounded-3xl flex flex-col z-50 transition-all duration-300">
        <div className="relative w-40 h-18 ml-4">
          <Image  
            src="/logo-psicozen.png" 
            alt="PsicoZen Logo" 
            fill
            className="object-contain object-left"
            priority
          />
        </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "text-gray-600 hover:bg-white/50 hover:text-primary hover:translate-x-1"
                  )}
                >
                  <span className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass bg-white/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Usuário Teste</p>
              <p className="text-xs text-muted-foreground truncate">user@psicozen.com</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-xs">
            <LogOut className="w-3 h-3 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
