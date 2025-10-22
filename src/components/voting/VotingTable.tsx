'use client'

import { Fragment, useMemo } from 'react'
import { ChevronDown, ChevronRight, Edit2, Trash2, Calendar } from 'lucide-react'
import { Voting } from './types'
import { useInlineEdit, useExpandableRows } from './hooks'
import { getStatusColor, getStatusText, formatDate, formatDateForInput, getNextStatus, canChangeStatus } from './utils'
import { ApartmentSubTable } from './ApartmentTable'
import { useNotification } from '@/components/NotificationService'

import { VotingStatus } from '@/types'

interface VotingTableProps {
  votings: Voting[]
  activeTab: string
  onUpdate: (votingId: string, field: string, value: any) => void
  onDelete: (votingId: string) => void
  onStatusChange: (votingId: string, newStatus: VotingStatus) => void
}

export function VotingTable({ votings, activeTab, onUpdate, onDelete, onStatusChange }: VotingTableProps) {
  const { showNotification } = useNotification()
  const { editingCell, tempValue, setTempValue, startEdit, cancelEdit, isEditing } = useInlineEdit()
  const { expandedRows, toggleRow, isExpanded } = useExpandableRows()

  // Фильтрация по активной вкладке
  const filteredVotings = useMemo(() => {
    if (activeTab === 'active') return votings.filter(v => v.status === 'ACTIVE')
    if (activeTab === 'completed') return votings.filter(v => v.status === 'COMPLETED')
    return votings
  }, [votings, activeTab])

  const handleCellClick = (votingId: string, field: string, currentValue: any) => {
    startEdit(votingId, field, currentValue)
  }

  const handleCellSave = (votingId: string, field: string) => {
    if (tempValue !== '') {
      onUpdate(votingId, field, tempValue)
    }
    cancelEdit()
  }

  const handleKeyDown = (e: React.KeyboardEvent, votingId: string, field: string) => {
    if (e.key === 'Enter') {
      handleCellSave(votingId, field)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const handleStatusChange = (voting: Voting, newStatus: string) => {
    const check = canChangeStatus(voting, newStatus)
    if (!check.can) {
      showNotification(check.reason || 'Невозможно изменить статус', 'error')
      cancelEdit()
      return
    }
    onStatusChange(voting.id, newStatus)
    cancelEdit()
  }

  const handleApartmentsCountClick = (voting: Voting) => {
    if (!voting.apartments || voting.apartments.length === 0) {
      if (voting.apartmentsCount && voting.apartmentsCount > 0) {
        showNotification(`Квартиры не созданы. Раскройте строку для создания.`, 'warning')
      }
    }
    toggleRow(voting.id)
  }

  if (filteredVotings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">Голосования не найдены</p>
        <p className="text-gray-400 text-sm mt-2">Создайте первое голосование для начала работы</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Адрес
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Форма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Даты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Кв-р
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Прогресс
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVotings.map((voting, index) => (
              <Fragment key={voting.id}>
                <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Expand/Collapse */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRow(voting.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Раскрыть детали квартир"
                    >
                      {isExpanded(voting.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {voting.address}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing(voting.id, 'status') ? (
                      <select
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleStatusChange(voting, tempValue as string)}
                        onKeyDown={(e) => handleKeyDown(e, voting.id, 'status')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PREPARATION">Подготовка</option>
                        <option value="ACTIVE">Активно</option>
                        <option value="COMPLETED">Завершено</option>
                        <option value="FAILED">Неуспешно</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => handleCellClick(voting.id, 'status', voting.status)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(voting.status)} hover:opacity-80 cursor-pointer`}
                      >
                        {getStatusText(voting.status)}
                      </button>
                    )}
                  </td>

                  {/* Voting Form */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing(voting.id, 'votingForm') ? (
                      <select
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(voting.id, 'votingForm')}
                        onKeyDown={(e) => handleKeyDown(e, voting.id, 'votingForm')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MEETING">Собрание</option>
                        <option value="ABSENTEE">Заочное</option>
                        <option value="MIXED">Смешанное</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => handleCellClick(voting.id, 'votingForm', voting.votingForm || '')}
                        className="text-sm text-gray-900 hover:text-blue-600"
                      >
                        {voting.votingForm === 'MEETING' && 'Собрание'}
                        {voting.votingForm === 'ABSENTEE' && 'Заочное'}
                        {voting.votingForm === 'MIXED' && 'Смешанное'}
                        {!voting.votingForm && '—'}
                      </button>
                    )}
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {/* Start Date */}
                      <div className="flex items-center text-xs">
                        {isEditing(voting.id, 'votingStartDate') ? (
                          <input
                            type="date"
                            value={formatDateForInput(tempValue as string)}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => handleCellSave(voting.id, 'votingStartDate')}
                            onKeyDown={(e) => handleKeyDown(e, voting.id, 'votingStartDate')}
                            autoFocus
                            className="w-full px-2 py-1 border border-blue-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <button
                            onClick={() => handleCellClick(voting.id, 'votingStartDate', voting.votingStartDate || '')}
                            className="flex items-center text-gray-600 hover:text-blue-600"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Начало: {formatDate(voting.votingStartDate)}</span>
                          </button>
                        )}
                      </div>
                      
                      {/* End Date */}
                      <div className="flex items-center text-xs">
                        {isEditing(voting.id, 'votingEndDate') ? (
                          <input
                            type="date"
                            value={formatDateForInput(tempValue as string)}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => handleCellSave(voting.id, 'votingEndDate')}
                            onKeyDown={(e) => handleKeyDown(e, voting.id, 'votingEndDate')}
                            autoFocus
                            className="w-full px-2 py-1 border border-blue-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <button
                            onClick={() => handleCellClick(voting.id, 'votingEndDate', voting.votingEndDate || '')}
                            className="flex items-center text-gray-600 hover:text-blue-600"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Конец: {formatDate(voting.votingEndDate)}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Apartments Count */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleApartmentsCountClick(voting)}
                      className="text-sm text-gray-900 hover:text-blue-600 font-medium"
                    >
                      {voting.apartments?.length || 0}
                      {voting.apartmentsCount && voting.apartmentsCount !== voting.apartments?.length && (
                        <span className="text-gray-500 ml-1">/ {voting.apartmentsCount}</span>
                      )}
                    </button>
                  </td>

                  {/* Progress */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              voting.votesPercent >= 100 ? 'bg-green-500' :
                              voting.votesPercent >= 75 ? 'bg-blue-500' :
                              voting.votesPercent >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(voting.votesPercent, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[45px]">
                          {voting.votesPercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {voting.currentVotes.toFixed(1)} м² / {voting.requiredVotes?.toFixed(1) || 0} м²
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      {/* Quick Status Change */}
                      {getNextStatus(voting.status) && (
                        <button
                          onClick={() => {
                            const nextStatus = getNextStatus(voting.status)
                            if (nextStatus) {
                              handleStatusChange(voting, nextStatus)
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title={`Перевести в статус "${getStatusText(getNextStatus(voting.status) || '')}"`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm(`Удалить голосование для ${voting.address}?`)) {
                            onDelete(voting.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Удалить голосование"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row - Apartments Sub-Table */}
                {isExpanded(voting.id) && (
                  <tr>
                    <td colSpan={8} className="px-0 py-0 bg-gray-50">
                      <ApartmentSubTable votingId={voting.id} voting={voting} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

