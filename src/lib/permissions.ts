import { UserRole } from '@/types'

// Типы действий в системе
export type Permission =
  // Управление лидами
  | 'leads:view'
  | 'leads:create'
  | 'leads:edit'
  | 'leads:delete'
  // Управление документами
  | 'documents:view'
  | 'documents:upload'
  | 'documents:edit'
  | 'documents:delete'
  | 'documents:approve'
  // Управление задачами
  | 'tasks:view'
  | 'tasks:create'
  | 'tasks:edit'
  | 'tasks:delete'
  | 'tasks:assign'
  // Управление голосованиями
  | 'voting:view'
  | 'voting:create'
  | 'voting:edit'
  | 'voting:delete'
  | 'voting:manage_apartments'
  | 'voting:collect_votes'
  | 'voting:giszhkh'
  // Технические обследования
  | 'inspection:view'
  | 'inspection:schedule'
  | 'inspection:conduct'
  | 'inspection:approve'
  // Аналитика
  | 'analytics:view'
  | 'analytics:export'
  // Управление пользователями
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'users:block'
  // Настройки системы
  | 'settings:view'
  | 'settings:edit'
  | 'settings:telegram'
  // История и логи
  | 'history:view'
  | 'sessions:view'
  | 'sessions:manage'

// Матрица прав доступа для каждой роли
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Все права
    'leads:view',
    'leads:create',
    'leads:edit',
    'leads:delete',
    'documents:view',
    'documents:upload',
    'documents:edit',
    'documents:delete',
    'documents:approve',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'tasks:delete',
    'tasks:assign',
    'voting:view',
    'voting:create',
    'voting:edit',
    'voting:delete',
    'voting:manage_apartments',
    'voting:collect_votes',
    'voting:giszhkh',
    'inspection:view',
    'inspection:schedule',
    'inspection:conduct',
    'inspection:approve',
    'analytics:view',
    'analytics:export',
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'users:block',
    'settings:view',
    'settings:edit',
    'settings:telegram',
    'history:view',
    'sessions:view',
    'sessions:manage',
  ],

  SALES_MANAGER: [
    // Работа с лидами и задачами
    'leads:view',
    'leads:create',
    'leads:edit',
    'documents:view',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'voting:view',
    'analytics:view',
    'settings:view',
  ],

  DOCUMENT_SPECIALIST: [
    // Работа с документами
    'leads:view',
    'documents:view',
    'documents:upload',
    'documents:edit',
    'documents:approve',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'analytics:view',
    'settings:view',
  ],

  TECHNICAL_INSPECTOR: [
    // Технические обследования
    'leads:view',
    'documents:view',
    'documents:upload',
    'inspection:view',
    'inspection:schedule',
    'inspection:conduct',
    'inspection:approve',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'analytics:view',
    'settings:view',
  ],

  VOTING_COORDINATOR: [
    // Создание и управление голосованиями
    'leads:view',
    'documents:view',
    'voting:view',
    'voting:create',
    'voting:edit',
    'voting:manage_apartments',
    'voting:giszhkh',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'analytics:view',
    'settings:view',
  ],

  VOTING_MANAGER: [
    // Сбор голосов и работа с собственниками
    'leads:view',
    'documents:view',
    'voting:view',
    'voting:edit',
    'voting:manage_apartments',
    'voting:collect_votes',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'analytics:view',
    'settings:view',
  ],
}

/**
 * Проверяет, есть ли у роли определенное разрешение
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions.includes(permission)
}

/**
 * Проверяет, есть ли у роли хотя бы одно из указанных разрешений
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

/**
 * Проверяет, есть ли у роли все указанные разрешения
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

/**
 * Возвращает все разрешения для указанной роли
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role]
}

/**
 * Проверяет, является ли пользователь администратором
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN'
}

/**
 * Проверяет, может ли пользователь управлять другими пользователями
 */
export function canManageUsers(role: UserRole): boolean {
  return hasPermission(role, 'users:edit')
}

/**
 * Проверяет, может ли пользователь редактировать настройки
 */
export function canEditSettings(role: UserRole): boolean {
  return hasPermission(role, 'settings:edit')
}

/**
 * Описание прав для каждой роли (для UI)
 */
export const ROLE_PERMISSIONS_DESCRIPTION: Record<UserRole, string[]> = {
  ADMIN: [
    'Полный доступ ко всем разделам системы',
    'Управление пользователями и настройками',
    'Просмотр истории входов и управление сессиями',
    'Экспорт данных и аналитика',
  ],
  SALES_MANAGER: [
    'Создание и управление лидами',
    'Первичная консультация с клиентами',
    'Создание задач',
    'Просмотр документов и голосований',
  ],
  DOCUMENT_SPECIALIST: [
    'Загрузка и управление документами',
    'Подготовка предложений и схем КТ',
    'Проверка и одобрение документов',
    'Создание задач по документообороту',
  ],
  TECHNICAL_INSPECTOR: [
    'Проведение технических обследований',
    'Составление отчетов',
    'Загрузка технических документов',
    'Согласование технических решений',
  ],
  VOTING_COORDINATOR: [
    'Создание и организация голосований',
    'Регистрация в ГИС ЖКХ',
    'Управление квартирами и собственниками',
    'Подготовка документов для голосования',
  ],
  VOTING_MANAGER: [
    'Контакт с собственниками',
    'Сбор голосов',
    'Обработка возражений',
    'Подготовка протоколов голосования',
  ],
}

/**
 * Типизированная функция для проверки прав в компонентах
 */
export function usePermission(userRole: UserRole | undefined) {
  return {
    can: (permission: Permission) =>
      userRole ? hasPermission(userRole, permission) : false,
    canAny: (permissions: Permission[]) =>
      userRole ? hasAnyPermission(userRole, permissions) : false,
    canAll: (permissions: Permission[]) =>
      userRole ? hasAllPermissions(userRole, permissions) : false,
    isAdmin: () => userRole === 'ADMIN',
  }
}

