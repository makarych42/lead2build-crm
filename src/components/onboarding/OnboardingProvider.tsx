'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride'

// Динамический импорт Joyride для избежания ошибок гидратации
const Joyride = dynamic(() => import('react-joyride'), {
  ssr: false,
  loading: () => null
})
import { useOnboardingStore, useOnboardingState, useOnboardingActions } from '@/stores/useOnboardingStore'
import { useUsersStore } from '@/stores/useUsersStore'
import { getToursForRole } from '@/config/onboarding-tours'
import { UserRole } from '@/types'

interface OnboardingContextType {
  isActive: boolean
  currentTour: any
  currentStep: number
  startTour: (tourId: string) => void
  stopTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: React.ReactNode
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { getCurrentUser } = useUsersStore()
  const onboardingState = useOnboardingState()
  const onboardingActions = useOnboardingActions()
  
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentTourId, setCurrentTourId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const currentUser = getCurrentUser()

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Инициализация онбординга при загрузке
  useEffect(() => {
    if (currentUser && !onboardingState.isInitialized) {
      onboardingActions.initializeOnboarding(currentUser.role as UserRole)
    }
  }, [currentUser?.id, onboardingState.isInitialized])

  // Обновление шагов при смене тура
  useEffect(() => {
    if (onboardingState.currentTour && currentUser) {
      const tours = getToursForRole(currentUser.role as UserRole)
      const tour = tours.find(t => t.id === onboardingState.currentTour?.id)
      
      if (tour) {
        setSteps(tour.steps)
        setCurrentTourId(tour.id)
        setRun(true)
      }
    } else {
      setRun(false)
      setSteps([])
      setCurrentTourId(null)
    }
  }, [onboardingState.currentTour?.id, currentUser?.id])

  // Обработка событий Joyride
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      if (action === 'next' || action === 'prev') {
        onboardingActions.nextStep()
      }
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (currentTourId) {
        onboardingActions.markTourCompleted(currentTourId)
      }
      onboardingActions.stopTour()
    }

    if (status === STATUS.ERROR) {
      console.error('Joyride error:', data)
      onboardingActions.stopTour()
    }
  }

  // Методы управления турами
  const startTour = (tourId: string) => {
    onboardingActions.startTour(tourId)
  }

  const stopTour = () => {
    onboardingActions.stopTour()
  }

  const nextStep = () => {
    onboardingActions.nextStep()
  }

  const prevStep = () => {
    onboardingActions.prevStep()
  }

  const skipTour = () => {
    onboardingActions.skipTour()
  }

  const contextValue: OnboardingContextType = {
    isActive: onboardingState.isActive,
    currentTour: onboardingState.currentTour,
    currentStep: onboardingState.currentStep,
    startTour,
    stopTour,
    nextStep,
    prevStep,
    skipTour
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      
      {isClient && (
        <Joyride
          steps={steps}
          run={run}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#3B82F6',
              textColor: '#1F2937',
              backgroundColor: '#FFFFFF',
              overlayColor: 'rgba(0, 0, 0, 0.4)',
              spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
              beaconSize: 36,
              zIndex: 1000,
            },
            tooltip: {
              borderRadius: 8,
              fontSize: 14,
              padding: 20,
            },
            tooltipContainer: {
              textAlign: 'left',
            },
            tooltipTitle: {
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            },
            tooltipContent: {
              padding: '8px 0',
            },
            tooltipFooter: {
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid #E5E7EB',
            },
            buttonNext: {
              backgroundColor: '#3B82F6',
              borderRadius: 6,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 500,
              padding: '8px 16px',
            },
            buttonBack: {
              color: '#6B7280',
              fontSize: 14,
              marginRight: 8,
            },
            buttonSkip: {
              color: '#6B7280',
              fontSize: 14,
            },
            buttonClose: {
              color: '#6B7280',
              fontSize: 14,
            },
          }}
          locale={{
            back: 'Назад',
            close: 'Закрыть',
            last: 'Завершить',
            next: 'Далее',
            skip: 'Пропустить',
          }}
          disableOverlayClose
          disableCloseOnEsc={false}
          hideCloseButton={false}
          disableScrolling={false}
          scrollToFirstStep
          spotlightClicks={false}
          spotlightPadding={4}
        />
      )}
    </OnboardingContext.Provider>
  )
}
