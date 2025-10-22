'use client'

import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  time?: string
  type: 'inspection' | 'voting' | 'deadline' | 'consultation' | 'meeting'
  leadId: string
  address: string
  description: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'urgent'
  participants?: number
}

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Моковые события
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Техническое обследование',
      date: new Date(2025, 8, 22, 10, 0), // 22 сентября 2025, 10:00
      time: '10:00',
      type: 'inspection',
      leadId: 'lead-1',
      address: 'ул. Ленина, 15',
      description: 'Техническое обследование здания перед началом строительных работ',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Общее собрание собственников',
      date: new Date(2025, 8, 23, 18, 0), // 23 сентября 2025, 18:00
      time: '18:00',
      type: 'voting',
      leadId: 'lead-2',
      address: 'ул. Советская, 22',
      description: 'Голосование по вопросу модернизации системы отопления',
      status: 'scheduled',
      participants: 45
    },
    {
      id: '3',
      title: 'Дедлайн подачи документов',
      date: new Date(2025, 8, 24, 23, 59), // 24 сентября 2025, 23:59
      type: 'deadline',
      leadId: 'lead-3',
      address: 'ул. Мира, 8',
      description: 'Крайний срок подачи всех необходимых документов',
      status: 'urgent'
    },
    {
      id: '4',
      title: 'Консультация с жильцами',
      date: new Date(2025, 8, 25, 14, 0), // 25 сентября 2025, 14:00
      time: '14:00',
      type: 'consultation',
      leadId: 'lead-4',
      address: 'ул. Пушкина, 12',
      description: 'Разъяснение процедуры голосования и ответы на вопросы',
      status: 'scheduled',
      participants: 20
    },
    {
      id: '5',
      title: 'Совещание с подрядчиками',
      date: new Date(2025, 8, 26, 16, 0), // 26 сентября 2025, 16:00
      time: '16:00',
      type: 'meeting',
      leadId: 'lead-5',
      address: 'Офис',
      description: 'Обсуждение готовности к началу строительных работ',
      status: 'scheduled'
    }
  ]

  const getEventColor = (type: CalendarEvent['type'], status: CalendarEvent['status']) => {
    if (status === 'urgent') return 'bg-red-500 text-white'
    if (status === 'cancelled') return 'bg-gray-400 text-white'
    if (status === 'completed') return 'bg-green-500 text-white'
    
    switch (type) {
      case 'inspection': return 'bg-blue-500 text-white'
      case 'voting': return 'bg-purple-500 text-white'
      case 'deadline': return 'bg-orange-500 text-white'
      case 'consultation': return 'bg-emerald-500 text-white'
      case 'meeting': return 'bg-indigo-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'inspection': return <Clock className="h-4 w-4" />
      case 'voting': return <Users className="h-4 w-4" />
      case 'deadline': return <AlertTriangle className="h-4 w-4" />
      case 'consultation': return <MapPin className="h-4 w-4" />
      case 'meeting': return <Calendar className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'inspection': return 'Обследование'
      case 'voting': return 'Голосование'
      case 'deadline': return 'Дедлайн'
      case 'consultation': return 'Консультация'
      case 'meeting': return 'Совещание'
      default: return 'Событие'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Добавляем пустые дни в начале месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const monthDays = getDaysInMonth(currentDate)
  const todaysEvents = events.filter(event => 
    event.date.toDateString() === new Date().toDateString()
  )

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Календарь событий</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {(['month', 'week', 'day'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === mode 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode === 'month' ? 'Месяц' : mode === 'week' ? 'Неделя' : 'День'}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Сегодня
            </button>
          </div>
        </div>

        {/* Навигация по месяцам */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-medium text-gray-900">
              {currentDate.toLocaleDateString('ru-RU', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Календарная сетка */}
        <div className="flex-1 p-6">
          {viewMode === 'month' && (
            <div>
              {/* Заголовки дней недели */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Дни месяца */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((date, index) => (
                  <div key={index} className="min-h-[100px] border border-gray-200 p-1">
                    {date && (
                      <div>
                        <button
                          onClick={() => setSelectedDate(date)}
                          className={`w-6 h-6 text-sm rounded-full flex items-center justify-center mb-1 ${
                            isToday(date) 
                              ? 'bg-blue-600 text-white' 
                              : isSelected(date)
                              ? 'bg-blue-100 text-blue-600'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                        
                        {/* События дня */}
                        <div className="space-y-1">
                          {getEventsForDate(date).slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventColor(event.type, event.status)}`}
                              title={`${event.title} - ${event.address}`}
                            >
                              {event.time && <span className="font-medium">{event.time}</span>}
                              <div className="truncate">{event.title}</div>
                            </div>
                          ))}
                          {getEventsForDate(date).length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{getEventsForDate(date).length - 3} еще
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Боковая панель с событиями */}
        <div className="w-80 border-l border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedDate ? formatDate(selectedDate) : 'События сегодня'}
          </h3>
          
          <div className="space-y-3">
            {(selectedDate ? getEventsForDate(selectedDate) : todaysEvents).map(event => (
              <div key={event.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded ${getEventColor(event.type, event.status)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </h4>
                      {event.status === 'urgent' && (
                        <span className="bg-red-100 text-red-800 text-xs px-1 py-0.5 rounded">
                          Срочно
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">
                      {getEventTypeLabel(event.type)} • {event.address}
                    </p>
                    
                    {event.time && (
                      <p className="text-xs text-gray-600 mb-1">
                        ⏰ {event.time}
                      </p>
                    )}
                    
                    {event.participants && (
                      <p className="text-xs text-gray-600 mb-1">
                        👥 {event.participants} участников
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-700">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {(selectedDate ? getEventsForDate(selectedDate) : todaysEvents).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Нет событий на этот день</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}