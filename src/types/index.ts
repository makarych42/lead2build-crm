// ============= ОБЩИЕ ТИПЫ =============

export type UserRole = 
  | 'SALES_MANAGER' 
  | 'DOCUMENT_SPECIALIST' 
  | 'TECHNICAL_INSPECTOR' 
  | 'VOTING_COORDINATOR' 
  | 'VOTING_MANAGER' 
  | 'ADMIN'

export type TaskType = 
  // По лидам
  | 'CONTACT_CLIENT' 
  | 'CONDUCT_CONSULTATION' 
  | 'CLARIFY_DETAILS' 
  | 'MOVE_TO_NEXT_STAGE'
  // По документам
  | 'PREPARE_PROPOSAL' 
  | 'REQUEST_REGISTRY' 
  | 'PREPARE_KT_SCHEME' 
  | 'UPLOAD_DOCUMENTS' 
  | 'REVIEW_DOCUMENTS' 
  | 'APPROVE_DOCUMENTS'
  // По обследованию
  | 'SCHEDULE_INSPECTION' 
  | 'CONDUCT_INSPECTION' 
  | 'PREPARE_REPORT' 
  | 'APPROVE_TECHNICAL'
  // По голосованию
  | 'REQUEST_OWNER_REGISTRY' 
  | 'REGISTER_GISZHKH' 
  | 'CREATE_VOTING' 
  | 'PREPARE_BALLOTS'
  | 'SCHEDULE_VOTING' 
  | 'ADD_APARTMENTS' 
  | 'CONTACT_OWNERS' 
  | 'COLLECT_VOTES'
  | 'HANDLE_OBJECTIONS' 
  | 'PREPARE_PROTOCOL'
  // Общие
  | 'DEADLINE_REMINDER' 
  | 'OVERDUE_TASK' 
  | 'CUSTOM'

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'VOTING' | 'COMPLETED' | 'REJECTED'
export type LeadStage = 
  | 'INITIAL_CONSULTATION'
  | 'DOCUMENT_PREPARATION'
  | 'INSPECTION'
  | 'VOTING_ORGANIZATION'
  | 'VOTING_PROCESS'
  | 'CONDITION_VERIFICATION'
  | 'CONSTRUCTION_READY'

export type VotingStatus = 'PREPARATION' | 'ACTIVE' | 'COMPLETED' | 'FAILED'
export type VotingForm = 'MEETING' | 'ABSENTEE' | 'MIXED'
export type VoteStatus = 'FOR' | 'AGAINST' | 'ABSTAINED' | 'NOT_VOTED' | 'NO_CONTACT'

export type DocumentType = 
  | 'complex_proposal'
  | 'owners_registry'
  | 'kt_scheme'
  | 'voting_docs'
  | 'tko_docs'

export type DocumentStatus = 'pending' | 'uploaded' | 'approved' | 'rejected'

export type NotificationType = 
  | 'TASK_ASSIGNED' 
  | 'TASK_OVERDUE' 
  | 'TASK_DEADLINE' 
  | 'LEAD_CREATED' 
  | 'VOTING_CREATED' 
  | 'DOCUMENT_READY'

export type EntityType = 'task' | 'lead' | 'voting' | 'document'

// ============= ИНТЕРФЕЙСЫ =============

export interface User {
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
  // Onboarding fields
  onboardingCompleted?: boolean
  onboardingProgress?: Record<string, boolean>
  preferredTourStyle?: 'full' | 'minimal'
}

export interface Lead {
  id: string
  address: string
  city: string
  contactPerson: string
  contactPhone: string
  contactEmail?: string | null
  source: string
  status: LeadStatus
  currentStage: LeadStage
  createdAt: string
  buildingType?: string | null
  floorsCount?: number | null
  apartmentsCount?: number | null
}

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  
  // Привязка к сущностям
  leadId?: string
  votingId?: string
  documentId?: string
  apartmentId?: string
  
  // Исполнители
  assignedTo: string[] // User IDs
  createdBy: string // User ID
  
  // Статус и приоритет
  status: TaskStatus
  priority: TaskPriority
  
  // Сроки
  createdAt: string
  dueDate: string
  completedAt?: string
  
  // Дополнительная информация
  notes?: string
  attachments?: string[]
  
  // Контекст
  context: {
    address?: string
    leadStatus?: string
    leadStage?: string
    clientName?: string
  }
}

export interface Apartment {
  id: string
  number: string
  ownerName: string
  area: number
  phone?: string
  email?: string
  notes?: string
  voteStatus: VoteStatus
}

export interface Voting {
  id: string
  leadId: string
  address: string
  registryRequested?: string
  registryReceived?: string
  giszhkhRegistered?: string
  votingForm?: VotingForm
  votingStartDate?: string
  votingEndDate?: string
  requiredVotes?: number
  currentVotes: number
  votesPercent: number
  status: VotingStatus
  failureReason?: string
  apartmentsCount?: number
  ownersNames?: string
  apartments?: Apartment[]
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  leadId: string
  uploadedAt: string
  status: DocumentStatus
  uploadedBy?: string
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  fileData?: string
}

export interface TelegramConnection {
  userId: string
  telegramId?: string
  username?: string
  connected: boolean
  lastNotification?: string
  notificationsEnabled: boolean
}

export interface TelegramNotification {
  id: string
  userId: string
  type: NotificationType
  message: string
  entityId: string
  entityType: EntityType
  sentAt: string
  delivered: boolean
  error?: string
}

export interface TelegramSettings {
  botToken: string
  webhookUrl: string
  notificationsEnabled: boolean
}

export interface AutomationRule {
  id: string
  name: string
  trigger: 'TASK_CREATED' | 'TASK_OVERDUE' | 'TASK_DUE_SOON' | 'LEAD_CREATED' | 'LEAD_STAGE_CHANGE' | 'VOTING_CREATED' | 'DOCUMENT_UPLOADED' | 'DOCUMENT_READY'
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

export interface CompanySettings {
  name: string
  email: string
  phone: string
  address: string
  logo?: string
}

export interface SystemSettings {
  autoCreateTasks: boolean
  dateFormat: 'DD.MM.YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timezone: string
  language: 'ru' | 'en'
}

export interface NotificationSettings {
  email: boolean
  telegram: boolean
  sound: boolean
  desktop: boolean
}

// ============= КОНСТАНТЫ =============

export const ROLE_LABELS: Record<UserRole, string> = {
  SALES_MANAGER: 'Менеджер по продажам',
  DOCUMENT_SPECIALIST: 'Специалист по документообороту',
  TECHNICAL_INSPECTOR: 'Инженер-инспектор',
  VOTING_COORDINATOR: 'Организатор голосований',
  VOTING_MANAGER: 'Координатор голосования',
  ADMIN: 'Администратор'
}

export const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  SALES_MANAGER: 'bg-blue-100 text-blue-800',
  DOCUMENT_SPECIALIST: 'bg-green-100 text-green-800',
  TECHNICAL_INSPECTOR: 'bg-orange-100 text-orange-800',
  VOTING_COORDINATOR: 'bg-indigo-100 text-indigo-800',
  VOTING_MANAGER: 'bg-pink-100 text-pink-800'
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: 'Полный доступ ко всем разделам, управление пользователями и настройками',
  SALES_MANAGER: 'Создание и управление лидами, первичная консультация с клиентами',
  DOCUMENT_SPECIALIST: 'Управление документами, подготовка предложений, проверка документов',
  TECHNICAL_INSPECTOR: 'Технические обследования, составление отчетов, согласование',
  VOTING_COORDINATOR: 'Создание голосований, регистрация в ГИС ЖКХ, подготовка документов',
  VOTING_MANAGER: 'Работа с собственниками, сбор голосов, подготовка протоколов'
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  URGENT: 'Срочный'
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершена',
  CANCELLED: 'Отменена',
  OVERDUE: 'Просрочена'
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  OVERDUE: 'bg-red-100 text-red-800'
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Новый',
  IN_PROGRESS: 'В работе',
  VOTING: 'Голосование',
  COMPLETED: 'Завершен',
  REJECTED: 'Отклонен'
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  VOTING: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
}

export const VOTING_STATUS_LABELS: Record<VotingStatus, string> = {
  PREPARATION: 'Подготовка',
  ACTIVE: 'Активное',
  COMPLETED: 'Завершено',
  FAILED: 'Неуспешное'
}

export const VOTING_STATUS_COLORS: Record<VotingStatus, string> = {
  PREPARATION: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800'
}

export const VOTE_STATUS_LABELS: Record<VoteStatus, string> = {
  FOR: 'За',
  AGAINST: 'Против',
  ABSTAINED: 'Воздержался',
  NOT_VOTED: 'Не голосовал',
  NO_CONTACT: 'Не дозвон'
}

export const VOTE_STATUS_COLORS: Record<VoteStatus, string> = {
  FOR: 'bg-green-100 text-green-800',
  AGAINST: 'bg-red-100 text-red-800',
  ABSTAINED: 'bg-gray-100 text-gray-800',
  NOT_VOTED: 'bg-yellow-100 text-yellow-800',
  NO_CONTACT: 'bg-orange-100 text-orange-800'
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  TASK_ASSIGNED: 'Задача назначена',
  TASK_OVERDUE: 'Задача просрочена',
  TASK_DEADLINE: 'Приближение дедлайна',
  LEAD_CREATED: 'Новый лид',
  VOTING_CREATED: 'Голосование создано',
  DOCUMENT_READY: 'Документ готов'
}

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  TASK_ASSIGNED: '📋',
  TASK_OVERDUE: '⚠️',
  TASK_DEADLINE: '⏰',
  LEAD_CREATED: '🏢',
  VOTING_CREATED: '🗳️',
  DOCUMENT_READY: '📄'
}

