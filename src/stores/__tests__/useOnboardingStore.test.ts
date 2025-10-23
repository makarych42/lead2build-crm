import { renderHook, act } from '@testing-library/react'
import { useOnboardingStore } from '../useOnboardingStore'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useOnboardingStore', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useOnboardingStore())

    expect(result.current.isActive).toBe(false)
    expect(result.current.currentStep).toBe(0)
    expect(result.current.showWelcomeModal).toBe(false)
    expect(result.current.showChecklist).toBe(false)
    expect(result.current.isInitialized).toBe(false)
  })

  it('should start tour', () => {
    const { result } = renderHook(() => useOnboardingStore())

    act(() => {
      result.current.startTour('dashboard')
    })

    expect(result.current.isActive).toBe(true)
    expect(result.current.currentTour?.id).toBe('dashboard')
    expect(result.current.currentStep).toBe(0)
    expect(result.current.showWelcomeModal).toBe(false)
  })

  it('should stop tour', () => {
    const { result } = renderHook(() => useOnboardingStore())

    // Start tour first
    act(() => {
      result.current.startTour('dashboard')
    })

    // Then stop it
    act(() => {
      result.current.stopTour()
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.currentTour).toBeUndefined()
    expect(result.current.currentStep).toBe(0)
  })

  it('should navigate steps', () => {
    const { result } = renderHook(() => useOnboardingStore())

    act(() => {
      result.current.startTour('dashboard')
    })

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.currentStep).toBe(1)

    act(() => {
      result.current.prevStep()
    })

    expect(result.current.currentStep).toBe(0)
  })

  it('should mark tour as completed', () => {
    const { result } = renderHook(() => useOnboardingStore())

    act(() => {
      result.current.markTourCompleted('dashboard')
    })

    expect(result.current.progress.completedTours).toContain('dashboard')
    expect(result.current.progress.totalProgress).toBeGreaterThan(0)
  })

  it('should show welcome modal', () => {
    const { result } = renderHook(() => useOnboardingStore())

    act(() => {
      result.current.showWelcomeModal()
    })

    expect(result.current.showWelcomeModal).toBe(true)
  })

  it('should hide welcome modal', () => {
    const { result } = renderHook(() => useOnboardingStore())

    // Show first
    act(() => {
      result.current.showWelcomeModal()
    })

    // Then hide
    act(() => {
      result.current.hideWelcomeModal()
    })

    expect(result.current.showWelcomeModal).toBe(false)
  })

  it('should toggle checklist', () => {
    const { result } = renderHook(() => useOnboardingStore())

    expect(result.current.showChecklist).toBe(false)

    act(() => {
      result.current.toggleChecklist()
    })

    expect(result.current.showChecklist).toBe(true)

    act(() => {
      result.current.toggleChecklist()
    })

    expect(result.current.showChecklist).toBe(false)
  })

  it('should initialize onboarding', () => {
    const { result } = renderHook(() => useOnboardingStore())

    act(() => {
      result.current.initializeOnboarding('SALES_MANAGER')
    })

    expect(result.current.isInitialized).toBe(true)
    expect(result.current.showWelcomeModal).toBe(true)
    expect(result.current.showChecklist).toBe(true)
  })

  it('should reset onboarding', () => {
    const { result } = renderHook(() => useOnboardingStore())

    // Set some state first
    act(() => {
      result.current.startTour('dashboard')
      result.current.showWelcomeModal()
    })

    // Then reset
    act(() => {
      result.current.resetOnboarding()
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.showWelcomeModal).toBe(false)
    expect(result.current.isInitialized).toBe(false)
  })
})
