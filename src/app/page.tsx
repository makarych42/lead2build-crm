'use client'

import { useState } from 'react'
import { Plus, Home as HomeIcon, FileText, Vote, BarChart3, Bell, Settings as SettingsIcon, MessageCircle, RefreshCw, Users, History, Monitor } from 'lucide-react'
import { useSession } from 'next-auth/react'
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
import UserMenu from '@/components/auth/UserMenu'
import UserManagement from '@/components/admin/UserManagement'
import SessionManagement from '@/components/admin/SessionManagement'
import LoginHistory from '@/components/admin/LoginHistory'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

type Tab = 'dashboard' | 'leads' | 'documents' | 'voting' | 'analytics' | 'notifications' | 'telegram' | 'settings' | 'test' | 'users' | 'sessions' | 'history'

export default function Home() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const userRole = session?.user?.role as UserRole

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

  // Базовые табы доступные всем
  const baseTabs = [
    { id: 'dashboard', label: 'Главная', icon: BarChart3, permission: null },
    { id: 'leads', label: 'Лиды', icon: HomeIcon, permission: 'leads:view' as const },
    { id: 'documents', label: 'Документы', icon: FileText, permission: 'documents:view' as const },
    { id: 'voting', label: 'Голосования', icon: Vote, permission: 'voting:view' as const },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3, permission: 'analytics:view' as const },
    { id: 'notifications', label: 'Уведомления', icon: Bell, permission: 'tasks:view' as const },
    { id: 'telegram', label: 'Telegram', icon: MessageCircle, permission: 'settings:telegram' as const },
    { id: 'settings', label: 'Настройки', icon: SettingsIcon, permission: 'settings:view' as const },
  ]

  // Админские табы
  const adminTabs = [
    { id: 'users', label: 'Пользователи', icon: Users, permission: 'users:view' as const },
    { id: 'sessions', label: 'Сессии', icon: Monitor, permission: 'sessions:view' as const },
    { id: 'history', label: 'История входов', icon: History, permission: 'history:view' as const },
  ]

  // Тестовый таб
  const testTab = { id: 'test', label: '🧪 Тесты', icon: RefreshCw, permission: null }

  // Фильтруем табы по правам пользователя
  const tabs = [
    ...baseTabs.filter(tab => !tab.permission || hasPermission(userRole, tab.permission)),
    ...adminTabs.filter(tab => hasPermission(userRole, tab.permission)),
    testTab,
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              CRM для контроля процесса голосования жильцов Lead2Build
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRegenerateTestData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Перегенерировать 105 тестовых лидов"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить данные
              </button>
              {hasPermission(userRole, 'leads:create') && (
                <button
                  onClick={() => setShowNewLeadForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Новый лид
                </button>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
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
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'sessions' && <SessionManagement />}
          {activeTab === 'history' && <LoginHistory />}
        </main>
      </div>

      {/* New Lead Form Modal */}
      {showNewLeadForm && (
        <NewLeadForm 
          onClose={() => setShowNewLeadForm(false)}
          onLeadCreated={handleLeadCreated}
        />
      )}
    </div>
  )
}
