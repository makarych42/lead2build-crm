'use client'

import { useMemo } from 'react'
import { ClipboardList, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Task, TaskStats as TaskStatsType } from './types'
import { ProgressBar } from '@/components/LoadingStates'

interface TaskStatsProps {
  tasks: Task[]
  currentUserId?: string
}

export function TaskStats({ tasks, currentUserId }: TaskStatsProps) {
  const stats = useMemo((): TaskStatsType => {
    const total = tasks.length
    const pending = tasks.filter(t => t.status === 'PENDING').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
    const completed = tasks.filter(t => t.status === 'COMPLETED').length
    const overdue = tasks.filter(t => t.status === 'OVERDUE').length

    const byPriority = {
      low: tasks.filter(t => t.priority === 'LOW').length,
      medium: tasks.filter(t => t.priority === 'MEDIUM').length,
      high: tasks.filter(t => t.priority === 'HIGH').length,
      urgent: tasks.filter(t => t.priority === 'URGENT').length
    }

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      byPriority
    }
  }, [tasks])

  const myTasks = useMemo(() => {
    if (!currentUserId) return tasks.length
    return tasks.filter(t => t.assignedTo.includes(currentUserId)).length
  }, [tasks, currentUserId])

  const completionRate = stats.total > 0 
    ? ((stats.completed / stats.total) * 100).toFixed(1)
    : '0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Всего задач */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Всего задач</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <ClipboardList className="h-12 w-12 text-blue-500" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Мои задачи:</span>
            <span className="font-medium">{myTasks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">В работе:</span>
            <span className="font-medium">{stats.inProgress}</span>
          </div>
        </div>
      </div>

      {/* Ожидают */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Ожидают</p>
            <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
          </div>
          <Clock className="h-12 w-12 text-blue-500" />
        </div>
        <div className="text-sm text-gray-600">
          <p>Требуют назначения</p>
        </div>
      </div>

      {/* Завершенные */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Завершенные</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <ProgressBar
          progress={parseFloat(completionRate)}
          label="Процент выполнения"
          color="green"
        />
      </div>

      {/* Просроченные */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Просроченные</p>
            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
          </div>
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-red-600">🔥 Срочные:</span>
            <span className="font-medium">{stats.byPriority.urgent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-600">▲ Высокие:</span>
            <span className="font-medium">{stats.byPriority.high}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

