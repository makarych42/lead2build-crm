'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, User, Flag, Tag, FileText } from 'lucide-react'
import { Task, User as UserType, Lead, Voting } from './types'
import { TASK_STATUSES, TASK_PRIORITIES, TASK_TYPES } from './constants'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void
  initialData?: Task | null
  users: UserType[]
  leads: Lead[]
  votings: Voting[]
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  users,
  leads,
  votings
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CONTACT_CLIENT' as Task['type'],
    priority: 'MEDIUM' as Task['priority'],
    assignedTo: [] as string[],
    createdBy: users[0]?.id || '',
    dueDate: '',
    leadId: '',
    votingId: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Заполнение формы при редактировании
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        type: initialData.type,
        priority: initialData.priority,
        assignedTo: initialData.assignedTo || [],
        createdBy: initialData.createdBy,
        dueDate: initialData.dueDate || '',
        leadId: initialData.leadId || '',
        votingId: initialData.votingId || ''
      })
    } else {
      // Сброс формы для создания новой задачи
      setFormData({
        title: '',
        description: '',
        type: 'CONTACT_CLIENT',
        priority: 'MEDIUM',
        assignedTo: [],
        createdBy: users[0]?.id || '',
        dueDate: '',
        leadId: '',
        votingId: ''
      })
    }
    setErrors({})
  }, [initialData, isOpen, users])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно'
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Название слишком длинное (макс. 200 символов)'
    }
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Выберите исполнителя'
    }
    if (!formData.createdBy) {
      newErrors.createdBy = 'Создатель обязателен'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      ...formData,
      description: formData.description || '',
      dueDate: formData.dueDate || undefined,
      leadId: formData.leadId || undefined,
      votingId: formData.votingId || undefined,
      completedAt: undefined
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (!isOpen) return null

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
              <h3 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Редактировать задачу' : 'Создать задачу'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название задачи *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Например: Согласовать договор с клиентом"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Подробное описание задачи..."
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Тип задачи
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TASK_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Flag className="h-4 w-4 inline mr-1" />
                    Приоритет
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TASK_PRIORITIES.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned To & Created By */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    Исполнитель *
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => handleChange('assignedTo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Выберите исполнителя</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Срок выполнения
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Related Objects */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Связанный лид
                  </label>
                  <select
                    value={formData.leadId}
                    onChange={(e) => handleChange('leadId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не выбрано</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>
                        {lead.address}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Связанное голосование
                  </label>
                  <select
                    value={formData.votingId}
                    onChange={(e) => handleChange('votingId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не выбрано</option>
                    {votings.map(voting => (
                      <option key={voting.id} value={voting.id}>
                        {voting.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-700">
                  <strong>Совет:</strong> Свяжите задачу с лидом или голосованием для лучшей организации работы
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {initialData ? 'Сохранить' : 'Создать задачу'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

