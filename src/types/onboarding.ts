import { UserRole } from './index'

// ============= ТИПЫ ДЛЯ ОНБОРДИНГА =============

export interface OnboardingStep {
  target: string
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  title?: string
  disableBeacon?: boolean
  hideCloseButton?: boolean
  hideFooter?: boolean
  spotlightClicks?: boolean
  spotlightPadding?: number
  styles?: {
    options?: {
      primaryColor?: string
      textColor?: string
      backgroundColor?: string
      overlayColor?: string
      spotlightShadow?: string
      beaconSize?: number
      zIndex?: number
    }
  }
  locale?: {
    back?: string
    close?: string
    last?: string
    next?: string
    skip?: string
  }
}

export interface OnboardingTour {
  id: string
  name: string
  description: string
  steps: OnboardingStep[]
  roles: UserRole[]
  required?: boolean
  order: number
}

export interface OnboardingProgress {
  completedTours: string[]
  currentTour?: string
  currentStep?: number
  completedSteps: Record<string, number[]>
  lastCompletedAt?: string
  totalProgress: number
}

export interface RoleBasedTour {
  role: UserRole
  tours: OnboardingTour[]
  welcomeMessage: string
  description: string
}

export interface OnboardingState {
  isActive: boolean
  currentTour?: OnboardingTour
  currentStep: number
  progress: OnboardingProgress
  showWelcomeModal: boolean
  showChecklist: boolean
  isInitialized: boolean
}

export interface OnboardingActions {
  // Tour management
  startTour: (tourId: string) => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  
  // Progress management
  markTourCompleted: (tourId: string) => void
  markStepCompleted: (tourId: string, stepIndex: number) => void
  updateProgress: (progress: Partial<OnboardingProgress>) => void
  
  // UI management
  showWelcomeModal: () => void
  hideWelcomeModal: () => void
  toggleChecklist: () => void
  
  // Initialization
  initializeOnboarding: (userRole: UserRole) => void
  resetOnboarding: () => void
}

export type OnboardingStore = OnboardingState & OnboardingActions

// ============= КОНСТАНТЫ =============

export const ONBOARDING_TOURS = {
  DASHBOARD: 'dashboard',
  LEADS: 'leads',
  DOCUMENTS: 'documents',
  VOTING: 'voting',
  ANALYTICS: 'analytics',
  TASKS: 'tasks',
  TELEGRAM: 'telegram',
  SETTINGS: 'settings',
  WELCOME: 'welcome'
} as const

export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  NAVIGATION: 'navigation',
  CREATE_LEAD: 'create-lead',
  VIEW_LEADS: 'view-leads',
  UPLOAD_DOCUMENT: 'upload-document',
  CREATE_VOTING: 'create-voting',
  VIEW_ANALYTICS: 'view-analytics',
  MANAGE_TASKS: 'manage-tasks',
  TELEGRAM_SETUP: 'telegram-setup',
  USER_SETTINGS: 'user-settings'
} as const

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SALES_MANAGER: 'Менеджер по продажам - работа с лидами, консультации, ведение клиентов',
  DOCUMENT_SPECIALIST: 'Специалист по документам - подготовка и обработка документов',
  TECHNICAL_INSPECTOR: 'Технический инспектор - проведение обследований и технических проверок',
  VOTING_COORDINATOR: 'Координатор голосований - организация и проведение голосований жильцов',
  VOTING_MANAGER: 'Менеджер голосований - управление процессом голосований',
  ADMIN: 'Администратор - полный доступ ко всем функциям системы'
}
