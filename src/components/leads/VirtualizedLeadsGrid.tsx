'use client'

import { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { MapPin, Phone, Mail, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import { Lead } from '@/types'

interface VirtualizedLeadsGridProps {
  leads: Lead[]
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function VirtualizedLeadsGrid({ leads, onView, onEdit, onDelete }: VirtualizedLeadsGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Вычисляем количество колонок на основе ширины экрана
  const COLUMNS = 3 // lg:grid-cols-3
  const ROW_HEIGHT = 240 // примерная высота карточки лида
  const GAP = 24 // gap-6

  // Группируем лиды по строкам для виртуализации
  const rows = useMemo(() => {
    const result: Lead[][] = []
    for (let i = 0; i < leads.length; i += COLUMNS) {
      result.push(leads.slice(i, i + COLUMNS))
    }
    return result
  }, [leads])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 2 // рендерим 2 дополнительные строки сверху и снизу
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      VOTING: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      NEW: 'Новый',
      IN_PROGRESS: 'В работе',
      VOTING: 'Голосование',
      COMPLETED: 'Завершён',
      FAILED: 'Неудачный'
    }
    return labels[status] || status
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Лиды не найдены</p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-300px)] overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowLeads = rows[virtualRow.index]
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                {rowLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {lead.address}
                        </h3>
                        <p className="text-sm text-gray-600">{lead.city}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{lead.contactPerson}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{lead.contactPhone}</span>
                      </div>
                      {lead.contactEmail && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="truncate">{lead.contactEmail}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(lead.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {lead.source || 'Неизвестно'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(lead)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Просмотр"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(lead)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

