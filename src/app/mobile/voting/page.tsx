'use client'

import { useEffect, useState } from 'react'
import { useVotingsStore } from '@/stores/useVotingsStore'
import VotingCard from '@/components/mobile/VotingCard'
import { Filter } from 'lucide-react'

export default function MobileVotingPage() {
  const votings = useVotingsStore((state) => state.votings)
  const [mounted, setMounted] = useState(false)
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
  const filteredVotings = votings.filter((voting) => {
    return filter === 'ALL' || voting.status === filter
  })

  return (
    <div className="space-y-4">
      {/* Фильтр */}
      <div className="sticky top-14 z-10 bg-gray-50 p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-600 flex-shrink-0" />
          {[
            { key: 'ALL', label: 'Все' },
            { key: 'PREPARATION', label: 'Подготовка' },
            { key: 'ACTIVE', label: 'Активные' },
            { key: 'COMPLETED', label: 'Завершено' },
            { key: 'FAILED', label: 'Неуспешные' },
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

      {/* Список голосований */}
      <div className="px-4 space-y-3 pb-4">
        {filteredVotings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Голосования не найдены</p>
          </div>
        ) : (
          filteredVotings.map((voting) => (
            <VotingCard key={voting.id} voting={voting} />
          ))
        )}
      </div>

      {/* Счетчик */}
      <div className="sticky bottom-16 bg-white border-t border-gray-200 p-3 text-center shadow-lg">
        <p className="text-sm text-gray-600">
          Показано: <span className="font-semibold">{filteredVotings.length}</span> из{' '}
          <span className="font-semibold">{votings.length}</span>
        </p>
      </div>
    </div>
  )
}

