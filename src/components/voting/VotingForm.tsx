'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Lead, VotingFormData } from './types'
import { validateVotingData, formatDateForInput } from './utils'
import { useNotification } from '@/components/NotificationService'

interface VotingFormProps {
  lead: Lead
  onSubmit: (formData: VotingFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function VotingForm({ lead, onSubmit, onCancel, isSubmitting = false }: VotingFormProps) {
  const { showNotification } = useNotification()
  
  const [formData, setFormData] = useState<VotingFormData>(() => {
    // Устанавливаем даты по умолчанию
    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 45) // 45 дней для заочного голосования

    return {
      votingForm: 'MEETING',
      votingStartDate: formatDateForInput(today.toISOString()),
      votingEndDate: formatDateForInput(endDate.toISOString()),
      requiredVotes: 100
    }
  })

  // Обновить конечную дату при изменении типа голосования
  useEffect(() => {
    if (formData.votingStartDate) {
      const start = new Date(formData.votingStartDate)
      const end = new Date(start)
      
      // Рекомендуемые сроки
      if (formData.votingForm === 'MEETING') {
        end.setDate(end.getDate() + 14) // 2 недели для собрания
      } else if (formData.votingForm === 'ABSENTEE') {
        end.setDate(end.getDate() + 45) // 45 дней для заочного
      } else {
        end.setDate(end.getDate() + 30) // 30 дней для смешанного
      }
      
      setFormData(prev => ({
        ...prev,
        votingEndDate: formatDateForInput(end.toISOString())
      }))
    }
  }, [formData.votingForm, formData.votingStartDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    const validation = validateVotingData({
      votingStartDate: formData.votingStartDate,
      votingEndDate: formData.votingEndDate,
      requiredVotes: formData.requiredVotes
    })

    if (!validation.valid) {
      validation.errors.forEach(error => showNotification(error, 'error'))
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Настройка голосования для {lead.address}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Lead Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Информация о лиде
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Адрес:</strong> {lead.address}, {lead.city}
                </p>
                <p>
                  <strong>Контакт:</strong> {lead.contactPerson}
                </p>
                <p>
                  <strong>Телефон:</strong> {lead.contactPhone}
                </p>
                {lead.apartmentsCount && (
                  <p>
                    <strong>Квартир:</strong> {lead.apartmentsCount}
                  </p>
                )}
              </div>
            </div>

            {/* Voting Form Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Форма голосования <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.votingForm}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    votingForm: e.target.value as 'MEETING' | 'ABSENTEE' | 'MIXED'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                required
                disabled={isSubmitting}
              >
                <option value="MEETING">Очное собрание</option>
                <option value="ABSENTEE">Заочное голосование</option>
                <option value="MIXED">Смешанная форма</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.votingForm === 'MEETING' &&
                  'Рекомендуемый срок: 14 дней'}
                {formData.votingForm === 'ABSENTEE' &&
                  'Рекомендуемый срок: 45 дней'}
                {formData.votingForm === 'MIXED' &&
                  'Рекомендуемый срок: 30 дней'}
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала голосования <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.votingStartDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, votingStartDate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания голосования <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.votingEndDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, votingEndDate: e.target.value }))
                }
                min={formData.votingStartDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Required Votes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Требуемое количество голосов <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.requiredVotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requiredVotes: parseInt(e.target.value) || 100
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                required
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Минимум 67% от этого числа необходимо для успешного голосования
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Создание...
                </span>
              ) : (
                'Создать голосование'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

