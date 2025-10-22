'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { useNotification } from '../NotificationService'

interface SystemSettings {
  autoCreateTasks: boolean
  dateFormat: 'DD.MM.YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timezone: string
  language: 'ru' | 'en'
}

export default function SystemSettings() {
  const { success } = useNotification()
  
  const [formData, setFormData] = useState<SystemSettings>({
    autoCreateTasks: true,
    dateFormat: 'DD.MM.YYYY',
    timezone: 'Europe/Moscow',
    language: 'ru'
  })

  useEffect(() => {
    const saved = localStorage.getItem('construction_system_settings')
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse system settings', e)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('construction_system_settings', JSON.stringify(formData))
    success('Системные настройки сохранены!')
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Системные настройки</h3>
        <p className="text-sm text-gray-600">Параметры работы системы</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Автосоздание задач */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.autoCreateTasks}
                onChange={(e) => setFormData({ ...formData, autoCreateTasks: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Автоматическое создание задач
              </label>
              <p className="text-sm text-gray-500">
                Автоматически создавать задачи при создании лидов и голосований
              </p>
            </div>
          </div>

          {/* Формат даты */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Формат даты
            </label>
            <select
              value={formData.dateFormat}
              onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="DD.MM.YYYY">ДД.ММ.ГГГГ (21.10.2025)</option>
              <option value="MM/DD/YYYY">ММ/ДД/ГГГГ (10/21/2025)</option>
              <option value="YYYY-MM-DD">ГГГГ-ММ-ДД (2025-10-21)</option>
            </select>
          </div>

          {/* Часовой пояс */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Часовой пояс
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="Europe/Moscow">Москва (UTC+3)</option>
              <option value="Europe/Samara">Самара (UTC+4)</option>
              <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
              <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
              <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
            </select>
          </div>

          {/* Язык */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Язык интерфейса
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as 'ru' | 'en' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Кнопка сохранения */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

