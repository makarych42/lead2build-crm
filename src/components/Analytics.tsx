'use client'

import { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Home, Vote, FileText, Building, Users, CheckCircle, XCircle, Clock, MapPin, Percent, Activity } from 'lucide-react'
import { useLeadsStore, useVotingsStore, useDocumentsStore } from '@/stores'
import type { Lead, Voting, Document } from '@/types'

interface Apartment {
  id: string
  number: string
  ownerName: string
  area: number
  phone?: string
  email?: string
  notes?: string
  voteStatus: 'FOR' | 'AGAINST' | 'ABSTAINED' | 'NOT_VOTED' | 'NO_CONTACT'
  apartments?: Apartment[]
}

type Section = 'overview' | 'leads' | 'votings' | 'apartments' | 'documents' | 'geography'
type Period = 'week' | 'month' | 'quarter' | 'year' | 'all'

export default function Analytics() {
  // Zustand stores (read-only)
  const leads = useLeadsStore((state) => state.leads)
  const votings = useVotingsStore((state) => state.votings)
  const documents = useDocumentsStore((state) => state.documents)
  
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('all')

  // Вспомогательная функция для фильтрации по периоду
  const filterByPeriod = (date: string, period: Period): boolean => {
    if (period === 'all') return true
    
    const itemDate = new Date(date)
    const now = new Date()
    const diffTime = now.getTime() - itemDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    
    switch(period) {
      case 'week': return diffDays <= 7
      case 'month': return diffDays <= 30
      case 'quarter': return diffDays <= 90
      case 'year': return diffDays <= 365
      default: return true
    }
  }

  // Расчет процентов
  const calculatePercentage = (part: number, total: number): number => {
    return total > 0 ? Math.round((part / total) * 100) : 0
  }

  // Статистика по лидам
  const leadStats = useMemo(() => {
    const filteredLeads = leads.filter(lead => filterByPeriod(lead.createdAt, selectedPeriod))
    
    const byStatus = {
      new: filteredLeads.filter(l => l.status === 'NEW').length,
      inProgress: filteredLeads.filter(l => l.status === 'IN_PROGRESS').length,
      voting: filteredLeads.filter(l => l.status === 'VOTING').length,
      completed: filteredLeads.filter(l => l.status === 'COMPLETED').length,
      rejected: filteredLeads.filter(l => l.status === 'REJECTED').length,
    }
    
    const total = filteredLeads.length
    const successRate = calculatePercentage(byStatus.completed, total - byStatus.rejected)
    
    // Расчет конверсии по воронке
    const conversionRate = total > 0 ? {
      newToProgress: calculatePercentage(byStatus.inProgress + byStatus.voting + byStatus.completed, total),
      progressToVoting: calculatePercentage(byStatus.voting + byStatus.completed, byStatus.inProgress + byStatus.voting + byStatus.completed),
      votingToCompleted: calculatePercentage(byStatus.completed, byStatus.voting + byStatus.completed),
    } : { newToProgress: 0, progressToVoting: 0, votingToCompleted: 0 }
    
    // ТОП источников
    const sourceMap = new Map<string, number>()
    filteredLeads.forEach(lead => {
      const count = sourceMap.get(lead.source) || 0
      sourceMap.set(lead.source, count + 1)
    })
    const topSources = Array.from(sourceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))
    
    return {
      total,
      byStatus,
      successRate,
      conversionRate,
      topSources
    }
  }, [leads, selectedPeriod])

  // Статистика по голосованиям
  const votingStats = useMemo(() => {
    const filteredVotings = votings.filter(v => 
      v.votingStartDate ? filterByPeriod(v.votingStartDate, selectedPeriod) : true
    )
    
    const byStatus = {
      preparation: filteredVotings.filter(v => v.status === 'PREPARATION').length,
      active: filteredVotings.filter(v => v.status === 'ACTIVE').length,
      completed: filteredVotings.filter(v => v.status === 'COMPLETED').length,
      failed: filteredVotings.filter(v => v.status === 'FAILED').length,
    }
    
    const total = filteredVotings.length
    const finishedTotal = byStatus.completed + byStatus.failed
    const successRate = calculatePercentage(byStatus.completed, finishedTotal)
    
    // Средний процент голосов "За" в успешных голосованиях
    const completedVotings = filteredVotings.filter(v => v.status === 'COMPLETED')
    const avgVotesPercent = completedVotings.length > 0
      ? Math.round(completedVotings.reduce((sum, v) => sum + v.votesPercent, 0) / completedVotings.length)
      : 0
    
    // Распределение по формам голосования
    const byForm = {
      meeting: filteredVotings.filter(v => v.votingForm === 'MEETING').length,
      absentee: filteredVotings.filter(v => v.votingForm === 'ABSENTEE').length,
      mixed: filteredVotings.filter(v => v.votingForm === 'MIXED').length,
    }
    
    // Расчет средней длительности голосования
    const durationsCalculated = filteredVotings
      .filter(v => v.votingStartDate && v.votingEndDate)
      .map(v => {
        const start = new Date(v.votingStartDate!)
        const end = new Date(v.votingEndDate!)
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      })
    const avgDuration = durationsCalculated.length > 0
      ? Math.round(durationsCalculated.reduce((a, b) => a + b, 0) / durationsCalculated.length)
      : 0
    
    // Анализ по площадям
    let totalArea = 0
    let votedForArea = 0
    filteredVotings.forEach(voting => {
      if (voting.apartments) {
        voting.apartments.forEach(apt => {
          totalArea += apt.area
          if (apt.voteStatus === 'FOR') {
            votedForArea += apt.area
          }
        })
      }
    })
    
    return {
      total,
      byStatus,
      successRate,
      avgVotesPercent,
      byForm,
      avgDuration,
      totalArea: totalArea.toFixed(1),
      votedForArea: votedForArea.toFixed(1),
      areaPercent: calculatePercentage(votedForArea, totalArea)
    }
  }, [votings, selectedPeriod])

  // Статистика по квартирам
  const apartmentStats = useMemo(() => {
    const allApartments: Apartment[] = []
    votings.forEach(voting => {
      if (voting.apartments) {
        allApartments.push(...voting.apartments)
      }
    })
    
    const total = allApartments.length
    const byStatus = {
      for: allApartments.filter(a => a.voteStatus === 'FOR').length,
      against: allApartments.filter(a => a.voteStatus === 'AGAINST').length,
      abstained: allApartments.filter(a => a.voteStatus === 'ABSTAINED').length,
      notVoted: allApartments.filter(a => a.voteStatus === 'NOT_VOTED').length,
      noContact: allApartments.filter(a => a.voteStatus === 'NO_CONTACT').length,
    }
    
    const participated = byStatus.for + byStatus.against + byStatus.abstained
    const engagementRate = calculatePercentage(participated, total)
    
    const totalArea = allApartments.reduce((sum, a) => sum + a.area, 0)
    const avgArea = total > 0 ? (totalArea / total).toFixed(1) : '0'
    
    // Площади по статусам
    const areaByStatus = {
      for: allApartments.filter(a => a.voteStatus === 'FOR').reduce((sum, a) => sum + a.area, 0),
      against: allApartments.filter(a => a.voteStatus === 'AGAINST').reduce((sum, a) => sum + a.area, 0),
      abstained: allApartments.filter(a => a.voteStatus === 'ABSTAINED').reduce((sum, a) => sum + a.area, 0),
      notVoted: allApartments.filter(a => a.voteStatus === 'NOT_VOTED').reduce((sum, a) => sum + a.area, 0),
      noContact: allApartments.filter(a => a.voteStatus === 'NO_CONTACT').reduce((sum, a) => sum + a.area, 0),
    }
    
    return {
      total,
      byStatus,
      engagementRate,
      totalArea: totalArea.toFixed(1),
      avgArea,
      areaByStatus
    }
  }, [votings])

  // Статистика по документам
  const documentStats = useMemo(() => {
    const filteredDocs = documents.filter(doc => filterByPeriod(doc.uploadedAt, selectedPeriod))
    
    const total = filteredDocs.length
    const byStatus = {
      pending: filteredDocs.filter(d => d.status === 'pending').length,
      verified: filteredDocs.filter(d => d.status === 'verified').length,
      rejected: filteredDocs.filter(d => d.status === 'rejected').length,
    }
    
    const approvalRate = calculatePercentage(byStatus.verified, byStatus.verified + byStatus.rejected)
    
    // Распределение по категориям
    const categoryMap = new Map<string, number>()
    filteredDocs.forEach(doc => {
      const count = categoryMap.get(doc.category) || 0
      categoryMap.set(doc.category, count + 1)
    })
    const byCategory = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
    
    return {
      total,
      byStatus,
      approvalRate,
      byCategory
    }
  }, [documents, selectedPeriod])

  // География и типы домов
  const geographyStats = useMemo(() => {
    const filteredLeads = leads.filter(lead => filterByPeriod(lead.createdAt, selectedPeriod))
    
    // ТОП-5 городов
    const cityMap = new Map<string, number>()
    filteredLeads.forEach(lead => {
      const count = cityMap.get(lead.city) || 0
      cityMap.set(lead.city, count + 1)
    })
    const topCities = Array.from(cityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }))
    
    // Распределение по типам зданий
    const buildingTypeMap = new Map<string, number>()
    filteredLeads.forEach(lead => {
      if (lead.buildingType) {
        const count = buildingTypeMap.get(lead.buildingType) || 0
        buildingTypeMap.set(lead.buildingType, count + 1)
      }
    })
    const byBuildingType = Array.from(buildingTypeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
    
    // Средняя этажность
    const floorsData = filteredLeads.filter(l => l.floorsCount && l.floorsCount > 0)
    const avgFloors = floorsData.length > 0
      ? (floorsData.reduce((sum, l) => sum + (l.floorsCount || 0), 0) / floorsData.length).toFixed(1)
      : '0'
    
    // Среднее количество квартир
    const apartmentsData = filteredLeads.filter(l => l.apartmentsCount && l.apartmentsCount > 0)
    const avgApartments = apartmentsData.length > 0
      ? (apartmentsData.reduce((sum, l) => sum + (l.apartmentsCount || 0), 0) / apartmentsData.length).toFixed(1)
      : '0'
    
    return {
      topCities,
      byBuildingType,
      avgFloors,
      avgApartments
    }
  }, [leads, selectedPeriod])

  const sections = [
    { id: 'overview', label: 'Обзор', icon: BarChart3 },
    { id: 'leads', label: 'Лиды', icon: Home },
    { id: 'votings', label: 'Голосования', icon: Vote },
    { id: 'apartments', label: 'Квартиры', icon: Building },
    { id: 'documents', label: 'Документы', icon: FileText },
    { id: 'geography', label: 'География', icon: MapPin },
  ]

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-md p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const ProgressBar = ({ label, value, total, color = 'bg-blue-500' }: any) => {
    const percentage = calculatePercentage(value, total)
    return (
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">{label}</span>
          <span className="text-gray-900 font-medium">{value} ({percentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${color} h-2 rounded-full transition-all`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Заголовок и фильтры */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Аналитика</h2>
        <p className="text-gray-600">Комплексная аналитика по всем аспектам системы</p>
        
        <div className="mt-4 flex items-center space-x-4">
          <div>
            <label className="text-sm text-gray-700 mr-2">Период:</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
            >
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="quarter">Квартал</option>
              <option value="year">Год</option>
              <option value="all">Все время</option>
            </select>
          </div>
        </div>
      </div>

      {/* Вкладки разделов */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as Section)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Раздел: Обзор */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Общая статистика</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Всего лидов" 
                value={leadStats.total} 
                icon={Home} 
                color="bg-blue-500"
                subtitle={`Завершено: ${leadStats.byStatus.completed}`}
              />
              <StatCard 
                title="Всего голосований" 
                value={votingStats.total} 
                icon={Vote} 
                color="bg-purple-500"
                subtitle={`Успешность: ${votingStats.successRate}%`}
              />
              <StatCard 
                title="Всего квартир" 
                value={apartmentStats.total} 
                icon={Building} 
                color="bg-green-500"
                subtitle={`Вовлеченность: ${apartmentStats.engagementRate}%`}
              />
              <StatCard 
                title="Всего документов" 
                value={documentStats.total} 
                icon={FileText} 
                color="bg-orange-500"
                subtitle={`Одобрено: ${documentStats.approvalRate}%`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Лиды по статусам */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Лиды по статусам</h4>
              <ProgressBar label="Новые" value={leadStats.byStatus.new} total={leadStats.total} color="bg-gray-500" />
              <ProgressBar label="В работе" value={leadStats.byStatus.inProgress} total={leadStats.total} color="bg-blue-500" />
              <ProgressBar label="Голосование" value={leadStats.byStatus.voting} total={leadStats.total} color="bg-purple-500" />
              <ProgressBar label="Завершено" value={leadStats.byStatus.completed} total={leadStats.total} color="bg-green-500" />
              <ProgressBar label="Отклонено" value={leadStats.byStatus.rejected} total={leadStats.total} color="bg-red-500" />
            </div>

            {/* Голосования по статусам */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Голосования по статусам</h4>
              <ProgressBar label="Подготовка" value={votingStats.byStatus.preparation} total={votingStats.total} color="bg-yellow-500" />
              <ProgressBar label="Активные" value={votingStats.byStatus.active} total={votingStats.total} color="bg-blue-500" />
              <ProgressBar label="Завершено успешно" value={votingStats.byStatus.completed} total={votingStats.total} color="bg-green-500" />
              <ProgressBar label="Неудачное" value={votingStats.byStatus.failed} total={votingStats.total} color="bg-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Общая площадь квартир" 
              value={`${apartmentStats.totalArea} м²`} 
              icon={Activity} 
              color="bg-indigo-500"
            />
            <StatCard 
              title="Площадь 'За'" 
              value={`${apartmentStats.areaByStatus.for.toFixed(1)} м²`} 
              icon={CheckCircle} 
              color="bg-green-500"
            />
            <StatCard 
              title="Средний % голосов 'За'" 
              value={`${votingStats.avgVotesPercent}%`} 
              icon={Percent} 
              color="bg-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Раздел: Лиды */}
      {activeSection === 'leads' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Статистика по лидам</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Всего лидов" value={leadStats.total} icon={Home} color="bg-blue-500" />
              <StatCard title="Новые" value={leadStats.byStatus.new} icon={Clock} color="bg-gray-500" />
              <StatCard title="В работе" value={leadStats.byStatus.inProgress} icon={Activity} color="bg-blue-500" />
              <StatCard title="Завершено" value={leadStats.byStatus.completed} icon={CheckCircle} color="bg-green-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Воронка продаж */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Воронка конверсии</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Новые → В работе/Голосование/Завершено</span>
                    <span className="font-medium text-gray-900">{leadStats.conversionRate.newToProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${leadStats.conversionRate.newToProgress}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">В работе → Голосование/Завершено</span>
                    <span className="font-medium text-gray-900">{leadStats.conversionRate.progressToVoting}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${leadStats.conversionRate.progressToVoting}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Голосование → Завершено</span>
                    <span className="font-medium text-gray-900">{leadStats.conversionRate.votingToCompleted}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${leadStats.conversionRate.votingToCompleted}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ТОП источников */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">ТОП источников лидов</h4>
              <div className="space-y-3">
                {leadStats.topSources.length > 0 ? (
                  leadStats.topSources.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{item.source}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Распределение по статусам</h4>
            <ProgressBar label="Новые" value={leadStats.byStatus.new} total={leadStats.total} color="bg-gray-500" />
            <ProgressBar label="В работе" value={leadStats.byStatus.inProgress} total={leadStats.total} color="bg-blue-500" />
            <ProgressBar label="На голосовании" value={leadStats.byStatus.voting} total={leadStats.total} color="bg-purple-500" />
            <ProgressBar label="Завершено" value={leadStats.byStatus.completed} total={leadStats.total} color="bg-green-500" />
            <ProgressBar label="Отклонено" value={leadStats.byStatus.rejected} total={leadStats.total} color="bg-red-500" />
          </div>
        </div>
      )}

      {/* Раздел: Голосования */}
      {activeSection === 'votings' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Статистика по голосованиям</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Всего голосований" value={votingStats.total} icon={Vote} color="bg-purple-500" />
              <StatCard title="Активные" value={votingStats.byStatus.active} icon={Clock} color="bg-blue-500" />
              <StatCard title="Успешные" value={votingStats.byStatus.completed} icon={CheckCircle} color="bg-green-500" />
              <StatCard title="Неудачные" value={votingStats.byStatus.failed} icon={XCircle} color="bg-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Процент успеха" 
              value={`${votingStats.successRate}%`} 
              icon={TrendingUp} 
              color="bg-emerald-500"
            />
            <StatCard 
              title="Средний % 'За'" 
              value={`${votingStats.avgVotesPercent}%`} 
              icon={Percent} 
              color="bg-indigo-500"
            />
            <StatCard 
              title="Средняя длительность" 
              value={`${votingStats.avgDuration} дн.`} 
              icon={Clock} 
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* По статусам */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Распределение по статусам</h4>
              <ProgressBar label="Подготовка" value={votingStats.byStatus.preparation} total={votingStats.total} color="bg-yellow-500" />
              <ProgressBar label="Активные" value={votingStats.byStatus.active} total={votingStats.total} color="bg-blue-500" />
              <ProgressBar label="Завершено успешно" value={votingStats.byStatus.completed} total={votingStats.total} color="bg-green-500" />
              <ProgressBar label="Неудачное" value={votingStats.byStatus.failed} total={votingStats.total} color="bg-red-500" />
            </div>

            {/* По формам */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Формы голосования</h4>
              <ProgressBar label="Очное собрание" value={votingStats.byForm.meeting} total={votingStats.total} color="bg-blue-500" />
              <ProgressBar label="Заочное" value={votingStats.byForm.absentee} total={votingStats.total} color="bg-purple-500" />
              <ProgressBar label="Смешанное" value={votingStats.byForm.mixed} total={votingStats.total} color="bg-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Анализ по площадям</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Общая площадь</p>
                <p className="text-2xl font-bold text-gray-900">{votingStats.totalArea} м²</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Площадь 'За'</p>
                <p className="text-2xl font-bold text-green-700">{votingStats.votedForArea} м²</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Процент от площади</p>
                <p className="text-2xl font-bold text-blue-700">{votingStats.areaPercent}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Раздел: Квартиры */}
      {activeSection === 'apartments' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Статистика по квартирам</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Всего квартир" value={apartmentStats.total} icon={Building} color="bg-blue-500" />
              <StatCard title="Проголосовали" value={apartmentStats.byStatus.for + apartmentStats.byStatus.against + apartmentStats.byStatus.abstained} icon={CheckCircle} color="bg-green-500" />
              <StatCard title="Вовлеченность" value={`${apartmentStats.engagementRate}%`} icon={Users} color="bg-purple-500" />
              <StatCard title="Средняя площадь" value={`${apartmentStats.avgArea} м²`} icon={Activity} color="bg-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Распределение по статусам голосования</h4>
            <ProgressBar label="За" value={apartmentStats.byStatus.for} total={apartmentStats.total} color="bg-green-500" />
            <ProgressBar label="Против" value={apartmentStats.byStatus.against} total={apartmentStats.total} color="bg-red-500" />
            <ProgressBar label="Воздержался" value={apartmentStats.byStatus.abstained} total={apartmentStats.total} color="bg-yellow-500" />
            <ProgressBar label="Не голосовал" value={apartmentStats.byStatus.notVoted} total={apartmentStats.total} color="bg-gray-500" />
            <ProgressBar label="Не дозвон" value={apartmentStats.byStatus.noContact} total={apartmentStats.total} color="bg-orange-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Площади по статусам голосования</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">За</p>
                <p className="text-xl font-bold text-green-700">{apartmentStats.areaByStatus.for.toFixed(1)} м²</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Против</p>
                <p className="text-xl font-bold text-red-700">{apartmentStats.areaByStatus.against.toFixed(1)} м²</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Воздержался</p>
                <p className="text-xl font-bold text-yellow-700">{apartmentStats.areaByStatus.abstained.toFixed(1)} м²</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Не голосовал</p>
                <p className="text-xl font-bold text-gray-700">{apartmentStats.areaByStatus.notVoted.toFixed(1)} м²</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Не дозвон</p>
                <p className="text-xl font-bold text-orange-700">{apartmentStats.areaByStatus.noContact.toFixed(1)} м²</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Общая информация</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Общая площадь всех квартир</p>
                <p className="text-2xl font-bold text-blue-700">{apartmentStats.totalArea} м²</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">Процент вовлеченности</p>
                <p className="text-2xl font-bold text-indigo-700">{apartmentStats.engagementRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {apartmentStats.byStatus.for + apartmentStats.byStatus.against + apartmentStats.byStatus.abstained} из {apartmentStats.total} квартир
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Раздел: Документы */}
      {activeSection === 'documents' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Статистика по документам</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Всего документов" value={documentStats.total} icon={FileText} color="bg-blue-500" />
              <StatCard title="На проверке" value={documentStats.byStatus.pending} icon={Clock} color="bg-yellow-500" />
              <StatCard title="Проверено" value={documentStats.byStatus.verified} icon={CheckCircle} color="bg-green-500" />
              <StatCard title="Отклонено" value={documentStats.byStatus.rejected} icon={XCircle} color="bg-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* По статусам */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Распределение по статусам</h4>
              <ProgressBar label="На проверке" value={documentStats.byStatus.pending} total={documentStats.total} color="bg-yellow-500" />
              <ProgressBar label="Проверено" value={documentStats.byStatus.verified} total={documentStats.total} color="bg-green-500" />
              <ProgressBar label="Отклонено" value={documentStats.byStatus.rejected} total={documentStats.total} color="bg-red-500" />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Процент одобрения</span>
                  <span className="text-lg font-bold text-green-600">{documentStats.approvalRate}%</span>
                </div>
              </div>
            </div>

            {/* По категориям */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Распределение по категориям</h4>
              <div className="space-y-3">
                {documentStats.byCategory.length > 0 ? (
                  documentStats.byCategory.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.category}</span>
                        <span className="text-gray-900 font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${calculatePercentage(item.count, documentStats.total)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Раздел: География */}
      {activeSection === 'geography' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Географическая аналитика</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Городов" value={geographyStats.topCities.length} icon={MapPin} color="bg-blue-500" />
              <StatCard title="Типов зданий" value={geographyStats.byBuildingType.length} icon={Building} color="bg-purple-500" />
              <StatCard title="Средняя этажность" value={geographyStats.avgFloors} icon={TrendingUp} color="bg-green-500" />
              <StatCard title="Среднее кв-р в доме" value={geographyStats.avgApartments} icon={Home} color="bg-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ТОП городов */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">ТОП-5 городов по количеству лидов</h4>
              <div className="space-y-3">
                {geographyStats.topCities.length > 0 ? (
                  geographyStats.topCities.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{index + 1}. {item.city}</span>
                        <span className="text-gray-900 font-medium">{item.count} лидов</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${calculatePercentage(item.count, leadStats.total)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                )}
              </div>
            </div>

            {/* Типы зданий */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Распределение по типам зданий</h4>
              <div className="space-y-3">
                {geographyStats.byBuildingType.length > 0 ? (
                  geographyStats.byBuildingType.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.type}</span>
                        <span className="text-gray-900 font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${calculatePercentage(item.count, leadStats.total)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state если нет данных */}
      {leads.length === 0 && votings.length === 0 && documents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет данных для аналитики</h3>
          <p className="mt-1 text-sm text-gray-500">
            Начните добавлять лиды, голосования и документы, чтобы увидеть аналитику
          </p>
        </div>
      )}
    </div>
  )
}

