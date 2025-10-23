'use client'

import { useEffect, useState } from 'react'
import { useLeadsStore } from '@/stores/useLeadsStore'
import LeadCard from '@/components/mobile/LeadCard'
import { Search, Filter } from 'lucide-react'

export default function MobileLeadsPage() {
  const leads = useLeadsStore((state) => state.leads)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<string>('ALL')

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
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.address
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'ALL' || lead.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      {/* Поиск и фильтр */}
      <div className="sticky top-14 z-10 bg-gray-50 p-4 space-y-3">
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Фильтр по статусу */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-600 flex-shrink-0" />
          {['ALL', 'NEW', 'IN_PROGRESS', 'VOTING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {status === 'ALL' ? 'Все' : 
               status === 'NEW' ? 'Новые' :
               status === 'IN_PROGRESS' ? 'В работе' :
               status === 'VOTING' ? 'Голосование' :
               'Завершено'}
            </button>
          ))}
        </div>
      </div>

      {/* Список лидов */}
      <div className="px-4 space-y-3 pb-4">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Лиды не найдены</p>
          </div>
        ) : (
          filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>

      {/* Счетчик */}
      <div className="sticky bottom-16 bg-white border-t border-gray-200 p-3 text-center shadow-lg">
        <p className="text-sm text-gray-600">
          Показано: <span className="font-semibold">{filteredLeads.length}</span> из{' '}
          <span className="font-semibold">{leads.length}</span>
        </p>
      </div>
    </div>
  )
}

