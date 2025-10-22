'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { useVotingsStore, useLeadsStore } from '@/stores'
import { Voting, Lead, VotingFormData } from './types'
import { VotingStats } from './VotingStats'
import { VotingTable } from './VotingTable'
import { LeadSelectionModal } from './LeadSelectionModal'
import { VotingForm } from './VotingForm'
import { calculateVotingProgress } from './utils'
import { useNotification } from '@/components/NotificationService'
import { autoCreateTasksForVoting, sendTelegramNotificationForVoting } from '@/utils/taskAutoCreation'
import { Spinner } from '@/components/LoadingStates'

export default function VotingManager() {
  // Zustand stores
  const votings = useVotingsStore((state) => state.votings)
  const addVoting = useVotingsStore((state) => state.addVoting)
  const updateVoting = useVotingsStore((state) => state.updateVoting)
  const deleteVoting = useVotingsStore((state) => state.deleteVoting)
  const isVotingsInitialized = useVotingsStore((state) => state.isInitialized)
  
  const leads = useLeadsStore((state) => state.leads)
  const isLeadsInitialized = useLeadsStore((state) => state.isInitialized)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreating, setIsCreating] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showVotingForm, setShowVotingForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  const { showNotification, showConfirm } = useNotification()

  useEffect(() => {
    if (isVotingsInitialized) {
      setLoading(false)
    }
  }, [isVotingsInitialized])

  const handleStartNewVoting = useCallback(() => {
    setShowLeadModal(true)
  }, [])

  const handleLeadSelect = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setShowLeadModal(false)
    setShowVotingForm(true)
  }, [])

  const handleVotingFormSubmit = useCallback(
    (formData: VotingFormData) => {
      if (!selectedLead) return

      setIsCreating(true)

      // Симуляция задержки создания
      setTimeout(() => {
        const newVoting: Voting = {
          id: `voting-${Date.now()}`,
          leadId: selectedLead.id,
          address: `${selectedLead.address}, ${selectedLead.city}`,
          votingForm: formData.votingForm,
          votingStartDate: new Date(formData.votingStartDate).toISOString(),
          votingEndDate: new Date(formData.votingEndDate).toISOString(),
          requiredVotes: formData.requiredVotes,
          currentVotes: 0,
          votesPercent: 0,
          status: 'PREPARATION' as const,
          apartmentsCount: selectedLead.apartmentsCount || undefined
        }

        addVoting(newVoting)

        // Автоматически создаем задачи для голосования
        autoCreateTasksForVoting(newVoting.id, newVoting.address)

        // Отправляем Telegram уведомление о создании голосования
        sendTelegramNotificationForVoting(
          newVoting.id,
          newVoting.address,
          formData.votingStartDate,
          formData.votingEndDate
        )

        showNotification(
          `✅ Новое голосование создано для ${selectedLead.address}! Задачи созданы, уведомления отправлены.`,
          'success'
        )
        
        setIsCreating(false)
        setShowVotingForm(false)
        setSelectedLead(null)
      }, 1000)
    },
    [selectedLead, addVoting, showNotification]
  )

  const handleVotingUpdate = useCallback(
    (votingId: string, field: string, value: any) => {
      updateVoting(votingId, { [field]: value })
      showNotification('Голосование обновлено', 'success')
    },
    [updateVoting, showNotification]
  )

  const handleVotingDelete = useCallback(
    async (votingId: string) => {
      const confirmed = await showConfirm('Вы уверены, что хотите удалить это голосование?')
      if (!confirmed) return

      deleteVoting(votingId)
      showNotification('Голосование удалено', 'success')
    },
    [deleteVoting, showNotification, showConfirm]
  )

  const handleStatusChange = useCallback(
    (votingId: string, newStatus: string) => {
      updateVoting(votingId, { status: newStatus })
      showNotification(`Статус изменен на "${newStatus}"`, 'success')
    },
    [updateVoting, showNotification]
  )

  const handleClearAll = useCallback(async () => {
    const confirmed = await showConfirm('Вы уверены, что хотите удалить все голосования?')
    if (!confirmed) return

    // Удаляем все голосования по одному
    votings.forEach(voting => deleteVoting(voting.id))
    showNotification('Все голосования удалены', 'success')
  }, [votings, deleteVoting, showNotification, showConfirm])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-2 mt-4 text-gray-600">Загрузка данных голосований...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Управление голосованиями
            </h2>
            <p className="text-gray-600">
              Организация и мониторинг процессов голосования для строительных проектов
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStartNewVoting}
              disabled={isCreating}
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isCreating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isCreating ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Создание...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать новое голосование
                </>
              )}
            </button>
            {votings.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                Очистить все
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <VotingStats votings={votings} />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Все голосования
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Активные голосования ({votings.filter((v) => v.status === 'ACTIVE').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Завершенные
            </button>
          </nav>
        </div>
      </div>

      {/* Voting Table */}
      <VotingTable
        votings={votings}
        activeTab={activeTab}
        onUpdate={handleVotingUpdate}
        onDelete={handleVotingDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Lead Selection Modal */}
      {showLeadModal && (
        <LeadSelectionModal
          leads={leads}
          isLoading={!isLeadsInitialized}
          onSelect={handleLeadSelect}
          onClose={() => setShowLeadModal(false)}
        />
      )}

      {/* Voting Form Modal */}
      {showVotingForm && selectedLead && (
        <VotingForm
          lead={selectedLead}
          onSubmit={handleVotingFormSubmit}
          onCancel={() => {
            setShowVotingForm(false)
            setSelectedLead(null)
          }}
          isSubmitting={isCreating}
        />
      )}
    </div>
  )
}

