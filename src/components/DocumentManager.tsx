'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { File, FileText, Upload, Check, AlertCircle, X, Download, Eye, Trash2, Building, User, Phone, Mail, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useDocumentsStore, useLeadsStore } from '@/stores'
import { useNotification } from './NotificationService'
import type { Lead } from '@/types'

interface LeadLocal {
  id: string
  address: string
  city: string
  contactPerson: string
  contactPhone: string
  contactEmail: string | null | undefined
  source: string
  status: 'NEW' | 'IN_PROGRESS' | 'VOTING' | 'COMPLETED' | 'REJECTED'
  currentStage: string
  createdAt: string
  buildingType: any
  floorsCount: number
  apartmentsCount: number
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: 'pending' | 'verified' | 'rejected'
  leadId: string
  category: string
  fileData?: string
}

export default function DocumentManager() {
  // Zustand stores
  const documents = useDocumentsStore((state) => state.documents)
  const addDocument = useDocumentsStore((state) => state.addDocument)
  const updateDocument = useDocumentsStore((state) => state.updateDocument)
  const deleteDocument = useDocumentsStore((state) => state.deleteDocument)
  const isInitialized = useDocumentsStore((state) => state.isInitialized)
  
  const leads = useLeadsStore((state) => state.leads)
  
  // Notifications
  const { success, error: showError } = useNotification()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [viewingLead, setViewingLead] = useState<Lead | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [leadsPerPage] = useState(12) // Показываем 12 лидов на страницу
  const [searchTerm, setSearchTerm] = useState('')
  const [updateKey, setUpdateKey] = useState(0) // Для принудительного обновления

  const documentTypes = [
    { id: 'complex_proposal', name: 'Комплексное предложение', required: true },
    { id: 'owners_registry', name: 'Реестр собственников', required: true },
    { id: 'kt_scheme', name: 'KT-схема размещения', required: true },
    { id: 'voting_docs', name: 'Документы голосования', required: true },
    { id: 'tko_docs', name: 'Документы для ТКО', required: true }
  ]

  // Получение лидов доступных для работы с документами (исключаем NEW и REJECTED)
  const availableLeads = leads.filter(lead => 
    lead.status !== 'NEW' && lead.status !== 'REJECTED'
  )

  // Фильтрация лидов по выбранному статусу и поиску
  const filteredLeads = useMemo(() => {
    let filtered = statusFilter === 'ALL' 
      ? availableLeads 
      : availableLeads.filter(lead => lead.status === statusFilter)
    
    // Применяем поиск по адресу, городу и контактному лицу
    if (searchTerm) {
      filtered = filtered.filter(lead => {
        const matchesAddress = lead.address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCity = lead.city.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesContact = lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPhone = lead.contactPhone.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesAddress || matchesCity || matchesContact || matchesPhone
      })
    }
    
    return filtered
  }, [availableLeads, statusFilter, searchTerm])

  // Пагинация
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage)
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * leadsPerPage
    const endIndex = startIndex + leadsPerPage
    return filteredLeads.slice(startIndex, endIndex)
  }, [filteredLeads, currentPage, leadsPerPage])

  // Автоматический выбор первого лида
  useEffect(() => {
    if (paginatedLeads.length > 0 && (!selectedLeadId || !paginatedLeads.find(lead => lead.id === selectedLeadId))) {
      setSelectedLeadId(paginatedLeads[0].id)
    } else if (paginatedLeads.length === 0) {
      setSelectedLeadId(null)
    }
  }, [paginatedLeads, selectedLeadId])

  // Сброс страницы при смене фильтра или поиска
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchTerm])

  const selectedLead = paginatedLeads.find(lead => lead.id === selectedLeadId)

  // Обработчик загрузки файла
  const handleFileUpload = async (file: File, category: string, leadId: string) => {
    try {
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)
          } else {
            reject(new Error('Ошибка чтения файла'))
          }
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })

      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'pending' as const,
        category,
        leadId,
        fileData
      }

      addDocument(newDocument)
      setShowUploadModal(false)
      setSelectedFile(null)
      setUploadingCategory(null)
      
      // Принудительно обновляем статистику
      setUpdateKey(prev => prev + 1)
      
      success('Файл успешно загружен!')
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
      showError('Произошла ошибка при загрузке файла.')
    }
  }

  const handleUploadClick = (category: string) => {
    if (!selectedLeadId) return
    setUploadingCategory(category)
    setShowUploadModal(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const confirmUpload = async () => {
    if (selectedFile && uploadingCategory && selectedLeadId) {
      await handleFileUpload(selectedFile, uploadingCategory, selectedLeadId)
    }
  }

  const handleDeleteDocument = (id: string) => {
    const confirmed = confirm('Вы уверены, что хотите удалить этот документ?')
    if (confirmed) {
      deleteDocument(id)
      success('Документ успешно удален!')
      
      // Принудительно обновляем статистику
      setUpdateKey(prev => prev + 1)
    }
  }

  const handleDownloadDocument = (doc: Document) => {
    try {
      if (doc.fileData) {
        const link = document.createElement('a')
        link.href = doc.fileData
        link.download = doc.name
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const content = `Документ: ${doc.name}\nКатегория: ${documentTypes.find(t => t.id === doc.category)?.name || doc.category}\nСтарый файл без сохраненного содержимого.`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${doc.name.replace(/\.[^/.]+$/, '')}_info.txt`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
      }
    } catch (error) {
      console.error('Ошибка при скачивании:', error)
      showError('Ошибка при скачивании файла')
    }
  }

  const handleStatusChange = (id: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    updateDocument(id, { status: newStatus })
    
    const statusLabels = {
      pending: 'На проверке',
      verified: 'Проверен',
      rejected: 'Отклонен'
    }
    success(`Статус документа изменен на "${statusLabels[newStatus]}"`)
    
    // Принудительно обновляем статистику
    setUpdateKey(prev => prev + 1)
  }

  const handleViewLead = (lead: Lead) => {
    setViewingLead(lead)
    setShowLeadModal(true)
  }

  const getDocumentsByCategory = (category: string, leadId: string) => {
    return documents.filter(doc => doc.category === category && doc.leadId === leadId)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getLeadStatistics = (leadId: string) => {
    const leadDocuments = documents.filter(doc => doc.leadId === leadId)
    const totalDocuments = leadDocuments.length
    const verifiedDocuments = leadDocuments.filter(doc => doc.status === 'verified').length
    const pendingDocuments = leadDocuments.filter(doc => doc.status === 'pending').length
    const completedTypes = documentTypes.filter(type => 
      getDocumentsByCategory(type.id, leadId).some(doc => doc.status === 'verified')
    ).length
    const completionPercentage = documentTypes.length > 0 ? Math.round((completedTypes / documentTypes.length) * 100) : 0
    
    return {
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      completedTypes,
      completionPercentage
    }
  }
  
  // Мемоизированная статистика с зависимостью от документов и updateKey
  const currentStats = useMemo(() => {
    return selectedLeadId ? getLeadStatistics(selectedLeadId) : null
  }, [selectedLeadId, documents, updateKey])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Инициализация...</div>
      </div>
    )
  }

  if (availableLeads.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Нет доступных лидов</h3>
        <p className="text-gray-500">Документы доступны для лидов в статусах: В процессе, Голосование, Завершено</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Управление документами</h2>
        <p className="text-gray-600">Управление документами лидов в статусе "В процессе"</p>
      </div>

      {/* Фильтрация и выбор лида */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <h3 className="text-lg font-medium text-gray-900">Выберите лид</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Фильтр по статусу:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL" className="text-gray-700">Все</option>
                <option value="IN_PROGRESS" className="text-gray-700">В процессе</option>
                <option value="VOTING" className="text-gray-700">Голосование</option>
                <option value="COMPLETED" className="text-gray-700">Завершено</option>
              </select>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по городу, адресу, контакту или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
        
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <>
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">По запросу "{searchTerm}" ничего не найдено</p>
                <p className="text-gray-400 text-sm mt-1">Попробуйте сменить поисковой запрос или фильтр</p>
              </>
            ) : (
              <p className="text-gray-500">Нет лидов с выбранным статусом</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedLeads.map((lead) => {
              const stats = getLeadStatistics(lead.id)
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
                  case 'VOTING': return 'bg-purple-100 text-purple-800'
                  case 'COMPLETED': return 'bg-green-100 text-green-800'
                  default: return 'bg-gray-100 text-gray-800'
                }
              }
              const getStatusText = (status: string) => {
                switch (status) {
                  case 'IN_PROGRESS': return 'В процессе'
                  case 'VOTING': return 'Голосование'
                  case 'COMPLETED': return 'Завершено'
                  default: return status
                }
              }
              return (
                <div 
                  key={lead.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedLeadId === lead.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-1 min-w-0">
                      <Building className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{lead.address}</h4>
                        <p className="text-sm text-gray-500 truncate">{lead.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusText(lead.status)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewLead(lead)
                        }}
                        className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                        title="Просмотр лида"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{lead.contactPerson}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{lead.contactPhone}</span>
                    </div>
                  </div>
                  
                  {/* Статистика документов */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-red-50 rounded p-2">
                        <div className="font-semibold text-red-600">{documentTypes.length - stats.completedTypes}</div>
                        <div className="text-red-500">Осталось</div>
                      </div>
                      <div className="bg-yellow-50 rounded p-2">
                        <div className="font-semibold text-yellow-600">{stats.pendingDocuments}</div>
                        <div className="text-yellow-500">Ожидают</div>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <div className="font-semibold text-green-600">{stats.verifiedDocuments}</div>
                        <div className="text-green-500">Проверено</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Прогресс:</span>
                      <span className="font-medium">{stats.completionPercentage}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${stats.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}            
          </div>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center text-sm text-gray-700">
                <span>Показано {((currentPage - 1) * leadsPerPage) + 1}-{Math.min(currentPage * leadsPerPage, filteredLeads.length)} из {filteredLeads.length} лидов</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
        )}
      </div>

      {selectedLead && currentStats && (
        <>
          {/* Прогресс выбранного лида */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedLead.address}</h3>
              <span className="text-sm text-gray-500">{currentStats.completedTypes} из {documentTypes.length} типов завершено</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${currentStats.completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{currentStats.completionPercentage}% завершено</p>
          </div>

          {/* Типы документов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documentTypes.map((docType) => {
              const categoryDocs = getDocumentsByCategory(docType.id, selectedLead.id)
              const hasVerifiedDoc = categoryDocs.some(doc => doc.status === 'verified')
              const borderColor = hasVerifiedDoc ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              
              return (
                <div key={docType.id} className={`bg-white rounded-lg shadow p-6 border-2 ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{docType.name}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          hasVerifiedDoc ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {hasVerifiedDoc ? 'Завершено' : 'Обязательно'}
                        </span>
                      </div>
                    </div>
                    {hasVerifiedDoc && <Check className="h-6 w-6 text-green-600" />}
                  </div>
                  
                  {categoryDocs.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {categoryDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center p-2 bg-gray-50 rounded border">
                          <div className="flex items-center flex-1 min-w-0 mr-2">
                            <File className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <select
                              value={doc.status}
                              onChange={(e) => handleStatusChange(doc.id, e.target.value as any)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                            >
                              <option value="pending" className="text-gray-900 bg-white">Ожидает</option>
                              <option value="verified" className="text-gray-900 bg-white">Проверен</option>
                              <option value="rejected" className="text-gray-900 bg-white">Отклонен</option>
                            </select>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-1 text-blue-400 hover:text-blue-600 flex-shrink-0"
                              title="Скачать"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1 text-red-400 hover:text-red-600 flex-shrink-0"
                              title="Удалить"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    onClick={() => handleUploadClick(docType.id)}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Кликните для загрузки</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX (Макс. 10МБ)</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Сводка */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Сводка по документам лида</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentStats.totalDocuments}</div>
                <div className="text-sm text-blue-800">Всего документов</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentStats.verifiedDocuments}</div>
                <div className="text-sm text-green-800">Проверено</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{currentStats.pendingDocuments}</div>
                <div className="text-sm text-yellow-800">Ожидает проверки</div>
              </div>
            </div>

            {currentStats.completedTypes < documentTypes.length && (
              <div className="flex items-center p-4 bg-yellow-100 border border-yellow-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">
                  {documentTypes.length - currentStats.completedTypes} обязательных типов документов еще нужно завершить.
                </span>
              </div>
            )}
            
            {currentStats.completedTypes === documentTypes.length && (
              <div className="flex items-center p-4 bg-green-100 border border-green-200 rounded-md">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800">
                  Все обязательные документы завершены!
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Модальное окно загрузки */}
      {showUploadModal && uploadingCategory && selectedLeadId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Загрузка документа
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                  setUploadingCategory(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-2">
                Лид: {selectedLead?.address}
              </p>
              <p className="text-gray-600 mb-4">
                Категория: {documentTypes.find(t => t.id === uploadingCategory)?.name}
              </p>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="w-full mb-4 p-2 border border-gray-300 rounded-md"
              />
              
              {selectedFile && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end p-6 border-t bg-gray-50 gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                  setUploadingCategory(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={confirmUpload}
                disabled={!selectedFile}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Загрузить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно просмотра лида */}
      {showLeadModal && viewingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Просмотр лида
              </h2>
              <button
                onClick={() => {
                  setShowLeadModal(false)
                  setViewingLead(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Основная информация</h3>
                  
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Адрес:</span>
                      <p className="font-medium text-gray-900">{viewingLead.address}</p>
                      <p className="text-sm text-gray-600">{viewingLead.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Контактное лицо:</span>
                      <p className="font-medium text-gray-900">{viewingLead.contactPerson}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Телефон:</span>
                      <p className="font-medium text-gray-900">{viewingLead.contactPhone}</p>
                    </div>
                  </div>
                  
                  {viewingLead.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium text-gray-900">{viewingLead.contactEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Дополнительная информация */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Детали объекта</h3>
                  
                  <div>
                    <span className="text-sm text-gray-500">Источник:</span>
                    <p className="font-medium text-gray-900">{viewingLead.source}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Статус:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      viewingLead.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      viewingLead.status === 'VOTING' ? 'bg-purple-100 text-purple-800' :
                      viewingLead.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {viewingLead.status === 'IN_PROGRESS' ? 'В процессе' :
                       viewingLead.status === 'VOTING' ? 'Голосование' :
                       viewingLead.status === 'COMPLETED' ? 'Завершено' : viewingLead.status}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Этажей:</span>
                    <p className="font-medium text-gray-900">{viewingLead.floorsCount}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Квартир:</span>
                    <p className="font-medium text-gray-900">{viewingLead.apartmentsCount}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Дата создания:</span>
                    <p className="font-medium text-gray-900">{new Date(viewingLead.createdAt).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
              </div>
              
              {/* Прогресс по документам */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Прогресс по документам</h3>
                {(() => {
                  const stats = getLeadStatistics(viewingLead.id)
                  return (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Завершено {stats.completedTypes} из {documentTypes.length} типов документов</span>
                        <span className="text-sm font-medium text-gray-900">{stats.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stats.completionPercentage}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{stats.totalDocuments}</div>
                          <div className="text-xs text-gray-500">Всего</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{stats.verifiedDocuments}</div>
                          <div className="text-xs text-gray-500">Проверено</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-600">{stats.pendingDocuments}</div>
                          <div className="text-xs text-gray-500">Ожидает</div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
            
            <div className="flex items-center justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowLeadModal(false)
                  setViewingLead(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}