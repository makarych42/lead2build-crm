'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Eye, Edit, Trash2, MapPin, Phone, Mail, Calendar, X, AlertCircle, Grid, List, GripVertical } from 'lucide-react'
import { useLeadsStore } from '@/stores'
import { VirtualizedLeadsList } from './leads/VirtualizedLeadsList'
import { VirtualizedLeadsGrid } from './leads/VirtualizedLeadsGrid'
import { useNotification } from './NotificationService'
import { LeadsGridSkeleton, LeadsListSkeleton } from './skeletons'
import type { Lead, LeadStatus } from '@/types'

interface EditLeadModalProps {
  lead: Lead
  onSave: (data: Partial<Lead>) => void
  onClose: () => void
}

function EditLeadModal({ lead, onSave, onClose }: EditLeadModalProps) {
  const [formData, setFormData] = useState({
    address: lead.address,
    city: lead.city || '',
    contactPerson: lead.contactPerson,
    contactPhone: lead.contactPhone,
    contactEmail: lead.contactEmail || '',
    source: lead.source,
    status: lead.status
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Редактирование лида</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Адрес *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Город *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Контактное лицо *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Источник *</label>
              <select
                required
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="ОЗ">ОЗ</option>
                <option value="Сарафанная радио">Сарафанная радио</option>
                <option value="Фронты">Фронты</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="NEW">Новый</option>
                <option value="IN_PROGRESS">В процессе</option>
                <option value="VOTING">Голосование</option>
                <option value="COMPLETED">Завершён</option>
                <option value="REJECTED">Отклонён</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end p-6 border-t bg-gray-50 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface LeadsListProps {
  refreshTrigger?: number
}

export default function LeadsList({ refreshTrigger }: LeadsListProps = {}) {
  // Zustand store
  const leads = useLeadsStore((state) => state.leads)
  const updateLead = useLeadsStore((state) => state.updateLead)
  const deleteLead = useLeadsStore((state) => state.deleteLead)
  const isInitialized = useLeadsStore((state) => state.isInitialized)
  
  // Notifications
  const { success, error: showError } = useNotification()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban')
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  useEffect(() => {
    // Просто отмечаем, что загрузка завершена, так как данные берутся из Zustand store
    if (isInitialized) {
      setLoading(false)
    }
  }, [isInitialized])

  // Обновляем данные при изменении refreshTrigger
  useEffect(() => {
    // Ничего не делаем, данные автоматически обновляются через Zustand store
  }, [refreshTrigger])

  // Функция fetchLeads больше не нужна, так как данные хранятся в localStorage

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setShowViewModal(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setShowEditModal(true)
  }

  const handleUpdateLead = async (updatedData: Partial<Lead>) => {
    try {
      if (!selectedLead) return
      
      // Обновляем лид в Zustand store
      updateLead(selectedLead.id, updatedData)
      
      success('Лид успешно обновлён')
      setShowEditModal(false)
      setSelectedLead(null)
    } catch (err) {
      console.error('Error updating lead:', err)
      showError('Ошибка при обновлении лида')
    }
  }

  const handleDeleteLead = async (lead: Lead) => {
    try {
      // Удаляем из Zustand store
      deleteLead(lead.id)
      success('Лид успешно удален')
    } catch (err) {
      console.error('Error deleting lead:', err)
      showError('Ошибка при удалении лида')
    }
    setShowDeleteConfirm(false)
    setSelectedLead(null)
  }

  const confirmDelete = (lead: Lead) => {
    setSelectedLead(lead)
    setShowDeleteConfirm(true)
  }

  // Функции для drag and drop
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault()
    
    if (draggedLead && draggedLead.status !== newStatus) {
      // Обновляем статус в Zustand store
      updateLead(draggedLead.id, { status: newStatus })
    }
    
    setDraggedLead(null)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
  }

  // Определение столбцов канбан доски
  const kanbanColumns = [
    {
      id: 'NEW',
      title: 'Новые',
      color: 'bg-blue-100 border-blue-200',
      headerColor: 'bg-blue-50 text-blue-800'
    },
    {
      id: 'IN_PROGRESS',
      title: 'В процессе',
      color: 'bg-yellow-100 border-yellow-200',
      headerColor: 'bg-yellow-50 text-yellow-800'
    },
    {
      id: 'VOTING',
      title: 'Голосование',
      color: 'bg-purple-100 border-purple-200',
      headerColor: 'bg-purple-50 text-purple-800'
    },
    {
      id: 'COMPLETED',
      title: 'Завершенные',
      color: 'bg-green-100 border-green-200',
      headerColor: 'bg-green-50 text-green-800'
    },
    {
      id: 'REJECTED',
      title: 'Отклоненные',
      color: 'bg-red-100 border-red-200',
      headerColor: 'bg-red-50 text-red-800'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'VOTING':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'Новый'
      case 'IN_PROGRESS':
        return 'В процессе'
      case 'VOTING':
        return 'Голосование'
      case 'COMPLETED':
        return 'Завершен'
      case 'REJECTED':
        return 'Отклонен'
      default:
        return status
    }
  }

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'INITIAL_CONSULTATION':
        return 'Первичная консультация'
      case 'DOCUMENT_PREPARATION':
        return 'Подготовка документов'
      case 'INSPECTION':
        return 'Обследование'
      case 'VOTING_PREPARATION':
        return 'Подготовка к голосованию'
      case 'VOTING_PROCESS':
        return 'Процесс голосования'
      case 'TKO_SUBMISSION':
        return 'Подача в ТКО'
      case 'CONSTRUCTION_READY':
        return 'Готов к строительству'
      default:
        return stage
    }
  }

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [leads, searchTerm, statusFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Загружаем данные...</span>
      </div>
    )
  }

  // Показываем загрузку пока localStorage не инициализирован
  if (!isInitialized) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Content skeleton based on view mode */}
        {viewMode === 'list' ? (
          <LeadsListSkeleton count={10} />
        ) : (
          <LeadsGridSkeleton count={6} />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Управление лидами</h2>
        <p className="text-gray-600">Отслеживание и управление заявками на строительство</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по адресу, городу или контактному лицу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="ALL">Все статусы</option>
                <option value="NEW">Новые</option>
                <option value="IN_PROGRESS">В процессе</option>
                <option value="VOTING">Голосование</option>
                <option value="COMPLETED">Завершенные</option>
                <option value="REJECTED">Отклоненные</option>
              </select>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
                Список
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
                Канбан
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Отображение в зависимости от режима */}
      {viewMode === 'list' ? (
        // Виртуализированный список (Grid)
        <VirtualizedLeadsGrid
          leads={filteredLeads}
          onView={handleViewLead}
          onEdit={handleEditLead}
          onDelete={confirmDelete}
        />
      ) : (
        // Канбан доска
        <div className="flex gap-6 overflow-x-auto pb-4">
          {kanbanColumns.map((column) => {
            const columnLeads = leads.filter(lead => {
              const matchesSearch = lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
              const matchesStatus = lead.status === column.id
              const matchesFilter = statusFilter === 'ALL' || statusFilter === column.id
              return matchesSearch && matchesStatus && matchesFilter
            })
            
            return (
              <div 
                key={column.id}
                className={`flex-shrink-0 w-80 ${column.color} rounded-lg border-2 border-dashed`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`${column.headerColor} px-4 py-3 rounded-t-lg border-b`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <span className="text-xs font-medium bg-white bg-opacity-50 px-2 py-1 rounded-full">
                      {columnLeads.length}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 min-h-[500px]">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-lg shadow p-4 cursor-move hover:shadow-md transition-shadow ${
                        draggedLead?.id === lead.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {getStatusText(lead.status)}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewLead(lead)}
                            className="p-1 text-gray-400 hover:text-blue-500"
                            title="Просмотр"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleEditLead(lead)}
                            className="p-1 text-gray-400 hover:text-green-500"
                            title="Редактировать"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(lead)}
                            className="p-1 text-gray-400 hover:text-red-500"
                            title="Удалить"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center mb-2">
                        <MapPin className="h-3 w-3 text-gray-400 mr-2" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{lead.address}</h4>
                          <p className="text-xs text-gray-500 truncate">{lead.city}</p>
                        </div>
                      </div>

                      <div className="space-y-1 mb-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2" />
                          <span className="truncate">{lead.contactPhone}</span>
                        </div>
                        {lead.contactEmail && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2" />
                            <span className="truncate">{lead.contactEmail}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                      </div>

                      <div className="border-t pt-2">
                        <p className="text-xs text-gray-500 truncate">Источник: {lead.source}</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">{getStageText(lead.currentStage)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {columnLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Перетащите лиды сюда</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Лиды не найдены</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первый лид, чтобы начать работу'}
          </p>
        </div>
      )}

      {/* Модальное окно просмотра */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Просмотр лида</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Адрес</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Город</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.city || 'Не указан'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Контактное лицо</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.contactPerson}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Телефон</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.contactPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.contactEmail || 'Не указан'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Источник</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.source}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Статус</label>
                  <p className="mt-1 text-sm text-gray-900">{getStatusText(selectedLead.status)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Текущий этап</label>
                  <p className="mt-1 text-sm text-gray-900">{getStageText(selectedLead.currentStage)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Дата создания</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {showEditModal && selectedLead && (
        <EditLeadModal 
          lead={selectedLead}
          onSave={handleUpdateLead}
          onClose={() => {
            setShowEditModal(false)
            setSelectedLead(null)
          }}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Подтвердите удаление</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Вы уверены, что хотите удалить лид по адресу <strong>{selectedLead.address}</strong>? Это действие нельзя отменить.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setSelectedLead(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDeleteLead(selectedLead)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}