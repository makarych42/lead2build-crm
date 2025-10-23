import { Voting } from '@/types'
import { MapPin, Users, TrendingUp, Calendar } from 'lucide-react'

interface VotingCardProps {
  voting: Voting
}

export default function VotingCard({ voting }: VotingCardProps) {
  const statusColors: Record<string, string> = {
    PREPARATION: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    PREPARATION: 'Подготовка',
    ACTIVE: 'Активное',
    COMPLETED: 'Завершено',
    FAILED: 'Неуспешное',
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 active:shadow-lg transition-shadow">
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{voting.address}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>ID: {voting.id.slice(0, 8)}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[voting.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {statusLabels[voting.status] || voting.status}
        </span>
      </div>

      {/* Прогресс голосования */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Прогресс голосования</span>
          <span className="text-sm font-semibold text-gray-900">
            {voting.votesPercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              voting.votesPercent >= 50
                ? 'bg-green-500'
                : voting.votesPercent >= 25
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(voting.votesPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-gray-600 mb-1">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-xs">Квартир</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {voting.apartmentsCount || 0}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-gray-600 mb-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-xs">Голосов</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {voting.currentVotes} / {voting.requiredVotes || 0}
          </p>
        </div>
      </div>

      {/* Даты */}
      {voting.votingStartDate && voting.votingEndDate && (
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {new Date(voting.votingStartDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
              })}{' '}
              -{' '}
              {new Date(voting.votingEndDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
        </div>
      )}

      {/* Причина неуспеха */}
      {voting.status === 'FAILED' && voting.failureReason && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg">
          <p className="text-xs text-red-700">{voting.failureReason}</p>
        </div>
      )}
    </div>
  )
}

