import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserRole } from '@/types'
import { 
  OnboardingState, 
  OnboardingActions, 
  OnboardingStore, 
  OnboardingProgress,
  OnboardingTour,
  ONBOARDING_TOURS
} from '@/types/onboarding'

const initialState: OnboardingState = {
  isActive: false,
  currentStep: 0,
  progress: {
    completedTours: [],
    completedSteps: {},
    totalProgress: 0
  },
  showWelcomeModal: false,
  showChecklist: false,
  isInitialized: false
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Tour management
      startTour: (tourId: string) => {
        const state = get()
        set({
          isActive: true,
          currentTour: { id: tourId } as OnboardingTour,
          currentStep: 0
        })
        state.hideWelcomeModalAction()
      },

      stopTour: () => {
        set({
          isActive: false,
          currentTour: undefined,
          currentStep: 0
        })
      },

      nextStep: () => {
        const state = get()
        if (state.currentTour) {
          set({ currentStep: state.currentStep + 1 })
        }
      },

      prevStep: () => {
        const state = get()
        if (state.currentStep > 0) {
          set({ currentStep: state.currentStep - 1 })
        }
      },

      skipTour: () => {
        const state = get()
        if (state.currentTour) {
          get().markTourCompleted(state.currentTour.id)
          get().stopTour()
        }
      },

      // Progress management
      markTourCompleted: (tourId: string) => {
        const state = get()
        const completedTours = [...state.progress.completedTours]
        
        if (!completedTours.includes(tourId)) {
          completedTours.push(tourId)
        }

        const totalTours = Object.keys(ONBOARDING_TOURS).length
        const totalProgress = Math.round((completedTours.length / totalTours) * 100)

        set({
          progress: {
            ...state.progress,
            completedTours,
            totalProgress,
            lastCompletedAt: new Date().toISOString()
          }
        })
      },

      markStepCompleted: (tourId: string, stepIndex: number) => {
        const state = get()
        const completedSteps = { ...state.progress.completedSteps }
        
        if (!completedSteps[tourId]) {
          completedSteps[tourId] = []
        }
        
        if (!completedSteps[tourId].includes(stepIndex)) {
          completedSteps[tourId].push(stepIndex)
        }

        set({
          progress: {
            ...state.progress,
            completedSteps
          }
        })
      },

      updateProgress: (progressUpdate: Partial<OnboardingProgress>) => {
        const state = get()
        set({
          progress: {
            ...state.progress,
            ...progressUpdate
          }
        })
      },

      // UI management
      showWelcomeModalAction: () => {
        set({ showWelcomeModal: true })
      },

      hideWelcomeModalAction: () => {
        set({ showWelcomeModal: false })
      },

      toggleChecklistAction: () => {
        const state = get()
        set({ showChecklist: !state.showChecklist })
      },

      // Initialization
      initializeOnboarding: (userRole: UserRole) => {
        const state = get()
        
        if (state.isInitialized) return

        set({
          isInitialized: true,
          showWelcomeModal: true
        })
      },

      resetOnboarding: () => {
        set(initialState)
      }
    }),
    {
      name: 'lead2build_onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        progress: state.progress,
        isInitialized: state.isInitialized,
        showWelcomeModal: state.showWelcomeModal
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      }
    }
  )
)

// Селекторы для удобного использования
export const useOnboardingProgress = () => {
  const progress = useOnboardingStore(state => state.progress)
  return progress
}

export const useOnboardingActions = () => {
  const actions = useOnboardingStore(state => ({
    startTour: state.startTour,
    stopTour: state.stopTour,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    skipTour: state.skipTour,
    markTourCompleted: state.markTourCompleted,
    markStepCompleted: state.markStepCompleted,
    updateProgress: state.updateProgress,
    showWelcomeModalAction: state.showWelcomeModalAction,
    hideWelcomeModalAction: state.hideWelcomeModalAction,
    toggleChecklistAction: state.toggleChecklistAction,
    initializeOnboarding: state.initializeOnboarding,
    resetOnboarding: state.resetOnboarding
  }))
  return actions
}

export const useOnboardingState = () => {
  const state = useOnboardingStore(state => ({
    isActive: state.isActive,
    currentTour: state.currentTour,
    currentStep: state.currentStep,
    showWelcomeModal: state.showWelcomeModal,
    showChecklist: state.showChecklist,
    isInitialized: state.isInitialized
  }))
  return state
}
