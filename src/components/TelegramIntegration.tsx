'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bot, Users, Bell, Settings as SettingsIcon, MessageCircle, CheckCircle, XCircle, Search, Filter, Send, Link, Unlink } from 'lucide-react'
import { useTelegramStore, useUsersStore } from '@/stores'
import { useNotification } from './NotificationService'
import TelegramAutomation from './TelegramAutomation'

// ============= ТИПЫ И ИНТЕРФЕЙСЫ =============

type UserRole = 'SALES_MANAGER' | 'DOCUMENT_SPECIALIST' | 'TECHNICAL_INSPECTOR' | 
                'VOTING_COORDINATOR' | 'VOTING_MANAGER' | 'ADMIN'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  telegram?: string
  avatar?: string
  active: boolean
  createdAt: string
  lastLogin?: string
}

interface TelegramConnection {
  userId: string
  telegramId?: string
  username?: string
  connected: boolean
  lastNotification?: string
  notificationsEnabled: boolean
}

interface TelegramNotification {
  id: string
  userId: string
  type: 'TASK_ASSIGNED' | 'TASK_OVERDUE' | 'TASK_DEADLINE' | 'LEAD_CREATED' | 'VOTING_CREATED' | 'DOCUMENT_READY'
  message: string
  entityId: string
  entityType: 'task' | 'lead' | 'voting' | 'document'
  sentAt: string
  delivered: boolean
  error?: string
}

interface TelegramSettings {
  botToken: string
  webhookUrl: string
  notificationsEnabled: boolean
}

// ============= КОНСТАНТЫ =============

const ROLE_LABELS: Record<UserRole, string> = {
  SALES_MANAGER: 'Менеджер по продажам',
  DOCUMENT_SPECIALIST: 'Специалист по документообороту',
  TECHNICAL_INSPECTOR: 'Инженер-инспектор',
  VOTING_COORDINATOR: 'Организатор голосований',
  VOTING_MANAGER: 'Координатор голосования',
  ADMIN: 'Администратор'
}

const NOTIFICATION_TYPE_LABELS: Record<TelegramNotification['type'], string> = {
  TASK_ASSIGNED: 'Задача назначена',
  TASK_OVERDUE: 'Задача просрочена',
  TASK_DEADLINE: 'Приближение дедлайна',
  LEAD_CREATED: 'Новый лид',
  VOTING_CREATED: 'Голосование создано',
  DOCUMENT_READY: 'Документ готов'
}

const NOTIFICATION_TYPE_ICONS: Record<TelegramNotification['type'], string> = {
  TASK_ASSIGNED: '📋',
  TASK_OVERDUE: '⚠️',
  TASK_DEADLINE: '⏰',
  LEAD_CREATED: '🏢',
  VOTING_CREATED: '🗳️',
  DOCUMENT_READY: '📄'
}

export default function TelegramIntegration() {
  // ============= STATE =============
  
  // Zustand stores
  const users = useUsersStore((state) => state.users)
  
  const connections = useTelegramStore((state) => state.connections)
  const addConnection = useTelegramStore((state) => state.addConnection)
  const updateConnection = useTelegramStore((state) => state.updateConnection)
  const deleteConnection = useTelegramStore((state) => state.deleteConnection)
  
  const notifications = useTelegramStore((state) => state.notifications)
  const addNotification = useTelegramStore((state) => state.addNotification)
  const setNotifications = useTelegramStore((state) => state.setNotifications)
  
  const settings = useTelegramStore((state) => state.settings)
  const setSettings = useTelegramStore((state) => state.setSettings)
  const updateSettings = useTelegramStore((state) => state.updateSettings)
  
  // Notifications
  const { success, error: showError, warning, info } = useNotification()
  
  const [activeTab, setActiveTab] = useState<'users' | 'notifications' | 'automation' | 'settings'>('users')
  const [botStatus, setBotStatus] = useState<'connected' | 'disconnected' | 'checking'>('disconnected')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [linkFormData, setLinkFormData] = useState({ telegramId: '', username: '' })
  
  // Фильтры
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL')
  const [filterStatus, setFilterStatus] = useState<'all' | 'connected' | 'disconnected'>('all')
  const [filterNotifType, setFilterNotifType] = useState<TelegramNotification['type'] | 'ALL'>('ALL')
  const [filterDelivery, setFilterDelivery] = useState<'all' | 'delivered' | 'failed'>('all')

  // ============= EFFECTS =============

  // Инициализация подключений для новых пользователей
  useEffect(() => {
    const existingUserIds = new Set(connections.map(c => c.userId))
    const newConnections: TelegramConnection[] = []
    
    users.forEach(user => {
      if (!existingUserIds.has(user.id)) {
        newConnections.push({
          userId: user.id,
          connected: false,
          notificationsEnabled: true
        })
      }
    })
    
    if (newConnections.length > 0) {
      newConnections.forEach(conn => addConnection(conn))
    }
  }, [users, connections, addConnection])

  // Проверка статуса бота
  useEffect(() => {
    if (settings?.botToken) {
      setBotStatus('connected')
    } else {
      setBotStatus('disconnected')
    }
  }, [settings?.botToken])

  // ============= COMPUTED VALUES =============

  const usersWithConnections = useMemo(() => {
    return users.map(user => {
      const connection = connections.find(c => c.userId === user.id)
      return {
        ...user,
        connection: connection || {
          userId: user.id,
          connected: false,
          notificationsEnabled: true
        }
      }
    })
  }, [users, connections])

  const filteredUsers = useMemo(() => {
    return usersWithConnections.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = filterRole === 'ALL' || user.role === filterRole
      
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'connected' && user.connection.connected) ||
        (filterStatus === 'disconnected' && !user.connection.connected)
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [usersWithConnections, searchTerm, filterRole, filterStatus])

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const matchesType = filterNotifType === 'ALL' || notif.type === filterNotifType
      const matchesDelivery = 
        filterDelivery === 'all' || 
        (filterDelivery === 'delivered' && notif.delivered) ||
        (filterDelivery === 'failed' && !notif.delivered)
      
      return matchesType && matchesDelivery
    }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }, [notifications, filterNotifType, filterDelivery])

  const stats = useMemo(() => {
    const totalUsers = users.length
    const connectedUsers = connections.filter(c => c.connected).length
    const totalNotifications = notifications.length
    const deliveredNotifications = notifications.filter(n => n.delivered).length
    const deliveryRate = totalNotifications > 0 ? (deliveredNotifications / totalNotifications * 100).toFixed(1) : '0'
    
    return { totalUsers, connectedUsers, totalNotifications, deliveredNotifications, deliveryRate }
  }, [users, connections, notifications])

  // ============= HANDLERS =============

  const handleOpenLinkModal = (user: User) => {
    setSelectedUser(user)
    const connection = connections.find(c => c.userId === user.id)
    setLinkFormData({
      telegramId: connection?.telegramId || '',
      username: connection?.username || ''
    })
    setShowLinkModal(true)
  }

  const handleCloseLinkModal = () => {
    setShowLinkModal(false)
    setSelectedUser(null)
    setLinkFormData({ telegramId: '', username: '' })
  }

  const handleLinkTelegram = () => {
    if (!selectedUser || !linkFormData.telegramId) {
      showError('Введите Telegram ID')
      return
    }

    updateConnection(selectedUser.id, {
      telegramId: linkFormData.telegramId,
      username: linkFormData.username,
      connected: true
    })

    success('Telegram успешно привязан!')
    handleCloseLinkModal()
  }

  const handleUnlinkTelegram = (userId: string) => {
    const confirmed = confirm('Отвязать Telegram от этого пользователя?')
    if (confirmed) {
      updateConnection(userId, {
        telegramId: undefined,
        username: undefined,
        connected: false
      })
      success('Telegram успешно отвязан!')
    }
  }

  const handleToggleNotifications = (userId: string) => {
    const connection = connections.find(c => c.userId === userId)
    if (connection) {
      updateConnection(userId, {
        notificationsEnabled: !connection.notificationsEnabled
      })
      success(`Уведомления ${connection.notificationsEnabled ? 'отключены' : 'включены'}`)
    }
  }

  const handleTestBotConnection = async () => {
    setBotStatus('checking')
    setTimeout(() => {
      if (settings?.botToken) {
        setBotStatus('connected')
        success('Подключение к боту успешно!')
      } else {
        setBotStatus('disconnected')
        showError('Введите токен бота')
      }
    }, 1500)
  }

  const handleSendTestNotification = (userId: string) => {
    const user = users.find(u => u.id === userId)
    const connection = connections.find(c => c.userId === userId)
    
    if (!connection?.connected) {
      warning('Пользователь не подключен к Telegram')
      return
    }

    const notification: TelegramNotification = {
      id: `notif-${Date.now()}`,
      userId,
      type: 'TASK_ASSIGNED',
      message: `Тестовое уведомление для ${user?.name}`,
      entityId: 'test',
      entityType: 'task',
      sentAt: new Date().toISOString(),
      delivered: Math.random() > 0.1 // 90% успех
    }

    addNotification(notification)
    success('Тестовое уведомление отправлено!')
  }

  const handleResendNotification = (notificationId: string) => {
    const updatedNotifications = notifications.map((notif: TelegramNotification) => 
      notif.id === notificationId
        ? { 
            ...notif, 
            delivered: Math.random() > 0.1,
            sentAt: new Date().toISOString() 
          }
        : notif
    )
    setNotifications(updatedNotifications)
    info('Уведомление отправлено повторно')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || 'Неизвестный пользователь'
  }

  // ============= RENDER =============

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Telegram Интеграция</h2>
            <div className={`px-2 py-1 text-xs rounded-full ${
              botStatus === 'connected' ? 'bg-green-100 text-green-800' :
              botStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {botStatus === 'connected' ? '🟢 Подключен' :
               botStatus === 'checking' ? '🟡 Проверка...' :
               '🔴 Отключен'}
            </div>
          </div>

          {/* Статистика */}
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="text-gray-500">Пользователей:</span>
              <span className="ml-2 font-medium text-gray-900">{stats.connectedUsers}/{stats.totalUsers}</span>
            </div>
            <div>
              <span className="text-gray-500">Уведомлений:</span>
              <span className="ml-2 font-medium text-gray-900">{stats.totalNotifications}</span>
            </div>
            <div>
              <span className="text-gray-500">Доставка:</span>
              <span className="ml-2 font-medium text-green-600">{stats.deliveryRate}%</span>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div className="mt-4 flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'users', label: 'Системные пользователи', icon: Users },
            { id: 'notifications', label: 'Уведомления', icon: Bell },
            { id: 'automation', label: 'Автоматизация', icon: MessageCircle },
            { id: 'settings', label: 'Настройки', icon: SettingsIcon }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Вкладка: Системные пользователи */}
        {activeTab === 'users' && (
          <div>
            {/* Фильтры */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени или email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              >
                <option value="ALL">Все роли</option>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="connected">Подключены</option>
                <option value="disconnected">Не подключены</option>
              </select>
            </div>

            {/* Таблица пользователей */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Роль
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Telegram
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Последнее уведомление
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Пользователи не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{ROLE_LABELS[user.role]}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.connection.connected ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {user.connection.username ? `@${user.connection.username}` : 'Подключен'}
                              </div>
                              <div className="text-gray-500 text-xs">
                                ID: {user.connection.telegramId}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Не подключен</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {user.connection.connected ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-300" />
                            )}
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={user.connection.notificationsEnabled}
                                onChange={() => handleToggleNotifications(user.id)}
                                disabled={!user.connection.connected}
                                className="mr-1"
                              />
                              <span className="text-xs text-gray-600">Уведомления</span>
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.connection.lastNotification 
                            ? formatDate(user.connection.lastNotification)
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {user.connection.connected ? (
                              <>
                                <button
                                  onClick={() => handleSendTestNotification(user.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Отправить тест"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUnlinkTelegram(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Отвязать"
                                >
                                  <Unlink className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleOpenLinkModal(user)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Привязать Telegram"
                              >
                                <Link className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Вкладка: Уведомления */}
        {activeTab === 'notifications' && (
          <div>
            {/* Фильтры */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filterNotifType}
                onChange={(e) => setFilterNotifType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              >
                <option value="ALL">Все типы</option>
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              
              <select
                value={filterDelivery}
                onChange={(e) => setFilterDelivery(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              >
                <option value="all">Все статусы доставки</option>
                <option value="delivered">Доставлено</option>
                <option value="failed">Не доставлено</option>
              </select>
            </div>

            {/* Список уведомлений */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>Уведомления не найдены</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div key={notif.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-2xl">{NOTIFICATION_TYPE_ICONS[notif.type]}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {NOTIFICATION_TYPE_LABELS[notif.type]}
                            </h4>
                            {notif.delivered ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>👤 {getUserName(notif.userId)}</span>
                            <span>🕒 {formatDate(notif.sentAt)}</span>
                            <span>📁 {notif.entityType}</span>
                          </div>
                          {notif.error && (
                            <p className="mt-2 text-xs text-red-600">Ошибка: {notif.error}</p>
                          )}
                        </div>
                      </div>
                      {!notif.delivered && (
                        <button
                          onClick={() => handleResendNotification(notif.id)}
                          className="ml-4 text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Повторить
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Вкладка: Автоматизация */}
        {activeTab === 'automation' && <TelegramAutomation />}

        {/* Вкладка: Настройки */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Настройки Telegram бота</h3>
            
            <div className="space-y-6">
              {/* Bot Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telegram Bot Token
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={settings?.botToken || ''}
                    onChange={(e) => updateSettings({ botToken: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Введите токен бота от @BotFather"
                  />
                  <button
                    onClick={handleTestBotConnection}
                    disabled={botStatus === 'checking'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {botStatus === 'checking' ? 'Проверка...' : 'Проверить'}
                  </button>
                </div>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL (опционально)
                </label>
                <input
                  type="text"
                  value={settings?.webhookUrl || ''}
                  onChange={(e) => updateSettings({ webhookUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="https://your-domain.com/api/telegram/webhook"
                />
              </div>

              {/* Общие настройки */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notificationsEnabled ?? true}
                    onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Включить отправку уведомлений</span>
                </label>
              </div>

              {/* Инструкция */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Инструкция по настройке</h4>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li>1. Создайте бота через @BotFather в Telegram</li>
                  <li>2. Получите токен бота и вставьте его выше</li>
                  <li>3. Пользователи должны написать команду /start вашему боту</li>
                  <li>4. Привяжите Telegram ID пользователей в разделе "Системные пользователи"</li>
                  <li>5. Настройте правила автоматизации в соответствующем разделе</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно привязки Telegram */}
      {showLinkModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Привязать Telegram
              </h3>
              <button onClick={handleCloseLinkModal} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Пользователь: <strong>{selectedUser.name}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Email: {selectedUser.email}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telegram Chat ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={linkFormData.telegramId}
                  onChange={(e) => setLinkFormData({ ...linkFormData, telegramId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username (опционально)
                </label>
                <input
                  type="text"
                  value={linkFormData.username}
                  onChange={(e) => setLinkFormData({ ...linkFormData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseLinkModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleLinkTelegram}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Привязать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
