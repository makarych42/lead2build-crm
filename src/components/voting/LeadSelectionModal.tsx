'use client'

import { useState, useMemo } from 'react'
import { X, Search, MapPin, User, Phone } from 'lucide-react'
import { Lead } from './types'
import { Spinner } from '@/components/LoadingStates'

interface LeadSelectionModalProps {
  leads: Lead[]
  isLoading: boolean
  onSelect: (lead: Lead) => void
  onClose: () => void
}

export function LeadSelectionModal({ leads, isLoading, onSelect, onClose }: LeadSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Фильтруем только активные лиды
  const activeLeads = useMemo(() => {
    return leads.filter(lead => lead.status === 'IN_PROGRESS')
  }, [leads])

  // Фильтрация по поиску
  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return activeLeads

    const term = searchTerm.toLowerCase()
    return activeLeads.filter(
      lead =>
        lead.address.toLowerCase().includes(term) ||
        lead.city.toLowerCase().includes(term) ||
        lead.contactPerson.toLowerCase().includes(term) ||
        lead.contactPhone.includes(term)
    )
  }, [activeLeads, searchTerm])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Выберите лид для создания голосования
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по адресу, городу, контакту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Загрузка лидов...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {activeLeads.length === 0
                  ? 'Нет активных лидов для создания голосования'
                  : 'Лиды не найдены по вашему запросу'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {activeLeads.length === 0
                  ? 'Сначала создайте лид со статусом "В работе"'
                  : 'Попробуйте изменить критерии поиска'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onSelect(lead)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{lead.address}</p>
                            <p className="text-sm text-gray-500">{lead.city}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{lead.contactPerson}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{lead.contactPhone}</span>
                    </div>

                    {lead.buildingType && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Тип:</span> {lead.buildingType}
                        {lead.apartmentsCount && (
                          <span className="ml-2">• Квартир: {lead.apartmentsCount}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(lead)
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Создать голосование
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

