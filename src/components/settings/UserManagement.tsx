'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, X, Save, User as UserIcon, Mail, Phone, MessageCircle } from 'lucide-react'
import { useUsersStore, useTasksStore } from '@/stores'
import { useNotification } from '@/components/NotificationService'

type UserRole = 'SALES_MANAGER' | 'DOCUMENT_SPECIALIST' | 'TECHNICAL_INSPECTOR' | 
                'VOTING_COORDINATOR' | 'VOTING_MANAGER' | 'ADMIN'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  telegram?: string
  avatar?: string
  active: boolean
  createdAt: string
  lastLogin?: string
}

interface Task {
  id: string
  assignedTo: string[]
  status: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  SALES_MANAGER: 'Менеджер по продажам',
  DOCUMENT_SPECIALIST: 'Специалист по документообороту',
  TECHNICAL_INSPECTOR: 'Инженер-инспектор',
  VOTING_COORDINATOR: 'Организатор голосований',
  VOTING_MANAGER: 'Координатор голосования',
  ADMIN: 'Администратор'
}

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  SALES_MANAGER: 'bg-blue-100 text-blue-800',
  DOCUMENT_SPECIALIST: 'bg-green-100 text-green-800',
  TECHNICAL_INSPECTOR: 'bg-orange-100 text-orange-800',
  VOTING_COORDINATOR: 'bg-indigo-100 text-indigo-800',
  VOTING_MANAGER: 'bg-pink-100 text-pink-800'
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: 'Полный доступ ко всем разделам, управление пользователями и настройками',
  SALES_MANAGER: 'Создание и управление лидами, первичная консультация с клиентами',
  DOCUMENT_SPECIALIST: 'Управление документами, подготовка предложений, проверка документов',
  TECHNICAL_INSPECTOR: 'Технические обследования, составление отчетов, согласование',
  VOTING_COORDINATOR: 'Создание голосований, регистрация в ГИС ЖКХ, подготовка документов',
  VOTING_MANAGER: 'Работа с собственниками, сбор голосов, подготовка протоколов'
}

export default function UserManagement() {
  // Zustand stores
  const users = useUsersStore((state) => state.users)
  const addUser = useUsersStore((state) => state.addUser)
  const updateUser = useUsersStore((state) => state.updateUser)
  const deleteUser = useUsersStore((state) => state.deleteUser)
  const currentUserId = useUsersStore((state) => state.currentUserId)
  
  const tasks = useTasksStore((state) => state.tasks)
  
  // Notifications
  const { success, error: showError, warning } = useNotification()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    telegram: '',
    role: 'SALES_MANAGER' as UserRole,
    active: true
  })

  // Фильтрация пользователей
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = filterRole === 'ALL' || user.role === filterRole
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && user.active) ||
        (filterStatus === 'inactive' && !user.active)
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, filterRole, filterStatus])

  // Подсчет активных задач для пользователя
  const getActiveTasksCount = (userId: string) => {
    return tasks.filter(task => 
      task.assignedTo.includes(userId) && 
      task.status !== 'COMPLETED' && 
      task.status !== 'CANCELLED'
    ).length
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        telegram: user.telegram || '',
        role: user.role,
        active: user.active
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        telegram: '',
        role: 'SALES_MANAGER',
        active: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      showError('Заполните обязательные поля: Имя и Email')
      return
    }
    
    if (!validateEmail(formData.email)) {
      showError('Введите корректный email')
      return
    }
    
    // Проверка уникальности email
    const emailExists = users.some(u => 
      u.email === formData.email && u.id !== editingUser?.id
    )
    
    if (emailExists) {
      showError('Пользователь с таким email уже существует')
      return
    }
    
    if (editingUser) {
      // Редактирование
      updateUser(editingUser.id, formData)
      success('Пользователь успешно обновлен!')
    } else {
      // Создание
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      }
      addUser(newUser)
      success('Пользователь успешно создан!')
    }
    
    handleCloseModal()
  }

  const handleDelete = async (user: User) => {
    if (user.id === currentUserId) {
      warning('Нельзя удалить текущего пользователя')
      return
    }
    
    const activeTasks = getActiveTasksCount(user.id)
    let message = `Удалить пользователя ${user.name}?`
    if (activeTasks > 0) {
      message = `У пользователя ${activeTasks} активных задач. Вы уверены, что хотите удалить пользователя ${user.name}?`
    }
    
    const confirmed = confirm(message)
    if (confirmed) {
      deleteUser(user.id)
      success('Пользователь успешно удален!')
    }
  }

  const toggleStatus = (user: User) => {
    if (user.id === currentUserId && user.active) {
      warning('Нельзя деактивировать текущего пользователя')
      return
    }
    
    updateUser(user.id, { active: !user.active })
    success(`Пользователь ${user.active ? 'деактивирован' : 'активирован'}`)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  return (
    <div>
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Управление пользователями</h3>
          <p className="text-sm text-gray-600">Всего пользователей: {users.length}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="ALL">Все роли</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Задачи
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата создания
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className={user.id === currentUserId ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.id === currentUserId && (
                            <span className="ml-2 text-xs text-blue-600">(Вы)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.phone && (
                        <div className="flex items-center mb-1">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                      {user.telegram && (
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1 text-gray-400" />
                          {user.telegram}
                        </div>
                      )}
                      {!user.phone && !user.telegram && (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getActiveTasksCount(user.id)} активных
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(user)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.active ? 'Активен' : 'Неактивен'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно создания/редактирования */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Имя */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="ivan@lead2build.ru"
                  required
                />
              </div>

              {/* Телефон */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              {/* Telegram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telegram ID
                </label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="@username"
                />
              </div>

              {/* Роль */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Роль <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {ROLE_DESCRIPTIONS[formData.role]}
                </p>
              </div>

              {/* Активен */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  Пользователь активен
                </label>
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingUser ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

