'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { useNotification } from '../NotificationService'

interface NotificationSettings {
  email: boolean
  telegram: boolean
  sound: boolean
  desktop: boolean
}

export default function NotificationSettings() {
  const { success } = useNotification()
  
  const [formData, setFormData] = useState<NotificationSettings>({
    email: true,
    telegram: true,
    sound: false,
    desktop: true
  })

  useEffect(() => {
    const saved = localStorage.getItem('construction_notification_settings')
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse notification settings', e)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('construction_notification_settings', JSON.stringify(formData))
    success('Настройки уведомлений сохранены!')
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Настройки уведомлений</h3>
        <p className="text-sm text-gray-600">Управление каналами получения уведомлений</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email уведомления */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Email уведомления
              </label>
              <p className="text-sm text-gray-500">
                Получать уведомления на электронную почту
              </p>
            </div>
          </div>

          {/* Telegram уведомления */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Telegram уведомления
              </label>
              <p className="text-sm text-gray-500">
                Получать уведомления в Telegram
              </p>
            </div>
          </div>

          {/* Звуковые уведомления */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.sound}
                onChange={(e) => setFormData({ ...formData, sound: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Звуковые уведомления
              </label>
              <p className="text-sm text-gray-500">
                Воспроизводить звук при новых уведомлениях
              </p>
            </div>
          </div>

          {/* Desktop уведомления */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.desktop}
                onChange={(e) => setFormData({ ...formData, desktop: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Системные уведомления
              </label>
              <p className="text-sm text-gray-500">
                Показывать системные уведомления браузера
              </p>
            </div>
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

