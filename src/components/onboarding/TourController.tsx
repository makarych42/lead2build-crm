'use client'

import React, { useState, useEffect } from 'react'
import { Play, Square, SkipForward, RotateCcw, HelpCircle } from 'lucide-react'
import { useOnboarding } from './OnboardingProvider'
import { useOnboardingStore, useOnboardingState, useOnboardingProgress } from '@/stores/useOnboardingStore'
import { useUsersStore } from '@/stores/useUsersStore'
import { getToursForRole } from '@/config/onboarding-tours'
import { UserRole } from '@/types'

interface TourControllerProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact' | 'floating'
}

export const TourController: React.FC<TourControllerProps> = ({ 
  className = '', 
  showLabel = true,
  variant = 'default'
}) => {
  const { isActive, currentTour, startTour, stopTour, skipTour } = useOnboarding()
  const onboardingState = useOnboardingState()
  const progress = useOnboardingProgress()
  const { getCurrentUser } = useUsersStore()

  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [availableTours, setAvailableTours] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user?.role) {
      setAvailableTours(getToursForRole(user.role as UserRole))
    }
  }, [])

  if (!currentUser) return null

  const handleStartTour = () => {
    // Начинаем с первого незавершенного тура
    const firstIncompleteTour = availableTours.find(tour => 
      !progress.completedTours.includes(tour.id)
    )
    
    if (firstIncompleteTour) {
      startTour(firstIncompleteTour.id)
    } else if (availableTours.length > 0) {
      // Если все туры завершены, начинаем с первого
      startTour(availableTours[0].id)
    }
  }

  const handleStopTour = () => {
    stopTour()
  }

  const handleSkipTour = () => {
    skipTour()
  }

  const handleRestartTours = () => {
    if (confirm('Начать все туры заново? Это сбросит ваш прогресс обучения.')) {
      // Сброс прогресса и начало с первого тура
      window.location.reload() // Простое решение для демо
    }
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          {isActive ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleStopTour}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                title="Остановить тур"
              >
                <Square className="h-5 w-5" />
              </button>
              <button
                onClick={handleSkipTour}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                title="Пропустить тур"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartTour}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
              title="Начать тур"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {isActive ? (
          <>
            <button
              onClick={handleStopTour}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Square className="h-4 w-4" />
              {showLabel && <span>Стоп</span>}
            </button>
            <button
              onClick={handleSkipTour}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              {showLabel && <span>Пропустить</span>}
            </button>
          </>
        ) : (
          <button
            onClick={handleStartTour}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            <Play className="h-4 w-4" />
            {showLabel && <span>Тур</span>}
          </button>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {isActive ? (
        <>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">
              Тур активен: {currentTour?.name || 'Обучение'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStopTour}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Square className="h-4 w-4" />
              <span>Остановить</span>
            </button>
            
            <button
              onClick={handleSkipTour}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              <span>Пропустить</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={handleStartTour}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Начать обучение</span>
          </button>
          
          {progress.completedTours.length > 0 && (
            <button
              onClick={handleRestartTours}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Повторить</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}

// Хук для удобного использования контроллера
export const useTourController = () => {
  const { isActive, currentTour, startTour, stopTour, skipTour } = useOnboarding()
  const onboardingState = useOnboardingState()
  const progress = useOnboardingProgress()
  const { getCurrentUser } = useUsersStore()

  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [availableTours, setAvailableTours] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user?.role) {
      setAvailableTours(getToursForRole(user.role as UserRole))
    }
  }, [])

  const startNextTour = () => {
    if (!currentUser) return
    
    const nextTour = availableTours.find(tour => 
      !progress.completedTours.includes(tour.id)
    )
    
    if (nextTour) {
      startTour(nextTour.id)
    }
  }

  const getProgressInfo = () => {
    if (!currentUser) return { completed: 0, total: 0, percentage: 0 }

    const completed = progress.completedTours.length
    const total = availableTours.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  }

  return {
    isActive,
    currentTour,
    startTour,
    stopTour,
    skipTour,
    startNextTour,
    progress: getProgressInfo(),
    showWelcomeModal: onboardingState.showWelcomeModal,
    showChecklist: onboardingState.showChecklist,
    toggleChecklist: onboardingState.toggleChecklistAction,
    resetOnboarding: onboardingState.resetOnboarding
  }
}
