'use client'

import { useState, useCallback } from 'react'
import { X, Save, MapPin, User, Phone, Mail } from 'lucide-react'
import { useLeadsStore } from '@/stores'
import { autoCreateTasksForNewLead } from '@/utils/taskAutoCreation'
import { useNotification } from './NotificationService'
import { ButtonLoader } from './LoadingStates'

interface NewLeadFormProps {
  onClose: () => void
  onLeadCreated?: () => void
}

export default function NewLeadForm({ onClose, onLeadCreated }: NewLeadFormProps) {
  const addLead = useLeadsStore((state) => state.addLead)
  const { success, error } = useNotification()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    source: 'ОЗ'
  })

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Создаём новый лид
      const newLead = {
        id: Date.now().toString(),
        ...formData,
        status: 'NEW' as const,
        currentStage: 'INITIAL_CONSULTATION' as const,
        createdAt: new Date().toISOString(),
        buildingType: undefined,
        floorsCount: undefined,
        apartmentsCount: undefined
      }
      
      // Добавляем в Zustand store
      addLead(newLead)
      
      // Автоматически создаем задачи для нового лида и отправляем Telegram уведомления
      autoCreateTasksForNewLead(newLead.id, formData.address, formData.contactPerson, formData.contactPhone)
      
      success('Лид успешно создан! Автоматически созданы задачи и отправлены Telegram уведомления.')
      
      // Вызываем callback для обновления данных в родительском компоненте
      if (onLeadCreated) {
        onLeadCreated()
      } else {
        onClose()
      }
    } catch (err) {
      console.error('Error creating lead:', err)
      error('Ошибка при создании лида')
    } finally {
      setIsSubmitting(false)
    }
  }, [addLead, success, error, onLeadCreated, onClose, formData, isSubmitting])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Новый лид</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                Адрес дома *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="ул. Ленина, д. 15"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                Город *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Москва"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Контактное лицо *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Телефон *
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Источник лида *
              </label>
              <select
                required
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="ОЗ">ОЗ</option>
                <option value="Сарафанная радио">Сарафанная радио</option>
                <option value="Фронты">Фронты</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end p-6 border-t bg-gray-50 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <ButtonLoader />
                  <span className="ml-2">Создание...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Создать лид
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
