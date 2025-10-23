'use client'

import { useEffect, useState } from 'react'
import { useLeadsStore } from '@/stores/useLeadsStore'
import { useVotingsStore } from '@/stores/useVotingsStore'
import { useTasksStore } from '@/stores/useTasksStore'
import { Home as HomeIcon, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

export default function MobileDashboard() {
  const leads = useLeadsStore((state) => state.leads)
  const votings = useVotingsStore((state) => state.votings)
  const tasks = useTasksStore((state) => state.tasks)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Всего лидов',
      value: leads.length,
      icon: HomeIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'В работе',
      value: leads.filter((l) => l.status === 'IN_PROGRESS').length,
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Голосований',
      value: votings.length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Мои задачи',
      value: tasks.filter((t) => t.status !== 'COMPLETED').length,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать!</h2>
        <p className="text-blue-100">
          {new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      {/* Быстрый доступ */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Быстрый доступ</h3>
        <div className="space-y-2">
          <a
            href="/mobile/leads"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Все лиды
            </span>
            <span className="text-xs text-gray-500">→</span>
          </a>
          <a
            href="/mobile/tasks"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Мои задачи
            </span>
            <span className="text-xs text-gray-500">→</span>
          </a>
          <a
            href="/mobile/voting"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Голосования
            </span>
            <span className="text-xs text-gray-500">→</span>
          </a>
        </div>
      </div>

      {/* Информация */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Совет:</strong> Это мобильная версия для просмотра. Для
          полного функционала используйте десктоп версию.
        </p>
      </div>
    </div>
  )
}

