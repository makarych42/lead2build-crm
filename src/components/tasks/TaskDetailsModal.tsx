'use client'

import { X, Calendar, User, Flag, Tag, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Task } from './types'
import { TASK_STATUSES, TASK_PRIORITIES, TASK_TYPES } from './constants'

interface TaskDetailsModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onEdit: (task: Task) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
  users: Array<{ id: string; name: string }>
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onStatusChange,
  users
}: TaskDetailsModalProps) {
  if (!isOpen) return null

  const assignedUsers = users.filter(u => task.assignedTo.includes(u.id))
  const createdUser = users.find(u => u.id === task.createdBy)

  const getStatusConfig = (status: Task['status']) => {
    const config = TASK_STATUSES.find(s => s.value === status)
    return config || TASK_STATUSES[0]
  }

  const getPriorityConfig = (priority: Task['priority']) => {
    const config = TASK_PRIORITIES.find(p => p.value === priority)
    return config || TASK_PRIORITIES[1]
  }

  const getTypeConfig = (type: Task['type']) => {
    const config = TASK_TYPES.find(t => t.value === type)
    return config || TASK_TYPES[0]
  }

  const statusConfig = getStatusConfig(task.status)
  const priorityConfig = getPriorityConfig(task.priority)
  const typeConfig = getTypeConfig(task.type)

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${typeConfig.bgColor} ${typeConfig.color}`}>
                  📋
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {task.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                    className={`w-full px-3 py-2 border rounded-md text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} border-${statusConfig.color.split('-')[1]}-200`}
                  >
                    {TASK_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Приоритет
                  </label>
                  <div className={`px-3 py-2 rounded-md text-sm font-medium ${priorityConfig.bgColor} ${priorityConfig.color} flex items-center`}>
                    <Flag className="h-4 w-4 mr-2" />
                    {priorityConfig.label}
                  </div>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Исполнители
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">
                    {assignedUsers.length > 0 
                      ? assignedUsers.map(u => u.name).join(', ') 
                      : 'Не назначены'}
                  </p>
                </div>

                {/* Created By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Создатель
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">
                    {createdUser?.name || 'Неизвестно'}
                  </p>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Тип
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">
                    {typeConfig.label}
                  </p>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Срок выполнения
                  </label>
                  <p className={`text-sm rounded-md p-3 flex items-center ${
                    isOverdue 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-gray-50 text-gray-900'
                  }`}>
                    {task.dueDate ? (
                      <>
                        {isOverdue && <AlertCircle className="h-4 w-4 mr-1" />}
                        {new Date(task.dueDate).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                        {isOverdue && ' (Просрочено)'}
                      </>
                    ) : (
                      'Не установлен'
                    )}
                  </p>
                </div>

                {/* Created At */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Создано
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">
                    {new Date(task.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Completed At */}
                {task.completedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CheckCircle2 className="h-4 w-4 inline mr-1" />
                      Завершено
                    </label>
                    <p className="text-sm text-gray-900 bg-green-50 rounded-md p-3">
                      {new Date(task.completedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Related Links */}
              {(task.leadId || task.votingId) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Связанные объекты
                  </label>
                  <div className="bg-blue-50 rounded-md p-3 text-sm">
                    {task.leadId && (
                      <p className="text-blue-700">
                        <strong>Лид:</strong> {task.leadId}
                      </p>
                    )}
                    {task.votingId && (
                      <p className="text-blue-700">
                        <strong>Голосование:</strong> {task.votingId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Закрыть
              </button>
              <button
                onClick={() => onEdit(task)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

