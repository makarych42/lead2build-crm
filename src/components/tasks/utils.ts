// Утилиты для модуля задач

import { Task, TaskStatus, TaskPriority } from './types'

/**
 * Получить цвет для статуса задачи
 */
export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    OVERDUE: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
  }
  return colors[status] || colors.PENDING
}

/**
 * Получить цвет для приоритета задачи
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    LOW: 'bg-gray-400',
    MEDIUM: 'bg-yellow-400',
    HIGH: 'bg-orange-400',
    URGENT: 'bg-red-500 animate-pulse'
  }
  return colors[priority] || colors.MEDIUM
}

/**
 * Проверить просрочена ли задача
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'COMPLETED' || task.status === 'CANCELLED') {
    return false
  }
  return new Date(task.dueDate) < new Date()
}

/**
 * Обновить статус просроченных задач
 */
export function updateOverdueTasks(tasks: Task[]): Task[] {
  return tasks.map(task => {
    if (isTaskOverdue(task) && task.status !== 'OVERDUE') {
      return { ...task, status: 'OVERDUE' as TaskStatus }
    }
    return task
  })
}

/**
 * Форматировать дату для отображения
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

/**
 * Форматировать дату и время
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

/**
 * Получить относительное время
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return `Просрочено на ${Math.abs(days)} дн.`
  } else if (days === 0) {
    return 'Сегодня'
  } else if (days === 1) {
    return 'Завтра'
  } else if (days <= 7) {
    return `Через ${days} дн.`
  } else {
    return formatDate(dateString)
  }
}

/**
 * Получить иконку приоритета
 */
export function getPriorityIcon(priority: TaskPriority): string {
  const icons: Record<TaskPriority, string> = {
    LOW: '▼',
    MEDIUM: '◆',
    HIGH: '▲',
    URGENT: '🔥'
  }
  return icons[priority] || icons.MEDIUM
}

/**
 * Сортировка задач
 */
export function sortTasks(
  tasks: Task[],
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'status',
  order: 'asc' | 'desc' = 'asc'
): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let compareValue = 0

    switch (sortBy) {
      case 'dueDate':
        compareValue = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case 'createdAt':
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'priority':
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        compareValue = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      case 'status':
        const statusOrder = { OVERDUE: 5, IN_PROGRESS: 4, PENDING: 3, COMPLETED: 2, CANCELLED: 1 }
        compareValue = statusOrder[a.status] - statusOrder[b.status]
        break
    }

    return order === 'asc' ? compareValue : -compareValue
  })

  return sorted
}

/**
 * Фильтрация задач
 */
export function filterTasks(
  tasks: Task[],
  filters: {
    search?: string
    status?: TaskStatus | 'ALL'
    priority?: TaskPriority | 'ALL'
    assignedTo?: string | 'ALL'
    type?: string | 'ALL'
  }
): Task[] {
  let filtered = [...tasks]

  // Поиск
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.context.address?.toLowerCase().includes(searchLower) ||
        task.context.clientName?.toLowerCase().includes(searchLower)
    )
  }

  // Статус
  if (filters.status && filters.status !== 'ALL') {
    filtered = filtered.filter(task => task.status === filters.status)
  }

  // Приоритет
  if (filters.priority && filters.priority !== 'ALL') {
    filtered = filtered.filter(task => task.priority === filters.priority)
  }

  // Исполнитель
  if (filters.assignedTo && filters.assignedTo !== 'ALL') {
    filtered = filtered.filter(task => task.assignedTo.includes(filters.assignedTo as string))
  }

  // Тип
  if (filters.type && filters.type !== 'ALL') {
    filtered = filtered.filter(task => task.type === filters.type)
  }

  return filtered
}

/**
 * Группировка задач
 */
export function groupTasks(
  tasks: Task[],
  groupBy: 'status' | 'priority' | 'assignee' | 'type' | 'none'
): Record<string, Task[]> {
  if (groupBy === 'none') {
    return { all: tasks }
  }

  const groups: Record<string, Task[]> = {}

  tasks.forEach(task => {
    let key: string

    switch (groupBy) {
      case 'status':
        key = task.status
        break
      case 'priority':
        key = task.priority
        break
      case 'type':
        key = task.type
        break
      case 'assignee':
        // Группируем по первому исполнителю
        key = task.assignedTo[0] || 'Не назначено'
        break
      default:
        key = 'all'
    }

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(task)
  })

  return groups
}

/**
 * Валидация данных задачи
 */
export function validateTaskData(data: Partial<Task>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Название задачи обязательно')
  }

  if (!data.description?.trim()) {
    errors.push('Описание задачи обязательно')
  }

  if (!data.assignedTo || data.assignedTo.length === 0) {
    errors.push('Необходимо назначить хотя бы одного исполнителя')
  }

  if (!data.dueDate) {
    errors.push('Необходимо указать срок выполнения')
  } else {
    const dueDate = new Date(data.dueDate)
    const now = new Date()
    if (dueDate < now) {
      errors.push('Срок выполнения не может быть в прошлом')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

