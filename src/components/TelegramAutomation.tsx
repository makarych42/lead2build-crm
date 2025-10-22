'use client'

import { useState } from 'react'
import { Zap, Clock, AlertTriangle, CheckCircle, Bot, X, Save } from 'lucide-react'
import { useTelegramStore } from '@/stores'
import { useNotification } from './NotificationService'

// ============= ТИПЫ =============

type UserRole = 'SALES_MANAGER' | 'DOCUMENT_SPECIALIST' | 'TECHNICAL_INSPECTOR' | 
                'VOTING_COORDINATOR' | 'VOTING_MANAGER' | 'ADMIN'

type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

type TriggerType = 'TASK_CREATED' | 'TASK_OVERDUE' | 'TASK_DUE_SOON' | 
                   'LEAD_CREATED' | 'LEAD_STAGE_CHANGE' | 'VOTING_CREATED' | 
                   'DOCUMENT_UPLOADED' | 'DOCUMENT_READY'

interface AutomationRule {
  id: string
  name: string
  trigger: TriggerType
  conditions: {
    roles?: UserRole[]
    taskPriority?: TaskPriority
    daysBeforeDeadline?: number
  }
  messageTemplate: string
  enabled: boolean
  lastTriggered?: string
  triggerCount: number
}

// ============= КОНСТАНТЫ =============

const ROLE_LABELS: Record<UserRole, string> = {
  SALES_MANAGER: 'Менеджер по продажам',
  DOCUMENT_SPECIALIST: 'Специалист по документообороту',
  TECHNICAL_INSPECTOR: 'Инженер-инспектор',
  VOTING_COORDINATOR: 'Организатор голосований',
  VOTING_MANAGER: 'Координатор голосования',
  ADMIN: 'Администратор'
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  URGENT: 'Срочный'
}

const TRIGGERS = [
  { value: 'TASK_CREATED' as TriggerType, label: 'Создание задачи', icon: '📋', description: 'Срабатывает при создании новой задачи' },
  { value: 'TASK_OVERDUE' as TriggerType, label: 'Просроченная задача', icon: '⚠️', description: 'Срабатывает когда задача просрочена' },
  { value: 'TASK_DUE_SOON' as TriggerType, label: 'Приближение дедлайна', icon: '⏰', description: 'Срабатывает за N дней до дедлайна' },
  { value: 'LEAD_CREATED' as TriggerType, label: 'Новый лид', icon: '🏢', description: 'Срабатывает при создании нового лида' },
  { value: 'LEAD_STAGE_CHANGE' as TriggerType, label: 'Изменение этапа лида', icon: '🔄', description: 'Срабатывает при смене этапа' },
  { value: 'VOTING_CREATED' as TriggerType, label: 'Создание голосования', icon: '🗳️', description: 'Срабатывает при создании голосования' },
  { value: 'DOCUMENT_UPLOADED' as TriggerType, label: 'Загрузка документа', icon: '📤', description: 'Срабатывает при загрузке документа' },
  { value: 'DOCUMENT_READY' as TriggerType, label: 'Документ готов', icon: '✅', description: 'Срабатывает когда документ готов к проверке' }
]

export default function TelegramAutomation() {
  // Zustand store
  const rules = useTelegramStore((state) => state.automationRules)
  const setAutomationRules = useTelegramStore((state) => state.setAutomationRules)
  const addAutomationRule = useTelegramStore((state) => state.addAutomationRule)
  const updateAutomationRule = useTelegramStore((state) => state.updateAutomationRule)
  const deleteAutomationRule = useTelegramStore((state) => state.deleteAutomationRule)
  const toggleAutomationRule = useTelegramStore((state) => state.toggleAutomationRule)
  
  // Notifications
  const { success, error: showError, info } = useNotification()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
  const [formData, setFormData] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: 'TASK_CREATED',
    conditions: { roles: [] },
    messageTemplate: '',
    enabled: true
  })

  // ============= HANDLERS =============

  const handleOpenForm = (rule?: AutomationRule) => {
    if (rule) {
      setEditingRule(rule)
      setFormData(rule)
    } else {
      setEditingRule(null)
      setFormData({
        name: '',
        trigger: 'TASK_CREATED',
        conditions: { roles: [] },
        messageTemplate: '',
        enabled: true
      })
    }
    setShowAddForm(true)
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setEditingRule(null)
  }

  const handleSaveRule = () => {
    if (!formData.name || !formData.messageTemplate) {
      showError('Заполните название и шаблон сообщения')
      return
    }

    if (editingRule) {
      // Редактирование
      updateAutomationRule(editingRule.id, formData)
      success('Правило автоматизации обновлено!')
    } else {
      // Создание
      const newRule: AutomationRule = {
        id: `rule-${Date.now()}`,
        name: formData.name!,
        trigger: formData.trigger || 'TASK_CREATED',
        conditions: formData.conditions || { roles: [] },
        messageTemplate: formData.messageTemplate!,
        enabled: formData.enabled !== false,
        triggerCount: 0
      }
      addAutomationRule(newRule)
      success('Правило автоматизации создано!')
    }

    handleCloseForm()
  }

  const handleToggleRule = (id: string) => {
    toggleAutomationRule(id)
    const rule = rules.find(r => r.id === id)
    if (rule) {
      success(`Правило "${rule.name}" ${rule.enabled ? 'отключено' : 'включено'}`)
    }
  }

  const handleDeleteRule = (id: string) => {
    const confirmed = confirm('Удалить это правило автоматизации?')
    if (confirmed) {
      deleteAutomationRule(id)
      success('Правило автоматизации удалено!')
    }
  }

  const handleTestRule = (rule: AutomationRule) => {
    const exampleMessage = rule.messageTemplate
      .replace('{title}', 'Пример задачи')
      .replace('{address}', 'ул. Примерная, д. 1')
      .replace('{dueDate}', '25.10.2025')
      .replace('{priority}', 'Высокий')
      .replace('{days}', '2')
      .replace('{clientName}', 'Иван Иванов')
      .replace('{phone}', '+7 999 123-45-67')
      .replace('{startDate}', '20.10.2025')
      .replace('{endDate}', '30.10.2025')
    
    info(`Тестовое уведомление:\n\n${exampleMessage}`)
  }

  const handleToggleRole = (role: UserRole) => {
    const currentRoles = formData.conditions?.roles || []
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    
    setFormData({
      ...formData,
      conditions: { ...formData.conditions, roles: newRoles }
    })
  }

  const getTriggerInfo = (trigger: TriggerType) => {
    return TRIGGERS.find(t => t.value === trigger)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ============= RENDER =============

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Zap className="h-6 w-6 text-yellow-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Правила автоматизации</h3>
            <p className="text-sm text-gray-500">
              {rules.filter(r => r.enabled).length} активных из {rules.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Добавить правило</span>
        </button>
      </div>

      {/* Список правил */}
      <div className="space-y-4">
        {rules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Нет настроенных правил автоматизации</p>
            <p className="text-sm text-gray-400 mt-1">Добавьте правила для автоматической отправки уведомлений</p>
          </div>
        ) : (
          rules.map((rule) => {
            const triggerInfo = getTriggerInfo(rule.trigger)
            return (
              <div key={rule.id} className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Заголовок */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{triggerInfo?.icon}</span>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-500">{triggerInfo?.label}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.enabled ? '✓ Активно' : '○ Отключено'}
                      </span>
                    </div>

                    {/* Условия */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-500">Роли получателей:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {rule.conditions.roles && rule.conditions.roles.length > 0
                            ? rule.conditions.roles.map(r => ROLE_LABELS[r]).join(', ')
                            : 'Все'}
                        </p>
                      </div>
                      {rule.conditions.taskPriority && (
                        <div>
                          <span className="text-xs text-gray-500">Приоритет задачи:</span>
                          <p className="text-sm font-medium text-gray-900">
                            {PRIORITY_LABELS[rule.conditions.taskPriority]}
                          </p>
                        </div>
                      )}
                      {rule.conditions.daysBeforeDeadline && (
                        <div>
                          <span className="text-xs text-gray-500">Дней до дедлайна:</span>
                          <p className="text-sm font-medium text-gray-900">
                            {rule.conditions.daysBeforeDeadline}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-gray-500">Срабатываний:</span>
                        <p className="text-sm font-medium text-gray-900">{rule.triggerCount}</p>
                      </div>
                    </div>

                    {/* Шаблон сообщения */}
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <span className="text-xs text-gray-500 block mb-1">Шаблон сообщения:</span>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{rule.messageTemplate}</p>
                    </div>

                    {/* Последнее срабатывание */}
                    {rule.lastTriggered && (
                      <p className="text-xs text-gray-500">
                        Последнее срабатывание: {formatDate(rule.lastTriggered)}
                      </p>
                    )}
                  </div>

                  {/* Действия */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleTestRule(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Тест правила"
                    >
                      <Bot className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleOpenForm(rule)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                      title="Редактировать"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-2 rounded-md ${
                        rule.enabled 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={rule.enabled ? 'Отключить' : 'Включить'}
                    >
                      {rule.enabled ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Удалить"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Модальное окно создания/редактирования */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRule ? 'Редактировать правило' : 'Новое правило автоматизации'}
              </h3>
              <button onClick={handleCloseForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название правила <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Например: Уведомление о новой задаче"
                />
              </div>

              {/* Триггер */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Триггер <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value as TriggerType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  {TRIGGERS.map(trigger => (
                    <option key={trigger.value} value={trigger.value}>
                      {trigger.icon} {trigger.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {getTriggerInfo(formData.trigger || 'TASK_CREATED')?.description}
                </p>
              </div>

              {/* Роли получателей */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Роли получателей (оставьте пустым для всех)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ROLE_LABELS).map(([role, label]) => (
                    <label key={role} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.conditions?.roles?.includes(role as UserRole) || false}
                        onChange={() => handleToggleRole(role as UserRole)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Дополнительные условия для задач */}
              {(formData.trigger === 'TASK_CREATED' || formData.trigger === 'TASK_OVERDUE' || formData.trigger === 'TASK_DUE_SOON') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Приоритет задачи
                    </label>
                    <select
                      value={formData.conditions?.taskPriority || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: { 
                          ...formData.conditions, 
                          taskPriority: e.target.value ? e.target.value as TaskPriority : undefined 
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    >
                      <option value="">Любой</option>
                      {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {formData.trigger === 'TASK_DUE_SOON' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дней до дедлайна
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.conditions?.daysBeforeDeadline || 3}
                        onChange={(e) => setFormData({
                          ...formData,
                          conditions: { 
                            ...formData.conditions, 
                            daysBeforeDeadline: parseInt(e.target.value) 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Шаблон сообщения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Шаблон сообщения <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.messageTemplate}
                  onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Введите текст сообщения с переменными..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Доступные переменные: {'{title}'}, {'{address}'}, {'{dueDate}'}, {'{priority}'}, {'{days}'}, 
                  {'{clientName}'}, {'{phone}'}, {'{startDate}'}, {'{endDate}'}
                </p>
              </div>

              {/* Активность */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.enabled !== false}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  Правило активно
                </label>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveRule}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingRule ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
