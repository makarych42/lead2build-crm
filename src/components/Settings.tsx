'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Users, Building, Cog, Bell, Download, AlertTriangle } from 'lucide-react'
import UserManagement from './settings/UserManagement'
import CompanySettings from './settings/CompanySettings'
import SystemSettings from './settings/SystemSettings'
import NotificationSettings from './settings/NotificationSettings'
import DataExport from './settings/DataExport'
import ErrorLogs from './settings/ErrorLogs'

type SettingsTab = 'users' | 'company' | 'system' | 'notifications' | 'export' | 'errors'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users')

  const tabs = [
    { id: 'users', label: 'Пользователи и роли', icon: Users },
    { id: 'company', label: 'Компания', icon: Building },
    { id: 'system', label: 'Система', icon: Cog },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'export', label: 'Экспорт данных', icon: Download },
    { id: 'errors', label: 'Логи ошибок', icon: AlertTriangle },
  ]

  return (
    <div>
      {/* Заголовок */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Настройки системы</h2>
        <p className="text-gray-600">Управление пользователями, компанией и параметрами системы</p>
      </div>

      {/* Вкладки */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Контент вкладок */}
      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'company' && <CompanySettings />}
        {activeTab === 'system' && <SystemSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'export' && <DataExport />}
        {activeTab === 'errors' && <ErrorLogs />}
      </div>
    </div>
  )
}

