export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  GESTOR = 'gestor',
  COLABORADOR = 'colaborador',
}

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
