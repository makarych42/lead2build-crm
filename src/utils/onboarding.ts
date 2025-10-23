import { UserRole, User } from '@/types'
import { 
  OnboardingProgress, 
  OnboardingTour, 
  ONBOARDING_TOURS,
  ROLE_DESCRIPTIONS 
} from '@/types/onboarding'
import { getToursForRole, getWelcomeMessage, getRoleDescription } from '@/config/onboarding-tours'

// ============= ОСНОВНЫЕ УТИЛИТЫ =============

/**
 * Получить туры для конкретной роли пользователя
 */
export const getRoleBasedTours = (role: UserRole): OnboardingTour[] => {
  return getToursForRole(role)
}

/**
 * Вычислить прогресс онбординга пользователя
 */
export const calculateOnboardingProgress = (user: User): OnboardingProgress => {
  const userRole = user.role as UserRole
  const availableTours = getToursForRole(userRole)
  const completedTours = user.onboardingProgress ? 
    Object.keys(user.onboardingProgress).filter(tourId => user.onboardingProgress![tourId]) : 
    []

  const totalTours = availableTours.length
  const totalProgress = totalTours > 0 ? Math.round((completedTours.length / totalTours) * 100) : 0

  return {
    completedTours,
    completedSteps: {},
    totalProgress,
    lastCompletedAt: user.lastLogin
  }
}

/**
 * Определить, нужно ли показать приветственное модальное окно
 */
export const shouldShowWelcomeModal = (user: User): boolean => {
  // Показываем модалку если:
  // 1. Пользователь не завершил онбординг
  // 2. У пользователя не установлена роль
  // 3. Пользователь не прошел ни одного тура
  return !user.onboardingCompleted && 
         (!user.role || 
          !user.onboardingProgress || 
          Object.keys(user.onboardingProgress).length === 0)
}

/**
 * Отметить тур как завершенный
 */
export const markTourAsCompleted = (tourId: string, user: User): User => {
  const updatedProgress = {
    ...user.onboardingProgress,
    [tourId]: true
  }

  // Проверяем, завершены ли все обязательные туры
  const userRole = user.role as UserRole
  const availableTours = getToursForRole(userRole)
  const requiredTours = availableTours.filter(tour => tour.required)
  const completedRequiredTours = requiredTours.filter(tour => updatedProgress[tour.id])
  
  const onboardingCompleted = completedRequiredTours.length === requiredTours.length

  return {
    ...user,
    onboardingProgress: updatedProgress,
    onboardingCompleted
  }
}

/**
 * Получить следующий незавершенный тур
 */
export const getNextIncompleteTour = (user: User): OnboardingTour | null => {
  if (!user.role) return null

  const userRole = user.role as UserRole
  const availableTours = getToursForRole(userRole)
  const completedTours = user.onboardingProgress ? 
    Object.keys(user.onboardingProgress).filter(tourId => user.onboardingProgress![tourId]) : 
    []

  return availableTours.find(tour => !completedTours.includes(tour.id)) || null
}

/**
 * Получить статистику прогресса по ролям
 */
export const getProgressStats = (user: User) => {
  const userRole = user.role as UserRole
  const availableTours = getToursForRole(userRole)
  const completedTours = user.onboardingProgress ? 
    Object.keys(user.onboardingProgress).filter(tourId => user.onboardingProgress![tourId]) : 
    []

  const requiredTours = availableTours.filter(tour => tour.required)
  const completedRequiredTours = requiredTours.filter(tour => 
    completedTours.includes(tour.id)
  )

  return {
    totalTours: availableTours.length,
    completedTours: completedTours.length,
    requiredTours: requiredTours.length,
    completedRequiredTours: completedRequiredTours.length,
    progressPercentage: availableTours.length > 0 ? 
      Math.round((completedTours.length / availableTours.length) * 100) : 0,
    isFullyCompleted: completedRequiredTours.length === requiredTours.length
  }
}

// ============= УТИЛИТЫ ДЛЯ РАБОТЫ С ТУРАМИ =============

/**
 * Проверить, доступен ли тур для роли
 */
export const isTourAvailableForRole = (tourId: string, role: UserRole): boolean => {
  const tours = getToursForRole(role)
  return tours.some(tour => tour.id === tourId)
}

/**
 * Получить информацию о туре
 */
export const getTourInfo = (tourId: string, role: UserRole) => {
  const tours = getToursForRole(role)
  const tour = tours.find(t => t.id === tourId)
  
  if (!tour) return null

  return {
    ...tour,
    isCompleted: false, // Будет установлено извне
    isRequired: tour.required || false,
    estimatedTime: tour.steps.length * 2 // Примерно 2 минуты на шаг
  }
}

/**
 * Получить рекомендуемый порядок туров
 */
export const getRecommendedTourOrder = (role: UserRole): string[] => {
  const tours = getToursForRole(role)
  return tours
    .sort((a, b) => a.order - b.order)
    .map(tour => tour.id)
}

// ============= УТИЛИТЫ ДЛЯ РАБОТЫ С ШАГАМИ =============

/**
 * Проверить, существует ли элемент для тура
 */
export const isTourTargetAvailable = (target: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const element = document.querySelector(target)
  return element !== null
}

/**
 * Ждать появления элемента для тура
 */
export const waitForTourTarget = (target: string, timeout = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isTourTargetAvailable(target)) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      if (isTourTargetAvailable(target)) {
        clearInterval(interval)
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        resolve(false)
      }
    }, 100)
  })
}

/**
 * Прокрутить к элементу тура
 */
export const scrollToTourTarget = (target: string): void => {
  const element = document.querySelector(target)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'center'
    })
  }
}

// ============= УТИЛИТЫ ДЛЯ ЛОКАЛИЗАЦИИ =============

/**
 * Получить локализованное название тура
 */
export const getLocalizedTourName = (tourId: string): string => {
  const tourNames: Record<string, string> = {
    [ONBOARDING_TOURS.DASHBOARD]: 'Главная панель',
    [ONBOARDING_TOURS.LEADS]: 'Управление лидами',
    [ONBOARDING_TOURS.DOCUMENTS]: 'Управление документами',
    [ONBOARDING_TOURS.VOTING]: 'Организация голосований',
    [ONBOARDING_TOURS.ANALYTICS]: 'Аналитика и отчеты',
    [ONBOARDING_TOURS.TASKS]: 'Управление задачами',
    [ONBOARDING_TOURS.TELEGRAM]: 'Telegram интеграция',
    [ONBOARDING_TOURS.SETTINGS]: 'Настройки системы',
    [ONBOARDING_TOURS.WELCOME]: 'Приветствие'
  }

  return tourNames[tourId] || tourId
}

/**
 * Получить локализованное описание роли
 */
export const getLocalizedRoleDescription = (role: UserRole): string => {
  return ROLE_DESCRIPTIONS[role] || role
}

// ============= УТИЛИТЫ ДЛЯ АНАЛИТИКИ =============

/**
 * Создать событие для аналитики
 */
export const trackOnboardingEvent = (event: string, data?: Record<string, any>) => {
  // Здесь можно интегрировать с Google Analytics, Mixpanel и т.д.
  console.log('Onboarding Event:', event, data)
  
  // Пример интеграции с аналитикой
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      event_category: 'onboarding',
      ...data
    })
  }
}

/**
 * Отследить начало тура
 */
export const trackTourStart = (tourId: string, role: UserRole) => {
  trackOnboardingEvent('tour_started', {
    tour_id: tourId,
    user_role: role
  })
}

/**
 * Отследить завершение тура
 */
export const trackTourComplete = (tourId: string, role: UserRole, duration: number) => {
  trackOnboardingEvent('tour_completed', {
    tour_id: tourId,
    user_role: role,
    duration_seconds: duration
  })
}

/**
 * Отследить пропуск тура
 */
export const trackTourSkip = (tourId: string, role: UserRole, stepIndex: number) => {
  trackOnboardingEvent('tour_skipped', {
    tour_id: tourId,
    user_role: role,
    step_index: stepIndex
  })
}

// ============= УТИЛИТЫ ДЛЯ ПЕРСИСТЕНТНОСТИ =============

/**
 * Сохранить прогресс онбординга в localStorage
 */
export const saveOnboardingProgress = (progress: OnboardingProgress) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('lead2build_onboarding_progress', JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save onboarding progress:', error)
  }
}

/**
 * Загрузить прогресс онбординга из localStorage
 */
export const loadOnboardingProgress = (): OnboardingProgress | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const saved = localStorage.getItem('lead2build_onboarding_progress')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Failed to load onboarding progress:', error)
    return null
  }
}

/**
 * Очистить прогресс онбординга
 */
export const clearOnboardingProgress = () => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('lead2build_onboarding_progress')
  } catch (error) {
    console.error('Failed to clear onboarding progress:', error)
  }
}
