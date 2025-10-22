'use client'

import { Calendar, Clock, Bell, Plus, X, Save } from 'lucide-react'
import { useState } from 'react'

interface Reminder {
  id: string
  title: string
  stage: string
  triggerDays: number
  triggerCondition: 'before_deadline' | 'after_start' | 'no_activity'
  enabled: boolean
  channels: ('email' | 'telegram' | 'system')[]
  message: string
}

export default function ReminderSettings() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Напоминание о подготовке документов',
      stage: 'Подготовка документов',
      triggerDays: 2,
      triggerCondition: 'before_deadline',
      enabled: true,
      channels: ['email', 'system'],
      message: 'Осталось {days} дней до истечения срока подготовки документов для дома {address}'
    },
    {
      id: '2',
      title: 'Напоминание о назначении обследования',
      stage: 'Обследование',
      triggerDays: 1,
      triggerCondition: 'after_start',
      enabled: true,
      channels: ['telegram', 'system'],
      message: 'Необходимо назначить дату технического обследования для дома {address}'
    },
    {
      id: '3',
      title: 'Напоминание о голосовании',
      stage: 'Голосование',
      triggerDays: 1,
      triggerCondition: 'before_deadline',
      enabled: true,
      channels: ['email', 'telegram'],
      message: 'Завтра состоится голосование по дому {address}. Время: {time}'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    stage: '',
    triggerDays: 1,
    triggerCondition: 'before_deadline',
    enabled: true,
    channels: ['system'],
    message: ''
  })

  const stages = [
    'Консультация',
    'Подготовка документов',
    'Обследование',
    'Организация голосования',
    'Голосование',
    'Проверка условий',
    'Передача в строительство'
  ]

  const triggerConditions = [
    { value: 'before_deadline', label: 'За N дней до дедлайна' },
    { value: 'after_start', label: 'Через N дней после начала этапа' },
    { value: 'no_activity', label: 'При отсутствии активности N дней' }
  ]

  const channels = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'telegram', label: 'Telegram', icon: '📱' },
    { value: 'system', label: 'Системные', icon: '🔔' }
  ]

  const addReminder = () => {
    if (newReminder.title && newReminder.stage && newReminder.message) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        stage: newReminder.stage,
        triggerDays: newReminder.triggerDays || 1,
        triggerCondition: newReminder.triggerCondition || 'before_deadline',
        enabled: newReminder.enabled || true,
        channels: newReminder.channels || ['system'],
        message: newReminder.message
      }
      setReminders([...reminders, reminder])
      setNewReminder({
        title: '',
        stage: '',
        triggerDays: 1,
        triggerCondition: 'before_deadline',
        enabled: true,
        channels: ['system'],
        message: ''
      })
      setShowAddForm(false)
    }
  }

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    )
  }

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id))
  }

  const toggleChannel = (reminderId: string, channel: 'email' | 'telegram' | 'system') => {
    setReminders(prev => 
      prev.map(reminder => {
        if (reminder.id === reminderId) {
          const channels = reminder.channels.includes(channel)
            ? reminder.channels.filter(c => c !== channel)
            : [...reminder.channels, channel]
          return { ...reminder, channels }
        }
        return reminder
      })
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Настройка напоминаний</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить напоминание</span>
          </button>
        </div>
      </div>

      {/* Форма добавления нового напоминания */}
      {showAddForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Новое напоминание</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Введите название напоминания"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Этап
              </label>
              <select
                value={newReminder.stage}
                onChange={(e) => setNewReminder({...newReminder, stage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="">Выберите этап</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Условие срабатывания
              </label>
              <select
                value={newReminder.triggerCondition}
                onChange={(e) => setNewReminder({...newReminder, triggerCondition: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                {triggerConditions.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество дней
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={newReminder.triggerDays}
                onChange={(e) => setNewReminder({...newReminder, triggerDays: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Каналы уведомлений
              </label>
              <div className="flex space-x-4">
                {channels.map(channel => (
                  <label key={channel.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newReminder.channels?.includes(channel.value as any)}
                      onChange={() => {
                        const channels = newReminder.channels || []
                        const newChannels = channels.includes(channel.value as any)
                          ? channels.filter(c => c !== channel.value)
                          : [...channels, channel.value as any]
                        setNewReminder({...newReminder, channels: newChannels})
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{channel.icon} {channel.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст сообщения
              </label>
              <textarea
                value={newReminder.message}
                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Используйте переменные: {address}, {days}, {time}"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
            <button
              onClick={addReminder}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Сохранить</span>
            </button>
          </div>
        </div>
      )}

      {/* Список существующих напоминаний */}
      <div className="divide-y divide-gray-200">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{reminder.title}</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reminder.enabled}
                      onChange={(e) => updateReminder(reminder.id, { enabled: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Включено</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Этап:</span>
                    <p className="text-sm font-medium text-gray-900">{reminder.stage}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Условие:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {triggerConditions.find(c => c.value === reminder.triggerCondition)?.label} ({reminder.triggerDays} дн.)
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Каналы:</span>
                    <div className="flex space-x-2 mt-1">
                      {channels.map(channel => (
                        <label key={channel.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={reminder.channels.includes(channel.value as any)}
                            onChange={() => toggleChannel(reminder.id, channel.value as any)}
                            className="mr-1"
                          />
                          <span className="text-xs">{channel.icon}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-sm text-gray-500">Текст сообщения:</span>
                  <p className="text-sm text-gray-700 mt-1">{reminder.message}</p>
                </div>
              </div>
              
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="ml-4 text-red-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {reminders.length === 0 && (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Нет настроенных напоминаний</p>
          <p className="text-sm text-gray-400">Добавьте напоминание для автоматического отслеживания этапов</p>
        </div>
      )}
    </div>
  )
}