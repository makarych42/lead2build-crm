'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Monitor, Smartphone, Tablet, Trash2, Shield } from 'lucide-react'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

interface Session {
  id: string
  userId: string
  sessionToken: string
  expires: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function SessionManagement() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const userRole = session?.user?.role as UserRole

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/sessions')
      const data = await response.json()

      if (response.ok) {
        setSessions(data.sessions)
      } else {
        setError(data.error || 'Ошибка при загрузке сессий')
      }
    } catch (err) {
      setError('Ошибка при загрузке сессий')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Вы уверены, что хотите завершить эту сессию?')) {
      return
    }

    try {
      const response = await fetch('/api/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        fetchSessions()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при завершении сессии')
      }
    } catch (err) {
      alert('Ошибка при завершении сессии')
    }
  }

  if (!hasPermission(userRole, 'sessions:view')) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Доступ запрещен
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          У вас нет прав для просмотра сессий
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

  const getDeviceIcon = () => {
    // В реальном приложении можно парсить user-agent
    return <Monitor className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Активные сессии</h2>
        <p className="mt-1 text-sm text-gray-500">
          Всего активных сессий: {sessions.length}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              Нет активных сессий
            </li>
          ) : (
            sessions.map((sess) => (
              <li key={sess.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-400">{getDeviceIcon()}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sess.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sess.user.email}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Истекает:{' '}
                        {new Date(sess.expires).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  {hasPermission(userRole, 'sessions:manage') && (
                    <button
                      onClick={() => handleTerminateSession(sess.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Завершить
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

