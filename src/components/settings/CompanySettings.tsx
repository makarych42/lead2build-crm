'use client'

import { useState, useEffect } from 'react'
import { Save, Building } from 'lucide-react'
import { useNotification } from '../NotificationService'

interface CompanySettings {
  name: string
  email: string
  phone: string
  address: string
  logo?: string
}

export default function CompanySettings() {
  const { success } = useNotification()
  
  const [formData, setFormData] = useState<CompanySettings>({
    name: 'Lead2Build',
    email: 'info@lead2build.ru',
    phone: '+7 (800) 555-35-35',
    address: 'г. Москва, ул. Примерная, д. 1'
  })

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('construction_company_settings')
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse company settings', e)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('construction_company_settings', JSON.stringify(formData))
    success('Настройки компании сохранены!')
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Настройки компании</h3>
        <p className="text-sm text-gray-600">Основная информация о вашей организации</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название организации
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Lead2Build"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email компании
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="info@lead2build.ru"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон компании
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="+7 (800) 555-35-35"
            />
          </div>

          {/* Адрес */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Юридический адрес
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="г. Москва, ул. Примерная, д. 1"
            />
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

