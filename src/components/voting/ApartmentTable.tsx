'use client'

import { useState } from 'react'
import { Plus, Trash2, Download, Upload } from 'lucide-react'
import { Voting, Apartment } from './types'
import { useInlineEdit } from './hooks'
import { getVoteStatusColor, getVoteStatusText } from './utils'
import { useVotingsStore } from '@/stores'
import { calculateVotingProgress } from './utils'
import { useNotification } from '@/components/NotificationService'
import * as XLSX from 'xlsx'

interface ApartmentSubTableProps {
  votingId: string
  voting: Voting
}

export function ApartmentSubTable({ votingId, voting }: ApartmentSubTableProps) {
  // Zustand store
  const updateVoting = useVotingsStore((state) => state.updateVoting)
  
  const { showNotification, showConfirm } = useNotification()
  const { editingCell, tempValue, setTempValue, startEdit, cancelEdit, isEditing } = useInlineEdit()

  const apartments = voting.apartments || []

  const handleCellClick = (apartmentId: string, field: string, currentValue: any) => {
    startEdit(apartmentId, field, currentValue)
  }

  const handleCellSave = (apartmentId: string, field: string) => {
    if (voting.apartments) {
      const updatedApartments = voting.apartments.map(apt => {
        if (apt.id === apartmentId) {
          let value = tempValue
          if (field === 'area') {
            value = parseFloat(tempValue as string) || 0
          }
          return { ...apt, [field]: value }
        }
        return apt
      })

      const progress = calculateVotingProgress(updatedApartments)

      updateVoting(votingId, {
        apartments: updatedApartments,
        currentVotes: progress.currentVotes,
        requiredVotes: progress.requiredVotes,
        votesPercent: progress.votesPercent
      })
    }
    cancelEdit()
  }

  const handleKeyDown = (e: React.KeyboardEvent, apartmentId: string, field: string) => {
    if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') {
      handleCellSave(apartmentId, field)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const handleDeleteApartment = async (apartmentId: string) => {
    const confirmed = await showConfirm('Удалить квартиру?')
    if (!confirmed) return

    const updatedApartments = (voting.apartments || []).filter(apt => apt.id !== apartmentId)
    const progress = calculateVotingProgress(updatedApartments)

    updateVoting(votingId, {
      apartments: updatedApartments,
      apartmentsCount: updatedApartments.length,
      currentVotes: progress.currentVotes,
      requiredVotes: progress.requiredVotes,
      votesPercent: progress.votesPercent
    })
    
    showNotification('Квартира удалена', 'success')
  }

  const handleAddApartment = () => {
    const newApartment: Apartment = {
      id: `apt-${votingId}-${Date.now()}`,
      number: (apartments.length + 1).toString(),
      ownerName: '',
      area: 0,
      phone: '',
      email: '',
      notes: '',
      voteStatus: 'NOT_VOTED'
    }

    const updatedApartments = [...(voting.apartments || []), newApartment]
    const progress = calculateVotingProgress(updatedApartments)

    updateVoting(votingId, {
      apartments: updatedApartments,
      apartmentsCount: updatedApartments.length,
      currentVotes: progress.currentVotes,
      requiredVotes: progress.requiredVotes,
      votesPercent: progress.votesPercent
    })
    
    showNotification('Квартира добавлена', 'success')
  }

  const handleBulkCreate = async () => {
    const count = voting.apartmentsCount || 10
    const confirmed = await showConfirm(`Создать ${count} квартир автоматически?`)
    if (!confirmed) return

    const newApartments: Apartment[] = []
    for (let i = 1; i <= count; i++) {
      newApartments.push({
        id: `apt-${votingId}-${i}-${Date.now()}`,
        number: i.toString(),
        ownerName: '',
        area: 0,
        phone: '',
        email: '',
        notes: '',
        voteStatus: 'NOT_VOTED'
      })
    }

    const progress = calculateVotingProgress(newApartments)

    updateVoting(votingId, {
      apartments: newApartments,
      apartmentsCount: count,
      currentVotes: progress.currentVotes,
      requiredVotes: progress.requiredVotes,
      votesPercent: progress.votesPercent
    })
    
    showNotification(`Создано ${count} квартир`, 'success')
  }

  const handleDownloadTemplate = () => {
    const template = [
      {
        'Номер квартиры': '1',
        'ФИО собственника': 'Иванов Иван Иванович',
        'Площадь (м²)': '45.5',
        'Телефон': '+7 (999) 123-45-67',
        'Email': 'ivanov@example.com',
        'Примечания': 'Пример квартиры'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(template)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Квартиры')
    XLSX.writeFile(workbook, `Шаблон_квартир_${votingId}.xlsx`)
    showNotification('Шаблон скачан', 'success')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result
        const workbook = XLSX.read(binaryStr, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)

        const newApartments: Apartment[] = data.map((row: any, index: number) => ({
          id: `apt-${votingId}-import-${Date.now()}-${index}`,
          number: String(row['Номер квартиры'] || (index + 1)),
          ownerName: String(row['ФИО собственника'] || ''),
          area: parseFloat(row['Площадь (м²)']) || 0,
          phone: String(row['Телефон'] || ''),
          email: String(row['Email'] || ''),
          notes: String(row['Примечания'] || ''),
          voteStatus: 'NOT_VOTED'
        }))

        const progress = calculateVotingProgress(newApartments)

        updateVoting(votingId, {
          apartments: newApartments,
          apartmentsCount: newApartments.length,
          currentVotes: progress.currentVotes,
          requiredVotes: progress.requiredVotes,
          votesPercent: progress.votesPercent
        })
        
        showNotification(`Загружено ${newApartments.length} квартир из Excel`, 'success')
      } catch (error) {
        showNotification('Ошибка при загрузке файла', 'error')
      }
    }
    reader.readAsBinaryString(file)
    e.target.value = ''
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Квартиры в голосовании</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
          >
            <Download className="h-4 w-4 mr-1" />
            Скачать шаблон
          </button>
          <label className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 cursor-pointer">
            <Upload className="h-4 w-4 mr-1" />
            Загрузить из Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleAddApartment}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Добавить квартиру
          </button>
        </div>
      </div>

      {apartments.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ФИО собственника</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Площадь (м²)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Примечания</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apartments.map((apartment, index) => (
                <tr key={apartment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Number */}
                  <td className="px-4 py-3">
                    {isEditing(apartment.id, 'number') ? (
                      <input
                        type="text"
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'number')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'number')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(apartment.id, 'number', apartment.number)}
                        className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {apartment.number}
                      </div>
                    )}
                  </td>

                  {/* Owner Name */}
                  <td className="px-4 py-3">
                    {isEditing(apartment.id, 'ownerName') ? (
                      <input
                        type="text"
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'ownerName')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'ownerName')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(apartment.id, 'ownerName', apartment.ownerName)}
                        className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {apartment.ownerName || '-'}
                      </div>
                    )}
                  </td>

                  {/* Area */}
                  <td className="px-4 py-3">
                    {isEditing(apartment.id, 'area') ? (
                      <input
                        type="number"
                        step="0.1"
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'area')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'area')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(apartment.id, 'area', apartment.area)}
                        className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {apartment.area > 0 ? apartment.area : '-'}
                      </div>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3">
                    {isEditing(apartment.id, 'phone') ? (
                      <input
                        type="tel"
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'phone')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'phone')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(apartment.id, 'phone', apartment.phone)}
                        className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {apartment.phone || '-'}
                      </div>
                    )}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">
                    {isEditing(apartment.id, 'email') ? (
                      <input
                        type="email"
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'email')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'email')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(apartment.id, 'email', apartment.email)}
                        className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {apartment.email || '-'}
                      </div>
                    )}
                  </td>

                  {/* Vote Status */}
                  <td className="px-4 py-3">
                    {isEditing(apartment.id, 'voteStatus') ? (
                      <select
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'voteStatus')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'voteStatus')}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="NOT_VOTED">Не голосовал</option>
                        <option value="FOR">За</option>
                        <option value="AGAINST">Против</option>
                        <option value="ABSTAINED">Воздержался</option>
                        <option value="NO_CONTACT">Не дозвон</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => handleCellClick(apartment.id, 'voteStatus', apartment.voteStatus)}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 ${getVoteStatusColor(apartment.voteStatus)}`}
                      >
                        {getVoteStatusText(apartment.voteStatus)}
                      </span>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-3 max-w-xs">
                    {isEditing(apartment.id, 'notes') ? (
                      <textarea
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => handleCellSave(apartment.id, 'notes')}
                        onKeyDown={(e) => handleKeyDown(e, apartment.id, 'notes')}
                        autoFocus
                        rows={2}
                        className="w-full px-2 py-1 border border-blue-500 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(apartment.id, 'notes', apartment.notes)}
                        className="text-sm text-gray-600 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded truncate"
                        title={apartment.notes}
                      >
                        {apartment.notes || '-'}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-sm font-medium">
                    <button
                      onClick={() => handleDeleteApartment(apartment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Квартиры не добавлены</p>
          <button
            onClick={handleBulkCreate}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            {voting.apartmentsCount && voting.apartmentsCount > 0
              ? `Создать ${voting.apartmentsCount} квартир`
              : 'Добавить квартиру'}
          </button>
        </div>
      )}
    </div>
  )
}

