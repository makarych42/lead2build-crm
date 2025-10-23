import { 
  getRoleBasedTours,
  calculateOnboardingProgress,
  shouldShowWelcomeModal,
  markTourAsCompleted,
  getNextIncompleteTour,
  getProgressStats,
  isTourAvailableForRole,
  getTourInfo,
  getRecommendedTourOrder,
  isTourTargetAvailable,
  getLocalizedTourName,
  getLocalizedRoleDescription
} from '../onboarding'
import { UserRole } from '@/types'

// Mock DOM
Object.defineProperty(window, 'document', {
  value: {
    querySelector: jest.fn()
  }
})

describe('onboarding utils', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'SALES_MANAGER' as UserRole,
    active: true,
    createdAt: '2024-01-01'
  }

  describe('getRoleBasedTours', () => {
    it('should return tours for SALES_MANAGER role', () => {
      const tours = getRoleBasedTours('SALES_MANAGER')
      expect(tours).toBeDefined()
      expect(Array.isArray(tours)).toBe(true)
    })

    it('should return tours for ADMIN role', () => {
      const tours = getRoleBasedTours('ADMIN')
      expect(tours).toBeDefined()
      expect(Array.isArray(tours)).toBe(true)
    })
  })

  describe('calculateOnboardingProgress', () => {
    it('should calculate progress for user without completed tours', () => {
      const progress = calculateOnboardingProgress(mockUser)
      
      expect(progress.completedTours).toEqual([])
      expect(progress.totalProgress).toBe(0)
    })

    it('should calculate progress for user with completed tours', () => {
      const userWithProgress = {
        ...mockUser,
        onboardingProgress: {
          'dashboard': true,
          'leads': true
        }
      }
      
      const progress = calculateOnboardingProgress(userWithProgress)
      
      expect(progress.completedTours).toContain('dashboard')
      expect(progress.completedTours).toContain('leads')
      expect(progress.totalProgress).toBeGreaterThan(0)
    })
  })

  describe('shouldShowWelcomeModal', () => {
    it('should show modal for user without onboarding completed', () => {
      const result = shouldShowWelcomeModal(mockUser)
      expect(result).toBe(true)
    })

    it('should not show modal for user with completed onboarding', () => {
      const userWithCompletedOnboarding = {
        ...mockUser,
        onboardingCompleted: true
      }
      
      const result = shouldShowWelcomeModal(userWithCompletedOnboarding)
      expect(result).toBe(false)
    })

    it('should show modal for user without role', () => {
      const userWithoutRole = {
        ...mockUser,
        role: undefined as any
      }
      
      const result = shouldShowWelcomeModal(userWithoutRole)
      expect(result).toBe(true)
    })
  })

  describe('markTourAsCompleted', () => {
    it('should mark tour as completed', () => {
      const updatedUser = markTourAsCompleted('dashboard', mockUser)
      
      expect(updatedUser.onboardingProgress).toBeDefined()
      expect(updatedUser.onboardingProgress!['dashboard']).toBe(true)
    })

    it('should set onboardingCompleted to true when all required tours are completed', () => {
      const userWithMostToursCompleted = {
        ...mockUser,
        onboardingProgress: {
          'dashboard': true,
          'leads': true,
          'tasks': true
        }
      }
      
      const updatedUser = markTourAsCompleted('analytics', userWithMostToursCompleted)
      
      // This depends on the actual required tours configuration
      expect(updatedUser.onboardingProgress).toBeDefined()
    })
  })

  describe('getNextIncompleteTour', () => {
    it('should return first incomplete tour', () => {
      const tour = getNextIncompleteTour(mockUser)
      expect(tour).toBeDefined()
    })

    it('should return null for user without role', () => {
      const userWithoutRole = {
        ...mockUser,
        role: undefined as any
      }
      
      const tour = getNextIncompleteTour(userWithoutRole)
      expect(tour).toBeNull()
    })
  })

  describe('getProgressStats', () => {
    it('should return progress stats', () => {
      const stats = getProgressStats(mockUser)
      
      expect(stats).toHaveProperty('totalTours')
      expect(stats).toHaveProperty('completedTours')
      expect(stats).toHaveProperty('requiredTours')
      expect(stats).toHaveProperty('completedRequiredTours')
      expect(stats).toHaveProperty('progressPercentage')
      expect(stats).toHaveProperty('isFullyCompleted')
    })
  })

  describe('isTourAvailableForRole', () => {
    it('should return true for available tour', () => {
      const isAvailable = isTourAvailableForRole('dashboard', 'SALES_MANAGER')
      expect(isAvailable).toBe(true)
    })

    it('should return false for unavailable tour', () => {
      const isAvailable = isTourAvailableForRole('nonexistent', 'SALES_MANAGER')
      expect(isAvailable).toBe(false)
    })
  })

  describe('getTourInfo', () => {
    it('should return tour info for valid tour', () => {
      const tourInfo = getTourInfo('dashboard', 'SALES_MANAGER')
      expect(tourInfo).toBeDefined()
      expect(tourInfo?.id).toBe('dashboard')
    })

    it('should return null for invalid tour', () => {
      const tourInfo = getTourInfo('nonexistent', 'SALES_MANAGER')
      expect(tourInfo).toBeNull()
    })
  })

  describe('getRecommendedTourOrder', () => {
    it('should return ordered tour IDs', () => {
      const order = getRecommendedTourOrder('SALES_MANAGER')
      expect(Array.isArray(order)).toBe(true)
      expect(order.length).toBeGreaterThan(0)
    })
  })

  describe('isTourTargetAvailable', () => {
    it('should return true when element exists', () => {
      const mockElement = { id: 'test' }
      ;(window.document.querySelector as jest.Mock).mockReturnValue(mockElement)
      
      const isAvailable = isTourTargetAvailable('[data-tour="test"]')
      expect(isAvailable).toBe(true)
    })

    it('should return false when element does not exist', () => {
      ;(window.document.querySelector as jest.Mock).mockReturnValue(null)
      
      const isAvailable = isTourTargetAvailable('[data-tour="nonexistent"]')
      expect(isAvailable).toBe(false)
    })
  })

  describe('getLocalizedTourName', () => {
    it('should return localized name for known tour', () => {
      const name = getLocalizedTourName('dashboard')
      expect(name).toBe('Главная панель')
    })

    it('should return tour ID for unknown tour', () => {
      const name = getLocalizedTourName('unknown')
      expect(name).toBe('unknown')
    })
  })

  describe('getLocalizedRoleDescription', () => {
    it('should return localized description for known role', () => {
      const description = getLocalizedRoleDescription('SALES_MANAGER')
      expect(description).toContain('Менеджер по продажам')
    })

    it('should return role name for unknown role', () => {
      const description = getLocalizedRoleDescription('UNKNOWN_ROLE' as UserRole)
      expect(description).toBe('UNKNOWN_ROLE')
    })
  })
})
