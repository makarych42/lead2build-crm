'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Динамический импорт Joyride
const Joyride = dynamic(() => import('react-joyride'), {
  ssr: false,
  loading: () => null
})

interface OnboardingContextType {
  isActive: boolean
  startTour: (tourId: string) => void
  stopTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within SimpleOnboardingProvider')
  }
  return context
}

interface SimpleOnboardingProviderProps {
  children: React.ReactNode
}

export const SimpleOnboardingProvider: React.FC<SimpleOnboardingProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false)
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  // Simple steps for demo
  const demoSteps = [
    {
      target: '[data-tour="dashboard-header"]',
      content: 'Это заголовок дашборда. Здесь вы видите общую информацию о проекте.',
      title: 'Заголовок дашборда',
    },
    {
      target: '[data-tour="navigation"]',
      content: 'Это основная навигация по приложению. Здесь вы можете переключаться между разделами.',
      title: 'Навигация',
    },
    {
      target: '[data-tour="dashboard-actions"]',
      content: 'Здесь расположены быстрые действия, такие как создание нового лида.',
      title: 'Быстрые действия',
    },
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const startTour = (tourId: string) => {
    console.log('Starting tour:', tourId)
    setSteps(demoSteps)
    setIsActive(true)
    setRun(true)
  }

  const stopTour = () => {
    console.log('Stopping tour')
    setIsActive(false)
    setRun(false)
    setSteps([])
  }

  const handleJoyrideCallback = (data: any) => {
    const { status } = data
    if (status === 'finished' || status === 'skipped') {
      stopTour()
    }
  }

  const contextValue: OnboardingContextType = {
    isActive,
    startTour,
    stopTour
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
              beaconSize: 36,
              zIndex: 1000,
            },
            tooltip: {
              borderRadius: 8,
              fontSize: 14,
              padding: 20,
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
          }}
          locale={{
            back: 'Назад',
            close: 'Закрыть',
            last: 'Завершить',
            next: 'Далее',
            skip: 'Пропустить',
          }}
        />
      )}
    </OnboardingContext.Provider>
  )
}
