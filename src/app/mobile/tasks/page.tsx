'use client'

import { useEffect, useState } from 'react'
import { useTasksStore } from '@/stores/useTasksStore'
import TaskCard from '@/components/mobile/TaskCard'
import { Filter } from 'lucide-react'

export default function MobileTasksPage() {
  const tasks = useTasksStore((state) => state.tasks)
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<string>('ACTIVE')

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

  // Фильтрация
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'ACTIVE') {
      return task.status !== 'COMPLETED' && task.status !== 'CANCELLED'
    }
    if (filter === 'COMPLETED') {
      return task.status === 'COMPLETED'
    }
    return task.status === filter
  })

  // Сортировка: сначала срочные, потом по дате
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Приоритет
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    const priorityDiff =
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
    if (priorityDiff !== 0) return priorityDiff

    // Дата
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className="space-y-4">
      {/* Фильтр */}
      <div className="sticky top-14 z-10 bg-gray-50 p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-600 flex-shrink-0" />
          {[
            { key: 'ACTIVE', label: 'Активные' },
            { key: 'PENDING', label: 'Ожидают' },
            { key: 'IN_PROGRESS', label: 'В работе' },
            { key: 'COMPLETED', label: 'Завершено' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Список задач */}
      <div className="px-4 space-y-3 pb-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === 'COMPLETED' ? 'Нет завершенных задач' : 'Нет активных задач'}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {/* Счетчик */}
      <div className="sticky bottom-16 bg-white border-t border-gray-200 p-3 text-center shadow-lg">
        <p className="text-sm text-gray-600">
          Показано: <span className="font-semibold">{sortedTasks.length}</span> из{' '}
          <span className="font-semibold">{tasks.length}</span>
        </p>
      </div>
    </div>
  )
}

