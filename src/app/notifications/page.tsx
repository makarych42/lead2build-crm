'use client'

import { useState } from 'react'
import { Bell, Calendar, Settings, BarChart3 } from 'lucide-react'
import NotificationCenter from '../../components/NotificationCenter'
import ReminderSettings from '../../components/ReminderSettings'
import EventCalendar from '../../components/EventCalendar'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'calendar' | 'settings' | 'analytics'>('notifications')

  const tabs = [
    {
      id: 'notifications' as const,
      label: 'Уведомления',
      icon: Bell,
      description: 'Центр уведомлений и сообщений'
    },
    {
      id: 'calendar' as const,
      label: 'Календарь',
      icon: Calendar,
      description: 'События и дедлайны'
    },
    {
      id: 'settings' as const,
      label: 'Настройки',
      icon: Settings,
      description: 'Настройка напоминаний'
    },
    {
      id: 'analytics' as const,
      label: 'Аналитика',
      icon: BarChart3,
      description: 'Статистика уведомлений'
    }
  ]

  // Компонент аналитики уведомлений
  const NotificationAnalytics = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Аналитика уведомлений</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-md p-3">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего отправлено</p>
              <p className="text-2xl font-semibold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-md p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Сегодня</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-md p-3">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Активных правил</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-md p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Открытых</p>
              <p className="text-2xl font-semibold text-gray-900">87%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* График отправленных уведомлений */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Уведомления по дням</h3>
          <div className="space-y-3">
            {[
              { day: 'Понедельник', count: 45, color: 'bg-blue-500' },
              { day: 'Вторник', count: 32, color: 'bg-green-500' },
              { day: 'Среда', count: 28, color: 'bg-yellow-500' },
              { day: 'Четверг', count: 51, color: 'bg-purple-500' },
              { day: 'Пятница', count: 39, color: 'bg-red-500' },
              { day: 'Суббота', count: 18, color: 'bg-indigo-500' },
              { day: 'Воскресенье', count: 12, color: 'bg-pink-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">{item.day}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${(item.count / 51) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Типы уведомлений */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Типы уведомлений</h3>
          <div className="space-y-4">
            {[
              { type: 'Напоминания о дедлайнах', count: 156, percentage: 35, color: 'text-red-600' },
              { type: 'Уведомления о событиях', count: 134, percentage: 30, color: 'text-blue-600' },
              { type: 'Системные сообщения', count: 89, percentage: 20, color: 'text-green-600' },
              { type: 'Срочные уведомления', count: 67, percentage: 15, color: 'text-orange-600' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.type}</p>
                  <p className="text-xs text-gray-500">{item.count} уведомлений</p>
                </div>
                <div className={`text-lg font-semibold ${item.color}`}>
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Система уведомлений и напоминаний
        </h1>
        <p className="text-gray-600">
          Управление уведомлениями, настройка напоминаний и отслеживание событий в процессе подготовки к строительству
        </p>
      </div>

      {/* Навигационные вкладки */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        
        {/* Описание активной вкладки */}
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Контент вкладок */}
      <div>
        {activeTab === 'notifications' && <NotificationCenter />}
        {activeTab === 'calendar' && <EventCalendar />}
        {activeTab === 'settings' && <ReminderSettings />}
        {activeTab === 'analytics' && <NotificationAnalytics />}
      </div>
    </div>
  )
}