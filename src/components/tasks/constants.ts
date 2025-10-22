// Константы для модуля задач

import { TaskType, UserRole } from './types'

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  // По лидам
  CONTACT_CLIENT: 'Связаться с клиентом',
  CONDUCT_CONSULTATION: 'Провести консультацию',
  CLARIFY_DETAILS: 'Уточнить детали проекта',
  MOVE_TO_NEXT_STAGE: 'Перевести на следующий этап',
  
  // По документам
  PREPARE_PROPOSAL: 'Подготовить комплексное предложение',
  REQUEST_REGISTRY: 'Запросить реестр собственников',
  PREPARE_KT_SCHEME: 'Подготовить KT-схему',
  UPLOAD_DOCUMENTS: 'Загрузить документы',
  REVIEW_DOCUMENTS: 'Проверить документы',
  APPROVE_DOCUMENTS: 'Одобрить документы',
  
  // По обследованию
  SCHEDULE_INSPECTION: 'Назначить обследование',
  CONDUCT_INSPECTION: 'Провести обследование',
  PREPARE_REPORT: 'Подготовить отчет',
  APPROVE_TECHNICAL: 'Согласовать техническую возможность',
  
  // По голосованию
  REQUEST_OWNER_REGISTRY: 'Запросить реестр собственников',
  REGISTER_GISZHKH: 'Зарегистрировать в ГИС ЖКХ',
  CREATE_VOTING: 'Создать голосование',
  PREPARE_BALLOTS: 'Подготовить бланки',
  SCHEDULE_VOTING: 'Назначить дату голосования',
  ADD_APARTMENTS: 'Добавить данные квартир',
  CONTACT_OWNERS: 'Связаться с собственниками',
  COLLECT_VOTES: 'Собрать голоса',
  HANDLE_OBJECTIONS: 'Обработать возражения',
  PREPARE_PROTOCOL: 'Подготовить протокол',
  
  // Общие
  DEADLINE_REMINDER: 'Напоминание о дедлайне',
  OVERDUE_TASK: 'Просроченная задача',
  CUSTOM: 'Произвольная задача'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SALES_MANAGER: 'Менеджер по продажам',
  DOCUMENT_SPECIALIST: 'Специалист по документообороту',
  TECHNICAL_INSPECTOR: 'Инженер-инспектор',
  VOTING_COORDINATOR: 'Организатор голосований',
  VOTING_MANAGER: 'Координатор голосования',
  ADMIN: 'Администратор'
}

export const STATUS_LABELS = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершена',
  CANCELLED: 'Отменена',
  OVERDUE: 'Просрочена'
}

export const PRIORITY_LABELS = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  URGENT: 'Срочно'
}

// Конфигурация для UI компонентов
export const TASK_STATUSES = [
  { value: 'PENDING' as const, label: 'Ожидает', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  { value: 'IN_PROGRESS' as const, label: 'В работе', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { value: 'COMPLETED' as const, label: 'Завершена', color: 'text-green-700', bgColor: 'bg-green-100' },
  { value: 'CANCELLED' as const, label: 'Отменена', color: 'text-red-700', bgColor: 'bg-red-100' }
]

export const TASK_PRIORITIES = [
  { 
    value: 'LOW' as const, 
    label: 'Низкий', 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100',
    icon: () => null
  },
  { 
    value: 'MEDIUM' as const, 
    label: 'Средний', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-100',
    icon: () => null
  },
  { 
    value: 'HIGH' as const, 
    label: 'Высокий', 
    color: 'text-orange-700', 
    bgColor: 'bg-orange-100',
    icon: () => null
  },
  { 
    value: 'URGENT' as const, 
    label: 'Срочно', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100',
    icon: () => null
  }
]

export const TASK_TYPES = [
  { value: 'CONTACT_CLIENT' as const, label: 'Связаться с клиентом', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: () => null },
  { value: 'CONDUCT_CONSULTATION' as const, label: 'Провести консультацию', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: () => null },
  { value: 'PREPARE_PROPOSAL' as const, label: 'Подготовить предложение', color: 'text-green-700', bgColor: 'bg-green-100', icon: () => null },
  { value: 'UPLOAD_DOCUMENTS' as const, label: 'Загрузить документы', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: () => null },
  { value: 'CREATE_VOTING' as const, label: 'Создать голосование', color: 'text-pink-700', bgColor: 'bg-pink-100', icon: () => null },
  { value: 'CUSTOM' as const, label: 'Произвольная', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: () => null }
]

