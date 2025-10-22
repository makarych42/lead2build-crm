'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { ROLE_LABELS, ROLE_COLORS, UserRole } from '@/types'
import { hasPermission } from '@/lib/permissions'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  telegram?: string
  active: boolean
  blocked: boolean
  blockedReason?: string
  createdAt: string
  lastLogin?: string
}

export default function UserManagement() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const userRole = session?.user?.role as UserRole

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      } else {
        setError(data.error || 'Ошибка при загрузке пользователей')
      }
    } catch (err) {
      setError('Ошибка при загрузке пользователей')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockUser = async (userId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при блокировке пользователя')
      }
    } catch (err) {
      alert('Ошибка при блокировке пользователя')
    }
  }

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/block`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при разблокировке пользователя')
      }
    } catch (err) {
      alert('Ошибка при разблокировке пользователя')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при удалении пользователя')
      }
    } catch (err) {
      alert('Ошибка при удалении пользователя')
    }
  }

  if (!hasPermission(userRole, 'users:view')) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Доступ запрещен
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          У вас нет прав для просмотра пользователей
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Управление пользователями
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Всего пользователей: {users.length}
          </p>
        </div>
        {hasPermission(userRole, 'users:create') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить пользователя
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Последний вход
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ROLE_COLORS[user.role]
                    }`}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </div>
                  )}
                  {user.telegram && (
                    <div className="flex items-center text-xs text-gray-400">
                      @{user.telegram}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.blocked ? (
                    <span className="flex items-center text-sm text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Заблокирован
                    </span>
                  ) : user.active ? (
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Активен
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-gray-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      Неактивен
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Никогда'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {hasPermission(userRole, 'users:block') &&
                      user.id !== session?.user?.id && (
                        <>
                          {user.blocked ? (
                            <button
                              onClick={() => handleUnblockUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Разблокировать"
                            >
                              <Unlock className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleBlockUser(
                                  user.id,
                                  'Заблокирован администратором'
                                )
                              }
                              className="text-orange-600 hover:text-orange-900"
                              title="Заблокировать"
                            >
                              <Lock className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    {hasPermission(userRole, 'users:delete') &&
                      user.id !== session?.user?.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

