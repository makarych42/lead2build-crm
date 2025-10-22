// Утилиты для автоматического создания задач

export type TaskType = 
  | 'CONTACT_CLIENT' | 'CONDUCT_CONSULTATION' | 'CLARIFY_DETAILS' | 'MOVE_TO_NEXT_STAGE'
  | 'PREPARE_PROPOSAL' | 'REQUEST_REGISTRY' | 'PREPARE_KT_SCHEME' | 'UPLOAD_DOCUMENTS' 
  | 'REVIEW_DOCUMENTS' | 'APPROVE_DOCUMENTS'
  | 'SCHEDULE_INSPECTION' | 'CONDUCT_INSPECTION' | 'PREPARE_REPORT' | 'APPROVE_TECHNICAL'
  | 'REQUEST_OWNER_REGISTRY' | 'REGISTER_GISZHKH' | 'CREATE_VOTING' | 'PREPARE_BALLOTS'
  | 'SCHEDULE_VOTING' | 'ADD_APARTMENTS' | 'CONTACT_OWNERS' | 'COLLECT_VOTES'
  | 'HANDLE_OBJECTIONS' | 'PREPARE_PROTOCOL'
  | 'DEADLINE_REMINDER' | 'OVERDUE_TASK' | 'CUSTOM'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type UserRole = 'SALES_MANAGER' | 'DOCUMENT_SPECIALIST' | 'TECHNICAL_INSPECTOR' | 
                       'VOTING_COORDINATOR' | 'VOTING_MANAGER' | 'ADMIN'

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  leadId?: string
  votingId?: string
  documentId?: string
  assignedTo: string[]
  createdBy: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE'
  priority: TaskPriority
  createdAt: string
  dueDate: string
  completedAt?: string
  notes?: string
  context: {
    address?: string
    leadStatus?: string
    leadStage?: string
    clientName?: string
  }
}

export interface User {
  id: string
  name: string
  role: UserRole
  active: boolean
}

// Получить пользователей по роли
export function getUsersByRole(users: User[], role: UserRole): User[] {
  return users.filter(u => u.role === role && u.active)
}

// Создать задачу при создании нового лида
export function createNewLeadTasks(
  leadId: string,
  address: string,
  clientName: string,
  users: User[]
): Task[] {
  const salesManagers = getUsersByRole(users, 'SALES_MANAGER')
  if (salesManagers.length === 0) return []

  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const tasks: Task[] = [
    {
      id: `task-${Date.now()}-1`,
      title: `Связаться с клиентом: ${address}`,
      description: `Первичный контакт с клиентом ${clientName}, уточнение деталей заявки`,
      type: 'CONTACT_CLIENT',
      leadId,
      assignedTo: [salesManagers[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: now.toISOString(),
      dueDate: tomorrow.toISOString(),
      context: {
        address,
        clientName,
        leadStatus: 'NEW'
      }
    },
    {
      id: `task-${Date.now()}-2`,
      title: `Провести консультацию: ${address}`,
      description: `Провести консультацию с клиентом, разъяснить процесс и этапы работы`,
      type: 'CONDUCT_CONSULTATION',
      leadId,
      assignedTo: [salesManagers[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'MEDIUM',
      createdAt: now.toISOString(),
      dueDate: threeDaysLater.toISOString(),
      context: {
        address,
        clientName,
        leadStatus: 'NEW'
      }
    }
  ]

  return tasks
}

// Создать задачи при переводе лида в работу
export function createInProgressTasks(
  leadId: string,
  address: string,
  users: User[]
): Task[] {
  const documentSpecialists = getUsersByRole(users, 'DOCUMENT_SPECIALIST')
  if (documentSpecialists.length === 0) return []

  const now = new Date()
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const tasks: Task[] = [
    {
      id: `task-${Date.now()}-1`,
      title: `Подготовить комплексное предложение: ${address}`,
      description: `Составить комплексное коммерческое предложение для клиента`,
      type: 'PREPARE_PROPOSAL',
      leadId,
      assignedTo: [documentSpecialists[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: now.toISOString(),
      dueDate: fiveDaysLater.toISOString(),
      context: {
        address,
        leadStatus: 'IN_PROGRESS'
      }
    },
    {
      id: `task-${Date.now()}-2`,
      title: `Запросить реестр собственников: ${address}`,
      description: `Запросить у клиента или управляющей компании реестр собственников помещений`,
      type: 'REQUEST_REGISTRY',
      leadId,
      assignedTo: [documentSpecialists[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'MEDIUM',
      createdAt: now.toISOString(),
      dueDate: sevenDaysLater.toISOString(),
      context: {
        address,
        leadStatus: 'IN_PROGRESS'
      }
    }
  ]

  return tasks
}

// Создать задачу при загрузке документа
export function createDocumentReviewTask(
  documentId: string,
  documentName: string,
  leadId: string,
  address: string,
  users: User[]
): Task | null {
  const documentSpecialists = getUsersByRole(users, 'DOCUMENT_SPECIALIST')
  if (documentSpecialists.length === 0) return null

  const now = new Date()
  const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

  return {
    id: `task-${Date.now()}`,
    title: `Проверить документ: ${documentName}`,
    description: `Проверить загруженный документ на комплектность и корректность`,
    type: 'REVIEW_DOCUMENTS',
    leadId,
    documentId,
    assignedTo: [documentSpecialists[0].id],
    createdBy: 'system',
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: now.toISOString(),
    dueDate: twoDaysLater.toISOString(),
    context: {
      address
    }
  }
}

// Создать задачу при переводе на этап обследования
export function createInspectionTask(
  leadId: string,
  address: string,
  users: User[]
): Task | null {
  const inspectors = getUsersByRole(users, 'TECHNICAL_INSPECTOR')
  if (inspectors.length === 0) return null

  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  return {
    id: `task-${Date.now()}`,
    title: `Назначить дату обследования: ${address}`,
    description: `Согласовать с клиентом удобную дату и время для технического обследования здания`,
    type: 'SCHEDULE_INSPECTION',
    leadId,
    assignedTo: [inspectors[0].id],
    createdBy: 'system',
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: now.toISOString(),
    dueDate: threeDaysLater.toISOString(),
    context: {
      address,
      leadStage: 'Обследование'
    }
  }
}

// Создать задачи при переводе лида на голосование
export function createVotingPreparationTasks(
  leadId: string,
  address: string,
  users: User[]
): Task[] {
  const votingCoordinators = getUsersByRole(users, 'VOTING_COORDINATOR')
  if (votingCoordinators.length === 0) return []

  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)

  const tasks: Task[] = [
    {
      id: `task-${Date.now()}-1`,
      title: `Создать голосование в системе: ${address}`,
      description: `Создать новое голосование, настроить параметры и даты`,
      type: 'CREATE_VOTING',
      leadId,
      assignedTo: [votingCoordinators[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: now.toISOString(),
      dueDate: threeDaysLater.toISOString(),
      context: {
        address,
        leadStatus: 'VOTING'
      }
    },
    {
      id: `task-${Date.now()}-2`,
      title: `Зарегистрировать в ГИС ЖКХ: ${address}`,
      description: `Зарегистрировать голосование в системе ГИС ЖКХ`,
      type: 'REGISTER_GISZHKH',
      leadId,
      assignedTo: [votingCoordinators[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: now.toISOString(),
      dueDate: fiveDaysLater.toISOString(),
      context: {
        address,
        leadStatus: 'VOTING'
      }
    }
  ]

  return tasks
}

// Создать задачи при создании голосования
export function createVotingTasks(
  votingId: string,
  address: string,
  users: User[]
): Task[] {
  const votingManagers = getUsersByRole(users, 'VOTING_MANAGER')
  if (votingManagers.length === 0) return []

  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)

  const tasks: Task[] = [
    {
      id: `task-${Date.now()}-1`,
      title: `Добавить данные квартир: ${address}`,
      description: `Внести информацию о квартирах и собственниках в систему`,
      type: 'ADD_APARTMENTS',
      votingId,
      assignedTo: [votingManagers[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: now.toISOString(),
      dueDate: threeDaysLater.toISOString(),
      context: {
        address
      }
    },
    {
      id: `task-${Date.now()}-2`,
      title: `Связаться с собственниками: ${address}`,
      description: `Обзвонить собственников квартир, разъяснить процедуру голосования`,
      type: 'CONTACT_OWNERS',
      votingId,
      assignedTo: [votingManagers[0].id],
      createdBy: 'system',
      status: 'PENDING',
      priority: 'MEDIUM',
      createdAt: now.toISOString(),
      dueDate: fiveDaysLater.toISOString(),
      context: {
        address
      }
    }
  ]

  return tasks
}

// Сохранить задачи в localStorage
export function saveTasks(tasks: Task[]): void {
  try {
    const existingTasks = JSON.parse(localStorage.getItem('construction_tasks') || '[]')
    const updatedTasks = [...existingTasks, ...tasks]
    localStorage.setItem('construction_tasks', JSON.stringify(updatedTasks))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

// Получить пользователей из localStorage
export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('construction_users') || '[]')
  } catch (error) {
    console.error('Error getting users:', error)
    return []
  }
}

// Автоматически создать задачи при создании лида
export function autoCreateTasksForNewLead(leadId: string, address: string, clientName: string, phone: string = ''): void {
  const users = getUsers()
  const tasks = createNewLeadTasks(leadId, address, clientName, users)
  if (tasks.length > 0) {
    saveTasks(tasks)
    // Отправить Telegram уведомления исполнителям
    tasks.forEach(task => {
      sendTelegramNotificationForTask(task)
    })
  }
  // Отправить уведомление о новом лиде
  sendTelegramNotificationForLead(leadId, address, clientName, phone)
}

// Автоматически создать задачи при переводе лида в работу
export function autoCreateTasksForInProgressLead(leadId: string, address: string): void {
  const users = getUsers()
  const tasks = createInProgressTasks(leadId, address, users)
  if (tasks.length > 0) {
    saveTasks(tasks)
  }
}

// Автоматически создать задачу при загрузке документа
export function autoCreateTaskForDocument(documentId: string, documentName: string, leadId: string, address: string): void {
  const users = getUsers()
  const task = createDocumentReviewTask(documentId, documentName, leadId, address, users)
  if (task) {
    saveTasks([task])
  }
}

// Автоматически создать задачу при переводе на обследование
export function autoCreateTaskForInspection(leadId: string, address: string): void {
  const users = getUsers()
  const task = createInspectionTask(leadId, address, users)
  if (task) {
    saveTasks([task])
  }
}

// Автоматически создать задачи при переводе на голосование
export function autoCreateTasksForVotingPreparation(leadId: string, address: string): void {
  const users = getUsers()
  const tasks = createVotingPreparationTasks(leadId, address, users)
  if (tasks.length > 0) {
    saveTasks(tasks)
  }
}

// Автоматически создать задачи при создании голосования
export function autoCreateTasksForVoting(votingId: string, address: string): void {
  const users = getUsers()
  const tasks = createVotingTasks(votingId, address, users)
  if (tasks.length > 0) {
    saveTasks(tasks)
    // Отправить Telegram уведомления исполнителям
    tasks.forEach(task => {
      sendTelegramNotificationForTask(task)
    })
  }
}

// ============= TELEGRAM УВЕДОМЛЕНИЯ =============

interface TelegramNotification {
  id: string
  userId: string
  type: 'TASK_ASSIGNED' | 'TASK_OVERDUE' | 'TASK_DEADLINE' | 'LEAD_CREATED' | 'VOTING_CREATED' | 'DOCUMENT_READY'
  message: string
  entityId: string
  entityType: 'task' | 'lead' | 'voting' | 'document'
  sentAt: string
  delivered: boolean
  error?: string
}

interface TelegramConnection {
  userId: string
  telegramId?: string
  username?: string
  connected: boolean
  lastNotification?: string
  notificationsEnabled: boolean
}

// Получить Telegram подключения
function getTelegramConnections(): TelegramConnection[] {
  try {
    return JSON.parse(localStorage.getItem('construction_telegram_connections') || '[]')
  } catch (error) {
    console.error('Error getting Telegram connections:', error)
    return []
  }
}

// Сохранить Telegram уведомления
function saveTelegramNotification(notification: TelegramNotification): void {
  try {
    const notifications = JSON.parse(localStorage.getItem('construction_telegram_notifications') || '[]')
    notifications.unshift(notification)
    localStorage.setItem('construction_telegram_notifications', JSON.stringify(notifications))
    
    // Обновить время последнего уведомления для пользователя
    const connections = getTelegramConnections()
    const updatedConnections = connections.map(conn => 
      conn.userId === notification.userId
        ? { ...conn, lastNotification: notification.sentAt }
        : conn
    )
    localStorage.setItem('construction_telegram_connections', JSON.stringify(updatedConnections))
  } catch (error) {
    console.error('Error saving Telegram notification:', error)
  }
}

// Форматировать дату для отображения
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Получить приоритет задачи текстом
function getPriorityText(priority: TaskPriority): string {
  const labels = {
    LOW: 'Низкий',
    MEDIUM: 'Средний',
    HIGH: 'Высокий',
    URGENT: 'Срочный'
  }
  return labels[priority]
}

// Отправить Telegram уведомление о назначении задачи
export function sendTelegramNotificationForTask(task: Task): void {
  const connections = getTelegramConnections()
  const users = getUsers()
  
  task.assignedTo.forEach(userId => {
    const connection = connections.find(c => c.userId === userId)
    const user = users.find(u => u.id === userId)
    
    // Проверяем, что пользователь подключен к Telegram и уведомления включены
    if (!connection?.connected || !connection?.notificationsEnabled) {
      return
    }
    
    // Формируем сообщение
    const message = `📋 Вам назначена новая задача: ${task.title}\n\n` +
      `📍 Адрес: ${task.context.address || '—'}\n` +
      `⏰ Срок: ${formatDate(task.dueDate)}\n` +
      `🔥 Приоритет: ${getPriorityText(task.priority)}\n\n` +
      `${task.description}`
    
    // Создаем уведомление
    const notification: TelegramNotification = {
      id: `notif-${Date.now()}-${userId}`,
      userId,
      type: 'TASK_ASSIGNED',
      message,
      entityId: task.id,
      entityType: 'task',
      sentAt: new Date().toISOString(),
      delivered: Math.random() > 0.05 // 95% успешности доставки (для демо)
    }
    
    saveTelegramNotification(notification)
    
    console.log(`Telegram уведомление отправлено ${user?.name} (${connection.username || connection.telegramId})`)
  })
}

// Отправить уведомление о создании лида
export function sendTelegramNotificationForLead(leadId: string, address: string, clientName: string, phone: string): void {
  const connections = getTelegramConnections()
  const users = getUsers()
  const salesManagers = getUsersByRole(users, 'SALES_MANAGER')
  
  salesManagers.forEach(manager => {
    const connection = connections.find(c => c.userId === manager.id)
    
    if (!connection?.connected || !connection?.notificationsEnabled) {
      return
    }
    
    const message = `🏢 Новый лид: ${address}\n\n` +
      `👤 Контакт: ${clientName}\n` +
      `📞 Телефон: ${phone}`
    
    const notification: TelegramNotification = {
      id: `notif-${Date.now()}-${manager.id}`,
      userId: manager.id,
      type: 'LEAD_CREATED',
      message,
      entityId: leadId,
      entityType: 'lead',
      sentAt: new Date().toISOString(),
      delivered: Math.random() > 0.05
    }
    
    saveTelegramNotification(notification)
    console.log(`Telegram уведомление о лиде отправлено ${manager.name}`)
  })
}

// Отправить уведомление о создании голосования
export function sendTelegramNotificationForVoting(votingId: string, address: string, startDate: string, endDate: string): void {
  const connections = getTelegramConnections()
  const users = getUsers()
  const votingStaff = [
    ...getUsersByRole(users, 'VOTING_MANAGER'),
    ...getUsersByRole(users, 'VOTING_COORDINATOR')
  ]
  
  votingStaff.forEach(staff => {
    const connection = connections.find(c => c.userId === staff.id)
    
    if (!connection?.connected || !connection?.notificationsEnabled) {
      return
    }
    
    const message = `🗳️ Создано новое голосование\n\n` +
      `📍 Адрес: ${address}\n` +
      `📅 Начало: ${formatDate(startDate)}\n` +
      `📅 Конец: ${formatDate(endDate)}`
    
    const notification: TelegramNotification = {
      id: `notif-${Date.now()}-${staff.id}`,
      userId: staff.id,
      type: 'VOTING_CREATED',
      message,
      entityId: votingId,
      entityType: 'voting',
      sentAt: new Date().toISOString(),
      delivered: Math.random() > 0.05
    }
    
    saveTelegramNotification(notification)
    console.log(`Telegram уведомление о голосовании отправлено ${staff.name}`)
  })
}

