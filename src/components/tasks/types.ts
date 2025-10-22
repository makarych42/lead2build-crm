// Типы для модуля управления задачами

import { Task, User, Lead, Voting, TaskType, TaskStatus, TaskPriority, UserRole } from '@/types'

// Экспортируем типы из общего файла
export type { Task, User, Lead, Voting, TaskType, TaskStatus, TaskPriority, UserRole }

// Специфичные для модуля задач типы
export interface TaskFilters {
  search: string
  status: TaskStatus | 'ALL'
  priority: TaskPriority | 'ALL'
  assignedTo: string | 'ALL'
  type: TaskType | 'ALL'
}

export interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}

export interface TaskFormData {
  title: string
  description: string
  type: TaskType
  assignedTo: string[]
  priority: TaskPriority
  dueDate: string
  leadId?: string
  votingId?: string
  documentId?: string
  notes?: string
}

export type TaskGroupBy = 'status' | 'priority' | 'assignee' | 'type' | 'none'

