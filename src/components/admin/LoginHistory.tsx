'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, XCircle, Shield, TrendingUp, TrendingDown } from 'lucide-react'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

interface LoginHistoryItem {
  id: string
  userId: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  reason?: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface LoginStats {
  total: number
  successful: number
  failed: number
}

export default function LoginHistory() {
  const { data: session } = useSession()
  const [history, setHistory] = useState<LoginHistoryItem[]>([])
  const [stats, setStats] = useState<LoginStats>({ total: 0, successful: 0, failed: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [limit, setLimit] = useState(50)

  const userRole = session?.user?.role as UserRole

  useEffect(() => {
    fetchHistory()
  }, [limit])

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/login-history?limit=${limit}`)
      const data = await response.json()

      if (response.ok) {
        setHistory(data.history)
        setStats(data.stats)
      } else {
        setError(data.error || 'Ошибка при загрузке истории')
      }
    } catch (err) {
      setError('Ошибка при загрузке истории')
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasPermission(userRole, 'history:view')) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Доступ запрещен
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          У вас нет прав для просмотра истории входов
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const successRate = stats.total > 0 
    ? ((stats.successful / stats.total) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">История входов</h2>
        <p className="mt-1 text-sm text-gray-500">
          Последние {history.length} попыток входа в систему
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего попыток
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Успешных
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    {stats.successful}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Неудачных
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {stats.failed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица истории */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Журнал входов
          </h3>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={25}>25 записей</option>
            <option value={50}>50 записей</option>
            <option value={100}>100 записей</option>
            <option value={200}>200 записей</option>
          </select>
        </div>
        <ul className="divide-y divide-gray-200">
          {history.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              История пуста
            </li>
          ) : (
            history.map((item) => (
              <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      {item.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {item.user.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({item.user.email})
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          {new Date(item.timestamp).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                        {item.ipAddress && <span>IP: {item.ipAddress}</span>}
                      </div>
                      {!item.success && item.reason && (
                        <div className="mt-1 text-xs text-red-600">
                          Причина: {item.reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.success ? 'Успешно' : 'Отклонено'}
                    </span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

