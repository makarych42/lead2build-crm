'use client'

import { Search, Filter } from 'lucide-react'
import { TaskFilters as TaskFiltersType, User, TaskStatus, TaskPriority } from './types'
import { STATUS_LABELS, PRIORITY_LABELS } from './constants'

interface TaskFiltersProps {
  filters: TaskFiltersType
  users: User[]
  onFiltersChange: (filters: TaskFiltersType) => void
}

export function TaskFilters({ filters, users, onFiltersChange }: TaskFiltersProps) {
  const updateFilter = (key: keyof TaskFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Фильтры</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value as TaskStatus | 'ALL')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="ALL">Все статусы</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) => updateFilter('priority', e.target.value as TaskPriority | 'ALL')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="ALL">Все приоритеты</option>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Assigned To */}
        <select
          value={filters.assignedTo}
          onChange={(e) => updateFilter('assignedTo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="ALL">Все исполнители</option>
          {users.filter(u => u.active).map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => onFiltersChange({
            search: '',
            status: 'ALL',
            priority: 'ALL',
            assignedTo: 'ALL',
            type: 'ALL'
          })}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}

