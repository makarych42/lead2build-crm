'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { useTasksStore, useUsersStore, useLeadsStore, useVotingsStore } from '@/stores'
import { Task, User, Lead, Voting, TaskFilters as TaskFiltersType } from './types'
import { TaskStats } from './TaskStats'
import { TaskFilters } from './TaskFilters'
import { TaskCard } from './TaskCard'
import { TaskDetailsModal } from './TaskDetailsModal'
import { CreateTaskModal } from './CreateTaskModal'
import { updateOverdueTasks, filterTasks, sortTasks } from './utils'
import { Spinner, EmptyState } from '@/components/LoadingStates'
import { useNotification } from '@/components/NotificationService'

export default function TaskManagement() {
  // Zustand stores
  const tasks = useTasksStore((state) => state.tasks)
  const addTask = useTasksStore((state) => state.addTask)
  const updateTask = useTasksStore((state) => state.updateTask)
  const deleteTask = useTasksStore((state) => state.deleteTask)
  const isTasksInitialized = useTasksStore((state) => state.isInitialized)
  
  const users = useUsersStore((state) => state.users)
  const setUsers = useUsersStore((state) => state.setUsers)
  const currentUserId = useUsersStore((state) => state.currentUserId)
  const setCurrentUser = useUsersStore((state) => state.setCurrentUser)
  const isUsersInitialized = useUsersStore((state) => state.isInitialized)
  
  const leads = useLeadsStore((state) => state.leads)
  const votings = useVotingsStore((state) => state.votings)
  
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    assignedTo: 'ALL',
    type: 'ALL'
  })

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const { showNotification } = useNotification()

  // Инициализация
  useEffect(() => {
    if (isTasksInitialized && isUsersInitialized) {
      setLoading(false)
    }
  }, [isTasksInitialized, isUsersInitialized])

  // Создание демо пользователей
  useEffect(() => {
    if (isUsersInitialized && users.length === 0) {
      const now = new Date().toISOString()
      const demoUsers: User[] = [
        {
          id: 'user-1',
          name: 'Иван Менеджеров',
          email: 'ivan@lead2build.ru',
          role: 'SALES_MANAGER',
          active: true,
          phone: '+7 (999) 111-11-11',
          createdAt: now
        },
        {
          id: 'user-2',
          name: 'Мария Документова',
          email: 'maria@lead2build.ru',
          role: 'DOCUMENT_SPECIALIST',
          active: true,
          phone: '+7 (999) 222-22-22',
          createdAt: now
        },
        {
          id: 'user-3',
          name: 'Петр Инспекторов',
          email: 'petr@lead2build.ru',
          role: 'TECHNICAL_INSPECTOR',
          active: true,
          phone: '+7 (999) 333-33-33',
          createdAt: now
        },
        {
          id: 'user-4',
          name: 'Анна Голосова',
          email: 'anna@lead2build.ru',
          role: 'VOTING_COORDINATOR',
          active: true,
          phone: '+7 (999) 444-44-44',
          createdAt: now
        },
        {
          id: 'user-admin',
          name: 'Админ Администраторов',
          email: 'admin@lead2build.ru',
          role: 'ADMIN',
          active: true,
          phone: '+7 (999) 000-00-00',
          createdAt: now
        }
      ]
      setUsers(demoUsers)
      
      if (!currentUserId) {
        setCurrentUser('user-admin')
      }
    }
  }, [isUsersInitialized, users, currentUserId, setUsers, setCurrentUser])

  // Автоматическое обновление просроченных задач
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTasks = updateOverdueTasks(tasks)
      updatedTasks.forEach(task => {
        if (task.status === 'OVERDUE') {
          updateTask(task.id, { status: 'OVERDUE' })
        }
      })
    }, 60000) // Каждую минуту

    return () => clearInterval(interval)
  }, [tasks, updateTask])

  // Фильтрация и сортировка задач
  const filteredAndSortedTasks = useMemo(() => {
    let result = filterTasks(tasks, filters)
    result = sortTasks(result, 'dueDate', 'asc')
    return result
  }, [tasks, filters])

  // Обработчики
  const handleStatusChange = useCallback((taskId: string, newStatus: Task['status']) => {
    const updates: Partial<Task> = { status: newStatus }
    if (newStatus === 'COMPLETED') {
      updates.completedAt = new Date().toISOString()
    }
    updateTask(taskId, updates)
    showNotification(`Статус задачи обновлен`, 'success')
  }, [updateTask, showNotification])

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsDetailsModalOpen(true)
    setIsEditMode(false)
  }, [])

  const handleCreateTask = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsDetailsModalOpen(false)
    setIsCreateModalOpen(true)
    setIsEditMode(true)
  }, [])

  const handleCloseModals = useCallback(() => {
    setIsDetailsModalOpen(false)
    setIsCreateModalOpen(false)
    setSelectedTask(null)
    setIsEditMode(false)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-2 mt-4 text-gray-600">Загрузка задач...</span>
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
              Управление задачами
            </h2>
            <p className="text-gray-600">
              Отслеживание и координация задач по лидам и голосованиям
            </p>
          </div>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать задачу
          </button>
        </div>
      </div>

      {/* Stats */}
      <TaskStats tasks={tasks} currentUserId={currentUserId || undefined} />

      {/* Filters */}
      <TaskFilters
        filters={filters}
        users={users}
        onFiltersChange={setFilters}
      />

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Найдено задач: <span className="font-medium">{filteredAndSortedTasks.length}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Сетка
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Список
          </button>
        </div>
      </div>

      {/* Tasks Grid/List */}
      {filteredAndSortedTasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Задачи не найдены"
          description="Создайте первую задачу или измените фильтры"
          action={
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Создать задачу
            </button>
          }
        />
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }>
          {filteredAndSortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onStatusChange={handleStatusChange}
              onClick={handleTaskClick}
            />
          ))}
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModals}
          onEdit={handleEditTask}
          onStatusChange={handleStatusChange}
          users={users}
        />
      )}

      {/* Create/Edit Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSubmit={(taskData) => {
          if (isEditMode && selectedTask) {
            updateTask(selectedTask.id, taskData)
            showNotification('Задача обновлена', 'success')
          } else {
            const newTask: Task = {
              id: Date.now().toString(),
              ...taskData,
              createdAt: new Date().toISOString(),
              status: 'PENDING' as const
            }
            addTask(newTask)
            showNotification('Задача создана', 'success')
          }
          handleCloseModals()
        }}
        initialData={isEditMode ? selectedTask : undefined}
        users={users}
        leads={leads}
        votings={votings}
      />
    </div>
  )
}

