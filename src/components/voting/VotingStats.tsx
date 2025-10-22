'use client'

import { useMemo } from 'react'
import { BarChart3, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'
import { Voting, VotingStats as VotingStatsType } from './types'
import { ProgressBar } from '@/components/LoadingStates'

interface VotingStatsProps {
  votings: Voting[]
}

export function VotingStats({ votings }: VotingStatsProps) {
  const stats = useMemo((): VotingStatsType => {
    const total = votings.length
    const preparation = votings.filter(v => v.status === 'PREPARATION').length
    const active = votings.filter(v => v.status === 'ACTIVE').length
    const completed = votings.filter(v => v.status === 'COMPLETED').length
    const failed = votings.filter(v => v.status === 'FAILED').length
    
    const successRate = completed + failed > 0 
      ? (completed / (completed + failed)) * 100 
      : 0
    
    const averageProgress = total > 0
      ? votings.reduce((sum, v) => sum + v.votesPercent, 0) / total
      : 0
    
    return {
      total,
      preparation,
      active,
      completed,
      failed,
      successRate,
      averageProgress
    }
  }, [votings])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Всего голосований */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Всего голосований</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <BarChart3 className="h-12 w-12 text-blue-500" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Подготовка:</span>
            <span className="font-medium">{stats.preparation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Активные:</span>
            <span className="font-medium">{stats.active}</span>
          </div>
        </div>
      </div>

      {/* Завершенные */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Завершенные</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <ProgressBar
          progress={stats.successRate}
          label="Процент успеха"
          color="green"
        />
      </div>

      {/* Неуспешные */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Неуспешные</p>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          </div>
          <XCircle className="h-12 w-12 text-red-500" />
        </div>
        <div className="text-sm text-gray-600">
          {stats.failed > 0 && (
            <p>Требуется анализ причин</p>
          )}
        </div>
      </div>

      {/* Средний прогресс */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Средний прогресс</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.averageProgress.toFixed(1)}%
            </p>
          </div>
          <Clock className="h-12 w-12 text-blue-500" />
        </div>
        <ProgressBar
          progress={stats.averageProgress}
          label="Общий прогресс"
          color="blue"
        />
      </div>
    </div>
  )
}

