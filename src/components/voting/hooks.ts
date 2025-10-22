// Кастомные хуки для модуля голосований

import { useState, useCallback, useMemo } from 'react'
import { Voting, Apartment } from './types'
import { calculateVotingProgress } from './utils'

/**
 * Хук для управления редактированием ячеек таблицы
 */
export function useInlineEdit<T = string>() {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [tempValue, setTempValue] = useState<T | ''>('')

  const startEdit = useCallback((id: string, field: string, currentValue: T) => {
    setEditingCell({ id, field })
    setTempValue(currentValue ?? '')
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingCell(null)
    setTempValue('')
  }, [])

  const isEditing = useCallback(
    (id: string, field: string) => {
      return editingCell?.id === id && editingCell?.field === field
    },
    [editingCell]
  )

  return {
    editingCell,
    tempValue,
    setTempValue,
    startEdit,
    cancelEdit,
    isEditing
  }
}

/**
 * Хук для управления раскрытием строк таблицы
 */
export function useExpandableRows() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = useCallback((id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const expandRow = useCallback((id: string) => {
    setExpandedRows(prev => new Set(prev).add(id))
  }, [])

  const collapseRow = useCallback((id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  const isExpanded = useCallback(
    (id: string) => expandedRows.has(id),
    [expandedRows]
  )

  return {
    expandedRows,
    toggleRow,
    expandRow,
    collapseRow,
    isExpanded
  }
}

/**
 * Хук для фильтрации и сортировки голосований
 */
export function useVotingFilters(votings: Voting[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'address'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredVotings = useMemo(() => {
    let filtered = [...votings]

    // Фильтр по поиску
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        v =>
          v.address.toLowerCase().includes(term) ||
          v.votingForm?.toLowerCase().includes(term)
      )
    }

    // Фильтр по статусу
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(v => v.status === statusFilter)
    }

    // Сортировка
    filtered.sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.votingStartDate || 0).getTime() - new Date(b.votingStartDate || 0).getTime()
          break
        case 'progress':
          compareValue = a.votesPercent - b.votesPercent
          break
        case 'address':
          compareValue = a.address.localeCompare(b.address)
          break
      }

      return sortOrder === 'asc' ? compareValue : -compareValue
    })

    return filtered
  }, [votings, searchTerm, statusFilter, sortBy, sortOrder])

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredVotings
  }
}

/**
 * Хук для управления квартирами в голосовании
 */
export function useApartmentManagement(
  votingId: string,
  votings: Voting[],
  setVotings: React.Dispatch<React.SetStateAction<Voting[]>>,
  onNotification?: (message: string) => void
) {
  const updateApartment = useCallback(
    (apartmentId: string, field: string, value: any) => {
      setVotings(prev =>
        prev.map(voting => {
          if (voting.id === votingId && voting.apartments) {
            const updatedApartments = voting.apartments.map(apt => {
              if (apt.id === apartmentId) {
                let processedValue = value
                if (field === 'area') {
                  processedValue = parseFloat(value) || 0
                }
                return { ...apt, [field]: processedValue }
              }
              return apt
            })

            const progress = calculateVotingProgress(updatedApartments)

            return {
              ...voting,
              apartments: updatedApartments,
              currentVotes: progress.currentVotes,
              requiredVotes: progress.requiredVotes,
              votesPercent: progress.votesPercent
            }
          }
          return voting
        })
      )
    },
    [votingId, setVotings]
  )

  const deleteApartment = useCallback(
    (apartmentId: string) => {
      setVotings(prev =>
        prev.map(voting => {
          if (voting.id === votingId) {
            const updatedApartments = (voting.apartments || []).filter(apt => apt.id !== apartmentId)
            const progress = calculateVotingProgress(updatedApartments)

            return {
              ...voting,
              apartments: updatedApartments,
              apartmentsCount: updatedApartments.length,
              currentVotes: progress.currentVotes,
              requiredVotes: progress.requiredVotes,
              votesPercent: progress.votesPercent
            }
          }
          return voting
        })
      )
      onNotification?.('Квартира удалена')
    },
    [votingId, setVotings, onNotification]
  )

  const addApartment = useCallback(
    (apartment: Apartment) => {
      setVotings(prev =>
        prev.map(voting => {
          if (voting.id === votingId) {
            const updatedApartments = [...(voting.apartments || []), apartment]
            const progress = calculateVotingProgress(updatedApartments)

            return {
              ...voting,
              apartments: updatedApartments,
              apartmentsCount: updatedApartments.length,
              currentVotes: progress.currentVotes,
              requiredVotes: progress.requiredVotes,
              votesPercent: progress.votesPercent
            }
          }
          return voting
        })
      )
      onNotification?.('Квартира добавлена')
    },
    [votingId, setVotings, onNotification]
  )

  const bulkCreateApartments = useCallback(
    (count: number) => {
      const apartments: Apartment[] = []
      for (let i = 1; i <= count; i++) {
        apartments.push({
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

      setVotings(prev =>
        prev.map(voting => {
          if (voting.id === votingId) {
            const progress = calculateVotingProgress(apartments)

            return {
              ...voting,
              apartments,
              apartmentsCount: count,
              currentVotes: progress.currentVotes,
              requiredVotes: progress.requiredVotes,
              votesPercent: progress.votesPercent
            }
          }
          return voting
        })
      )
      onNotification?.(`Создано ${count} квартир`)
    },
    [votingId, setVotings, onNotification]
  )

  return {
    updateApartment,
    deleteApartment,
    addApartment,
    bulkCreateApartments
  }
}

