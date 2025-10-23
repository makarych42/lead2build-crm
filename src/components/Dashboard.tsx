'use client'

import { Home, Clock, CheckCircle, AlertCircle, TrendingUp, Users, FileText, Vote, Calendar, Settings, BarChart3, PieChart, Plus } from 'lucide-react'
import { useState } from 'react'

interface DashboardProps {
  onNavigate?: (tab: string) => void
  onNewLead?: () => void
  refreshTrigger?: number
}

export default function Dashboard({ onNavigate, onNewLead, refreshTrigger }: DashboardProps = {}) {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  
  // Данные в зависимости от выбранного периода
  const getStatsForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return {
          totalLeads: 3,
          activeLeads: 2,
          completedLeads: 1,
          avgDuration: 7,
          successRate: 100,
          pendingInspections: 1,
          documentsReady: 2,
          activeVotings: 1,
          awaitingDecision: 1,
          avgVotingTime: 3,
          documentApprovalRate: 100,
          inspectionPassRate: 100
        }
      case 'month':
        return {
          totalLeads: 24,
          activeLeads: 8,
          completedLeads: 12,
          avgDuration: 45,
          successRate: 82,
          pendingInspections: 3,
          documentsReady: 15,
          activeVotings: 2,
          awaitingDecision: 5,
          avgVotingTime: 14,
          documentApprovalRate: 87,
          inspectionPassRate: 92
        }
      case 'quarter':
        return {
          totalLeads: 89,
          activeLeads: 25,
          completedLeads: 48,
          avgDuration: 52,
          successRate: 78,
          pendingInspections: 8,
          documentsReady: 62,
          activeVotings: 6,
          awaitingDecision: 18,
          avgVotingTime: 16,
          documentApprovalRate: 84,
          inspectionPassRate: 89
        }
      case 'year':
        return {
          totalLeads: 387,
          activeLeads: 89,
          completedLeads: 234,
          avgDuration: 58,
          successRate: 76,
          pendingInspections: 28,
          documentsReady: 298,
          activeVotings: 15,
          awaitingDecision: 67,
          avgVotingTime: 18,
          documentApprovalRate: 81,
          inspectionPassRate: 86
        }
      default:
        return {
          totalLeads: 0,
          activeLeads: 0,
          completedLeads: 0,
          avgDuration: 0,
          successRate: 0,
          pendingInspections: 0,
          documentsReady: 0,
          activeVotings: 0,
          awaitingDecision: 0,
          avgVotingTime: 0,
          documentApprovalRate: 0,
          inspectionPassRate: 0
        }
    }
  }

  const stats = getStatsForPeriod(selectedPeriod)

  const getStageStatsForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return [
          { stage: 'Консультация', count: 1, color: 'bg-blue-100 text-blue-800' },
          { stage: 'Подготовка документов', count: 1, color: 'bg-yellow-100 text-yellow-800' },
          { stage: 'Обследование', count: 0, color: 'bg-purple-100 text-purple-800' },
          { stage: 'Организация голосования', count: 1, color: 'bg-orange-100 text-orange-800' },
          { stage: 'Голосование', count: 0, color: 'bg-indigo-100 text-indigo-800' },
          { stage: 'Проверка условий', count: 0, color: 'bg-green-100 text-green-800' },
          { stage: 'Передача в строительство', count: 0, color: 'bg-gray-100 text-gray-800' }
        ]
      case 'month':
        return [
          { stage: 'Консультация', count: 5, color: 'bg-blue-100 text-blue-800' },
          { stage: 'Подготовка документов', count: 8, color: 'bg-yellow-100 text-yellow-800' },
          { stage: 'Обследование', count: 3, color: 'bg-purple-100 text-purple-800' },
          { stage: 'Организация голосования', count: 4, color: 'bg-orange-100 text-orange-800' },
          { stage: 'Голосование', count: 2, color: 'bg-indigo-100 text-indigo-800' },
          { stage: 'Проверка условий', count: 1, color: 'bg-green-100 text-green-800' },
          { stage: 'Передача в строительство', count: 1, color: 'bg-gray-100 text-gray-800' }
        ]
      case 'quarter':
        return [
          { stage: 'Консультация', count: 18, color: 'bg-blue-100 text-blue-800' },
          { stage: 'Подготовка документов', count: 25, color: 'bg-yellow-100 text-yellow-800' },
          { stage: 'Обследование', count: 12, color: 'bg-purple-100 text-purple-800' },
          { stage: 'Организация голосования', count: 15, color: 'bg-orange-100 text-orange-800' },
          { stage: 'Голосование', count: 8, color: 'bg-indigo-100 text-indigo-800' },
          { stage: 'Проверка условий', count: 7, color: 'bg-green-100 text-green-800' },
          { stage: 'Передача в строительство', count: 4, color: 'bg-gray-100 text-gray-800' }
        ]
      case 'year':
        return [
          { stage: 'Консультация', count: 89, color: 'bg-blue-100 text-blue-800' },
          { stage: 'Подготовка документов', count: 125, color: 'bg-yellow-100 text-yellow-800' },
          { stage: 'Обследование', count: 67, color: 'bg-purple-100 text-purple-800' },
          { stage: 'Организация голосования', count: 78, color: 'bg-orange-100 text-orange-800' },
          { stage: 'Голосование', count: 45, color: 'bg-indigo-100 text-indigo-800' },
          { stage: 'Проверка условий', count: 32, color: 'bg-green-100 text-green-800' },
          { stage: 'Передача в строительство', count: 18, color: 'bg-gray-100 text-gray-800' }
        ]
      default:
        return [
          { stage: 'Консультация', count: 0, color: 'bg-blue-100 text-blue-800' },
          { stage: 'Подготовка документов', count: 0, color: 'bg-yellow-100 text-yellow-800' },
          { stage: 'Обследование', count: 0, color: 'bg-purple-100 text-purple-800' },
          { stage: 'Организация голосования', count: 0, color: 'bg-orange-100 text-orange-800' },
          { stage: 'Голосование', count: 0, color: 'bg-indigo-100 text-indigo-800' },
          { stage: 'Проверка условий', count: 0, color: 'bg-green-100 text-green-800' },
          { stage: 'Передача в строительство', count: 0, color: 'bg-gray-100 text-gray-800' }
        ]
    }
  }

  const getMonthlyDataForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return [
          { month: 'Пн', completed: 1, started: 1 },
          { month: 'Вт', completed: 0, started: 1 },
          { month: 'Ср', completed: 0, started: 0 },
          { month: 'Чт', completed: 0, started: 1 },
          { month: 'Пт', completed: 0, started: 0 },
          { month: 'Сб', completed: 0, started: 0 }
        ]
      case 'month':
        return [
          { month: 'Янв', completed: 8, started: 12 },
          { month: 'Фев', completed: 12, started: 15 },
          { month: 'Мар', completed: 10, started: 18 },
          { month: 'Апр', completed: 15, started: 20 },
          { month: 'Май', completed: 18, started: 22 },
          { month: 'Июн', completed: 12, started: 16 }
        ]
      case 'quarter':
        return [
          { month: 'Q1', completed: 45, started: 65 },
          { month: 'Q2', completed: 52, started: 78 },
          { month: 'Q3', completed: 38, started: 56 },
          { month: 'Q4', completed: 41, started: 62 }
        ]
      case 'year':
        return [
          { month: '2019', completed: 156, started: 198 },
          { month: '2020', completed: 134, started: 187 },
          { month: '2021', completed: 178, started: 234 },
          { month: '2022', completed: 203, started: 267 },
          { month: '2023', completed: 189, started: 245 },
          { month: '2024', completed: 234, started: 289 }
        ]
      default:
        return [
          { month: 'Янв', completed: 0, started: 0 },
          { month: 'Фев', completed: 0, started: 0 },
          { month: 'Мар', completed: 0, started: 0 },
          { month: 'Апр', completed: 0, started: 0 },
          { month: 'Май', completed: 0, started: 0 },
          { month: 'Июн', completed: 0, started: 0 }
        ]
    }
  }

  const stageStats = getStageStatsForPeriod(selectedPeriod)
  const monthlyData = getMonthlyDataForPeriod(selectedPeriod)

  const getTrendForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return { leadsTrend: '+200%', activeTrend: '+150%', completedTrend: '+100%', durationTrend: '-30%' }
      case 'month':
        return { leadsTrend: '+12%', activeTrend: '+5%', completedTrend: '+18%', durationTrend: '-8%' }
      case 'quarter':
        return { leadsTrend: '+25%', activeTrend: '+15%', completedTrend: '+32%', durationTrend: '-12%' }
      case 'year':
        return { leadsTrend: '+45%', activeTrend: '+28%', completedTrend: '+67%', durationTrend: '-22%' }
      default:
        return { leadsTrend: '+0%', activeTrend: '+0%', completedTrend: '+0%', durationTrend: '-0%' }
    }
  }

  const trends = getTrendForPeriod(selectedPeriod)

  const primaryStats = [
    {
      title: 'Всего лидов',
      value: stats.totalLeads,
      icon: Home,
      color: 'bg-blue-500',
      change: trends.leadsTrend,
      trend: 'up'
    },
    {
      title: 'Активных лидов',
      value: stats.activeLeads,
      icon: Clock,
      color: 'bg-yellow-500',
      change: trends.activeTrend,
      trend: 'up'
    },
    {
      title: 'Завершено',
      value: stats.completedLeads,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: trends.completedTrend,
      trend: 'up'
    },
    {
      title: 'Средний срок (дней)',
      value: stats.avgDuration,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: trends.durationTrend,
      trend: 'down'
    }
  ]

  const secondaryStats = [
    {
      title: 'Документы готовы',
      value: stats.documentsReady,
      icon: FileText,
      color: 'bg-emerald-500'
    },
    {
      title: 'Активных голосований',
      value: stats.activeVotings,
      icon: Vote,
      color: 'bg-indigo-500'
    },
    {
      title: 'Ожидают решения',
      value: stats.awaitingDecision,
      icon: AlertCircle,
      color: 'bg-orange-500'
    },
    {
      title: 'Успешность (%)',
      value: stats.successRate,
      icon: Users,
      color: 'bg-rose-500'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Главная</h2>
        <p className="text-gray-600">Общая статистика по подготовке домов к строительству</p>
        
        <div className="mt-4 flex space-x-4">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
          </select>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white rounded-lg shadow mb-12" data-tour="dashboard-actions">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => onNewLead && onNewLead()}
              className="text-left p-4 rounded-lg border border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center">
                <Plus className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Добавить лид</p>
                  <p className="text-xs text-gray-600">Новая заявка</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigate && onNavigate('documents')}
              className="text-left p-4 rounded-lg border border-gray-300 bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Документы</p>
                  <p className="text-xs text-gray-600">Проверить статус</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigate && onNavigate('voting')}
              className="text-left p-4 rounded-lg border border-gray-300 bg-gray-50 hover:bg-purple-50 hover:border-purple-400 transition-colors"
            >
              <div className="flex items-center">
                <Vote className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Голосования</p>
                  <p className="text-xs text-gray-600">Отследить статус</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigate && onNavigate('settings')}
              className="text-left p-4 rounded-lg border border-gray-300 bg-gray-50 hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Настройки</p>
                  <p className="text-xs text-gray-600">Конфигурация</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-tour="dashboard-stats">
        {primaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Дополнительные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Статистика по этапам */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Лиды по этапам</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stageStats.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stage.color}`}>
                    {stage.stage}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{stage.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Месячная статистика */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Месячная динамика</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index} className="">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{data.month}</span>
                    <span className="text-gray-900 font-medium">{data.completed}/{data.started}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(data.completed / data.started) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Последние события */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Последние события</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Home className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Новый лид: ул. Ленина, 15</p>
                  <p className="text-xs text-gray-500">2 часа назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Обследование завершено: ул. Советская, 22</p>
                  <p className="text-xs text-gray-500">4 часа назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Vote className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Голосование успешно: ул. Мира, 8 (78% голосов)</p>
                  <p className="text-xs text-gray-500">6 часов назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Требуется внимание: ул. Пушкина, 12</p>
                  <p className="text-xs text-gray-500">8 часов назад</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
