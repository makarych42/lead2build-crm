'use client'

import { Task, User } from './types'
import { getStatusColor, getPriorityColor, formatDate, getRelativeTime, getPriorityIcon } from './utils'
import { TASK_TYPE_LABELS, STATUS_LABELS, PRIORITY_LABELS } from './constants'
import { Calendar, MapPin, User as UserIcon, CheckCircle, X, Play } from 'lucide-react'

interface TaskCardProps {
  task: Task
  users: User[]
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onClick?: (task: Task) => void
}

export function TaskCard({ task, users, onStatusChange, onClick }: TaskCardProps) {
  const assignedUsers = users.filter(u => task.assignedTo.includes(u.id))
  const createdByUser = users.find(u => u.id === task.createdBy)

  const handleStatusChange = (e: React.MouseEvent, newStatus: Task['status']) => {
    e.stopPropagation()
    onStatusChange?.(task.id, newStatus)
  }

  return (
    <div
      onClick={() => onClick?.(task)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getPriorityIcon(task.priority)}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
      </div>

      {/* Task Type and Status */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {TASK_TYPE_LABELS[task.type]}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {/* Context Info */}
      {task.context?.address && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{task.context.address}</span>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className={task.status === 'OVERDUE' ? 'text-red-600 font-medium' : 'text-gray-600'}>
          {getRelativeTime(task.dueDate)}
        </span>
        <span className="text-gray-400 text-xs">
          ({formatDate(task.dueDate)})
        </span>
      </div>

      {/* Assigned Users */}
      {assignedUsers.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <div className="flex -space-x-2">
            {assignedUsers.slice(0, 3).map(user => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {assignedUsers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
                +{assignedUsers.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {task.status === 'PENDING' && (
          <button
            onClick={(e) => handleStatusChange(e, 'IN_PROGRESS')}
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
          >
            <Play className="h-3 w-3 mr-1" />
            Начать
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button
            onClick={(e) => handleStatusChange(e, 'COMPLETED')}
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Завершить
          </button>
        )}
        {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
          <button
            onClick={(e) => handleStatusChange(e, 'CANCELLED')}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            <X className="h-3 w-3 mr-1" />
            Отменить
          </button>
        )}
      </div>

      {/* Priority Badge */}
      <div className="absolute top-2 right-2">
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={PRIORITY_LABELS[task.priority]}></div>
      </div>
    </div>
  )
}

