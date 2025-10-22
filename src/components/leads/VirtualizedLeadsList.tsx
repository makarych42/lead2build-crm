'use client'

import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { MapPin, Phone, Mail, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import { Lead } from '@/types'

interface VirtualizedLeadsListProps {
  leads: Lead[]
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function VirtualizedLeadsList({ leads, onView, onEdit, onDelete }: VirtualizedLeadsListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // примерная высота строки списка
    overscan: 5 // рендерим 5 дополнительных элементов
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
          const lead = leads[virtualRow.index]
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                padding: '0 4px'
              }}
            >
              <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow h-full">
                <div className="flex items-center justify-between">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {lead.address}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{lead.city}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        <span>{lead.contactPhone}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{new Date(lead.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(lead)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Просмотр"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      title="Редактировать"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

