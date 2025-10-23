'use client'

import { useState } from 'react'
import { Plus, Home as HomeIcon, FileText, Vote, BarChart3, Bell, Settings as SettingsIcon, MessageCircle, RefreshCw } from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import LeadsList from '@/components/LeadsList'
import NewLeadForm from '@/components/NewLeadForm'
import DocumentManager from '@/components/DocumentManager'
import VotingManager from '@/components/voting'
import Analytics from '@/components/Analytics'
import TaskManagement from '@/components/tasks'
import Settings from '@/components/Settings'
import TelegramIntegration from '@/components/TelegramIntegration'
import StoresTester from '@/components/StoresTester'
import { WelcomeModal } from '@/components/onboarding/WelcomeModal'
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist'
import { TourController } from '@/components/onboarding/TourController'
import { useOnboardingStore, useOnboardingState } from '@/stores/useOnboardingStore'

type Tab = 'dashboard' | 'leads' | 'documents' | 'voting' | 'analytics' | 'notifications' | 'telegram' | 'settings' | 'test'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Onboarding state
  const onboardingState = useOnboardingState()
  const { showWelcomeModal, hideWelcomeModal, toggleChecklist } = useOnboardingStore()

  // Функция для перегенерации тестовых данных
  const handleRegenerateTestData = () => {
    if (confirm('Перегенерировать все тестовые данные? Это удалит все существующие лиды и документы.')) {
      // Очищаем localStorage
      localStorage.removeItem('construction_leads')
      localStorage.removeItem('construction_documents')
      // Перезагружаем страницу с параметром для принудительной регенерации
      window.location.href = window.location.pathname + '?regenerate=true'
    }
  }

  // Функция для обновления данных во всех компонентах
  const handleDataRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Функция для обработки успешного создания лида
  const handleLeadCreated = () => {
    setShowNewLeadForm(false)
    handleDataRefresh()
    // Автоматически переключиться на вкладку лидов, если не на ней
    if (activeTab !== 'leads') {
      setActiveTab('leads')
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Главная', icon: BarChart3 },
    { id: 'leads', label: 'Лиды', icon: HomeIcon },
    { id: 'documents', label: 'Документы', icon: FileText },
    { id: 'voting', label: 'Голосования', icon: Vote },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'telegram', label: 'Telegram', icon: MessageCircle },
    { id: 'settings', label: 'Настройки', icon: SettingsIcon },
    { id: 'test', label: '🧪 Тесты', icon: RefreshCw },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" data-tour="dashboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              CRM для контроля процесса голосования жильцов Lead2Build
            </h1>
            <div className="flex items-center space-x-3">
              <TourController variant="compact" />
              <button
                onClick={handleRegenerateTestData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Перегенерировать 105 тестовых лидов"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить данные
              </button>
              <button
                onClick={() => setShowNewLeadForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                data-tour="dashboard-actions"
              >
                <Plus className="h-4 w-4 mr-2" />
                Новый лид
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen" data-tour="navigation">
          <div className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      data-tour={`nav-${tab.id}`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              onNavigate={(tab) => setActiveTab(tab as Tab)}
              onNewLead={() => setShowNewLeadForm(true)}
              refreshTrigger={refreshTrigger}
            />
          )}
          {activeTab === 'leads' && <LeadsList refreshTrigger={refreshTrigger} />}
          {activeTab === 'documents' && <DocumentManager />}
          {activeTab === 'voting' && <VotingManager />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'notifications' && <TaskManagement />}
          {activeTab === 'telegram' && <TelegramIntegration />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'test' && <StoresTester />}
        </main>
      </div>

      {/* New Lead Form Modal */}
      {showNewLeadForm && (
        <NewLeadForm 
          onClose={() => setShowNewLeadForm(false)}
          onLeadCreated={handleLeadCreated}
        />
      )}

      {/* Onboarding Modals */}
      <WelcomeModal 
        isOpen={onboardingState.showWelcomeModal}
        onClose={hideWelcomeModal}
      />
      
      <OnboardingChecklist 
        isOpen={onboardingState.showChecklist}
        onClose={() => toggleChecklist()}
      />

      {/* Floating Tour Controller */}
      <TourController variant="floating" />
    </div>
  )
}
