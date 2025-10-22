'use client'

import { useEffect, useState } from 'react'
import { 
  useLeadsStore, 
  useVotingsStore, 
  useTasksStore, 
  useUsersStore, 
  useTelegramStore,
  useDocumentsStore 
} from '@/stores'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function StoresTester() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [testing, setTesting] = useState(false)

  // Получаем данные из всех stores
  const leads = useLeadsStore((state) => state.leads)
  const addLead = useLeadsStore((state) => state.addLead)
  const deleteLead = useLeadsStore((state) => state.deleteLead)
  
  const votings = useVotingsStore((state) => state.votings)
  const addVoting = useVotingsStore((state) => state.addVoting)
  
  const tasks = useTasksStore((state) => state.tasks)
  const addTask = useTasksStore((state) => state.addTask)
  
  const users = useUsersStore((state) => state.users)
  const addUser = useUsersStore((state) => state.addUser)
  
  const telegramSettings = useTelegramStore((state) => state.settings)
  const telegramConnections = useTelegramStore((state) => state.connections)
  
  const documents = useDocumentsStore((state) => state.documents)
  const addDocument = useDocumentsStore((state) => state.addDocument)

  const runTests = async () => {
    setTesting(true)
    const results: Record<string, boolean> = {}

    try {
      // Test 1: LeadsStore - Create & Delete
      console.log('🧪 Testing LeadsStore...')
      const testLead = {
        id: `test-lead-${Date.now()}`,
        address: 'Test Address',
        city: 'Test City',
        contactPerson: 'Test Person',
        contactPhone: '+7 999 999-99-99',
        contactEmail: 'test@test.com',
        source: 'Test',
        status: 'NEW' as const,
        currentStage: 'INITIAL_CONSULTATION' as const,
        createdAt: new Date().toISOString(),
        buildingType: 'МКД',
        floorsCount: 5,
        apartmentsCount: 20
      }
      
      const beforeCount = leads.length
      addLead(testLead)
      await new Promise(resolve => setTimeout(resolve, 100))
      const afterAdd = useLeadsStore.getState().leads.length
      results['LeadsStore: Add'] = afterAdd === beforeCount + 1
      
      deleteLead(testLead.id)
      await new Promise(resolve => setTimeout(resolve, 100))
      const afterDelete = useLeadsStore.getState().leads.length
      results['LeadsStore: Delete'] = afterDelete === beforeCount
      console.log('✅ LeadsStore OK')

      // Test 2: VotingsStore
      console.log('🧪 Testing VotingsStore...')
      const testVoting = {
        id: `test-voting-${Date.now()}`,
        leadId: 'test-lead',
        address: 'Test Voting Address',
        currentVotes: 0,
        votesPercent: 0,
        status: 'PREPARATION' as const,
        apartments: []
      }
      
      const votingsCount = votings.length
      addVoting(testVoting)
      await new Promise(resolve => setTimeout(resolve, 100))
      results['VotingsStore: Add'] = useVotingsStore.getState().votings.length === votingsCount + 1
      console.log('✅ VotingsStore OK')

      // Test 3: TasksStore
      console.log('🧪 Testing TasksStore...')
      const testTask = {
        id: `test-task-${Date.now()}`,
        title: 'Test Task',
        description: 'Test task description',
        type: 'CALL' as const,
        priority: 'MEDIUM' as const,
        status: 'PENDING' as const,
        assignedTo: ['test-user'],
        createdBy: 'test-user',
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        context: { leadId: 'test-lead' }
      }
      
      const tasksCount = tasks.length
      addTask(testTask)
      await new Promise(resolve => setTimeout(resolve, 100))
      results['TasksStore: Add'] = useTasksStore.getState().tasks.length === tasksCount + 1
      console.log('✅ TasksStore OK')

      // Test 4: UsersStore
      console.log('🧪 Testing UsersStore...')
      const testUser = {
        id: `test-user-${Date.now()}`,
        name: 'Test User',
        email: 'testuser@test.com',
        role: 'SALES_MANAGER' as const,
        active: true,
        createdAt: new Date().toISOString()
      }
      
      const usersCount = users.length
      addUser(testUser)
      await new Promise(resolve => setTimeout(resolve, 100))
      results['UsersStore: Add'] = useUsersStore.getState().users.length === usersCount + 1
      console.log('✅ UsersStore OK')

      // Test 5: TelegramStore - Check persistence
      console.log('🧪 Testing TelegramStore...')
      results['TelegramStore: Settings'] = telegramSettings !== null && telegramSettings !== undefined
      results['TelegramStore: Connections'] = Array.isArray(telegramConnections)
      console.log('✅ TelegramStore OK')

      // Test 6: DocumentsStore
      console.log('🧪 Testing DocumentsStore...')
      const testDocument = {
        id: `test-doc-${Date.now()}`,
        name: 'Test Document.pdf',
        type: 'application/pdf',
        size: 1024,
        uploadedAt: new Date().toISOString(),
        status: 'pending' as const,
        leadId: 'test-lead',
        category: 'test'
      }
      
      const docsCount = documents.length
      addDocument(testDocument)
      await new Promise(resolve => setTimeout(resolve, 100))
      results['DocumentsStore: Add'] = useDocumentsStore.getState().documents.length === docsCount + 1
      console.log('✅ DocumentsStore OK')

      // Test 7: Persistence (проверяем localStorage)
      console.log('🧪 Testing Persistence...')
      const hasLeadsInStorage = localStorage.getItem('construction_leads') !== null
      const hasVotingsInStorage = localStorage.getItem('construction_votings') !== null
      const hasTasksInStorage = localStorage.getItem('construction_tasks') !== null
      const hasUsersInStorage = localStorage.getItem('construction_users') !== null
      const hasTelegramInStorage = localStorage.getItem('construction_telegram') !== null
      const hasDocsInStorage = localStorage.getItem('construction_documents') !== null
      
      results['Persistence: All stores'] = hasLeadsInStorage && hasVotingsInStorage && 
                                           hasTasksInStorage && hasUsersInStorage &&
                                           hasTelegramInStorage && hasDocsInStorage
      console.log('✅ Persistence OK')

      console.log('🎉 All tests completed!')
      console.log('Results:', results)

    } catch (error) {
      console.error('❌ Test error:', error)
      results['Error'] = false
    }

    setTestResults(results)
    setTesting(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Zustand Stores Tester</h2>
      
      {/* Store Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Leads</div>
          <div className="text-2xl font-bold text-blue-700">{leads.length}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600">Votings</div>
          <div className="text-2xl font-bold text-green-700">{votings.length}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600">Tasks</div>
          <div className="text-2xl font-bold text-purple-700">{tasks.length}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="text-sm text-gray-600">Users</div>
          <div className="text-2xl font-bold text-orange-700">{users.length}</div>
        </div>
        <div className="p-4 bg-pink-50 rounded-lg">
          <div className="text-sm text-gray-600">Telegram</div>
          <div className="text-2xl font-bold text-pink-700">{telegramConnections.length}</div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="text-sm text-gray-600">Documents</div>
          <div className="text-2xl font-bold text-indigo-700">{documents.length}</div>
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={runTests}
        disabled={testing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium mb-6"
      >
        {testing ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Тестирование...
          </>
        ) : (
          'Запустить тесты'
        )}
      </button>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Результаты тестов:</h3>
          {Object.entries(testResults).map(([test, passed]) => (
            <div
              key={test}
              className={`flex items-center justify-between p-3 rounded-lg ${
                passed ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <span className="text-gray-900 font-medium">{test}</span>
              {passed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          ))}
          
          {/* Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Итого</div>
            <div className="text-xl font-bold text-gray-900">
              {Object.values(testResults).filter(Boolean).length} / {Object.keys(testResults).length} тестов пройдено
            </div>
            {Object.values(testResults).every(Boolean) && (
              <div className="mt-2 text-green-600 font-medium">
                🎉 Все тесты успешно пройдены!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

