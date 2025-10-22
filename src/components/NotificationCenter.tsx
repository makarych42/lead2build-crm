'use client'

import { Bell, CheckCircle, AlertCircle, Clock, X, Settings, Filter, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  leadId?: string
  stage?: string
  priority: 'low' | 'medium' | 'high'
  actionRequired?: boolean
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // Start with empty notifications
  useEffect(() => {
    setNotifications([])
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'info':
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes} мин. назад`
    } else if (hours < 24) {
      return `${hours} ч. назад`
    } else {
      return `${days} дн. назад`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'urgent' && notification.priority === 'high')
    
    const matchesSearch = 
      searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const urgentCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Уведомления и напоминания</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
            {urgentCount > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                {urgentCount} срочных
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Отметить все прочитанными
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="all">Все уведомления</option>
              <option value="unread">Непрочитанные</option>
              <option value="urgent">Срочные</option>
            </select>
          </div>
          
          <div className="flex items-center flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск уведомлений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Настройки уведомлений */}
      {showSettings && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки уведомлений</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Email уведомления</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Telegram уведомления</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Напоминания о сроках</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Срочные уведомления</span>
            </label>
          </div>
        </div>
      )}

      {/* Список уведомлений */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Нет уведомлений</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.isRead ? 'bg-blue-50' : 'bg-white'
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`text-sm font-medium ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      {notification.actionRequired && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                          Требует действий
                        </span>
                      )}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatTime(notification.timestamp)}</span>
                      {notification.stage && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {notification.stage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Прочитано
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}