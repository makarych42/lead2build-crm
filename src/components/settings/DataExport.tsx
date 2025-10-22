'use client'

import { Download, Trash2 } from 'lucide-react'
import { useLeadsStore, useVotingsStore, useTasksStore, useDocumentsStore, useUsersStore, useTelegramStore } from '@/stores'
import { useNotification } from '@/components/NotificationService'

export default function DataExport() {
  const { confirm, success, showError } = useNotification()
  
  const leads = useLeadsStore((state) => state.leads)
  const votings = useVotingsStore((state) => state.votings)
  const tasks = useTasksStore((state) => state.tasks)
  const documents = useDocumentsStore((state) => state.documents)
  const users = useUsersStore((state) => state.users)
  
  const setLeads = useLeadsStore((state) => state.setLeads)
  const setVotings = useVotingsStore((state) => state.setVotings)
  const setTasks = useTasksStore((state) => state.setTasks)
  const setDocuments = useDocumentsStore((state) => state.setDocuments)
  const setUsers = useUsersStore((state) => state.setUsers)

  const handleExport = (dataType: string, data: any, filename: string) => {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = (dataType: string, key: string) => {
    confirm(
      `Вы уверены, что хотите удалить все данные (${dataType})? Это действие необратимо!`,
      () => {
        try {
          // Очищаем данные в соответствующем store
          switch (key) {
            case 'construction_leads':
              setLeads([])
              break
            case 'construction_votings':
              setVotings([])
              break
            case 'construction_tasks':
              setTasks([])
              break
            case 'construction_documents':
              setDocuments([])
              break
            case 'construction_users':
              setUsers([])
              break
          }
          success(`Данные "${dataType}" успешно очищены`)
        } catch (error) {
          showError(`Ошибка при очистке данных: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
        }
      }
    )
  }

  const dataItems = [
    {
      type: 'Лиды',
      count: leads.length,
      key: 'construction_leads',
      data: leads,
      filename: 'leads.json'
    },
    {
      type: 'Голосования',
      count: votings.length,
      key: 'construction_votings',
      data: votings,
      filename: 'votings.json'
    },
    {
      type: 'Задачи',
      count: tasks.length,
      key: 'construction_tasks',
      data: tasks,
      filename: 'tasks.json'
    },
    {
      type: 'Документы',
      count: documents.length,
      key: 'construction_documents',
      data: documents,
      filename: 'documents.json'
    },
    {
      type: 'Пользователи',
      count: users.length,
      key: 'construction_users',
      data: users,
      filename: 'users.json'
    }
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Экспорт и управление данными</h3>
        <p className="text-sm text-gray-600">Экспорт данных и очистка хранилища</p>
      </div>

      <div className="space-y-4">
        {dataItems.map((item) => (
          <div key={item.key} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{item.type}</h4>
                <p className="text-sm text-gray-500">Всего записей: {item.count}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleExport(item.type, item.data, item.filename)}
                  disabled={item.count === 0}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Экспортировать
                </button>
                <button
                  onClick={() => handleClearData(item.type, item.key)}
                  disabled={item.count === 0}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Внимание:</strong> Экспорт данных сохраняет информацию в формате JSON. 
          Очистка данных необратима - убедитесь, что сделали резервную копию перед удалением.
        </p>
      </div>
    </div>
  )
}

